"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { announce } from "@/components/StatusAnnouncer";
import {
  REALTIME_WSS_URL,
  pcm16ToBase64,
  realtimeSubprotocols,
  type RealtimeSecretResponse,
} from "@/lib/stt";
import { useCaptionStore } from "@/stores/captionStore";

export type TranscriptionStatus = "idle" | "connecting" | "listening" | "error";

type PendingItem = {
  text: string;
  timestamp: number;
};

type RealtimeServerEvent = {
  type: string;
  item_id?: string;
  audio_start_ms?: number;
  delta?: string;
  transcript?: string;
  session?: { type?: string };
  error?: { message?: string; type?: string; code?: string };
};

const CONNECTION_LOST_MESSAGE =
  "Transcription lost — captions paused. Press Stop, then Start listening to reconnect.";

function sessionTimestamp(audioEpochMs: number | null): number {
  const { sessionStartedAtMs, playbackTimeSec } = useCaptionStore.getState();
  const startMs = sessionStartedAtMs ?? audioEpochMs;
  if (startMs === null) return playbackTimeSec;
  return Math.max(0, (Date.now() - startMs) / 1000);
}

export function useTranscription() {
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const generationRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const itemsRef = useRef<Map<string, PendingItem>>(new Map());
  const audioEpochMsRef = useRef<number | null>(null);

  const teardown = useCallback(() => {
    const ws = wsRef.current;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000);
      }
      wsRef.current = null;
    }

    const ctx = audioContextRef.current;
    if (ctx) {
      void ctx.close().catch(() => {});
      audioContextRef.current = null;
    }

    itemsRef.current.clear();
    audioEpochMsRef.current = null;
  }, []);

  const stop = useCallback(() => {
    generationRef.current += 1;
    teardown();
    setStatus("idle");
    setError(null);
  }, [teardown]);

  useEffect(() => stop, [stop]);

  const failSession = useCallback(
    (generation: number, message: string) => {
      if (generation !== generationRef.current) return;
      teardown();
      setStatus("error");
      setError(message);
      announce(message);
    },
    [teardown],
  );

  const handleServerEvent = useCallback(
    (event: RealtimeServerEvent, generation: number) => {
      if (generation !== generationRef.current) return;
      const items = itemsRef.current;

      switch (event.type) {
        case "session.created": {
          setStatus("listening");
          announce("Transcription connected");
          break;
        }
        case "input_audio_buffer.speech_started": {
          if (!event.item_id) break;
          const epoch = audioEpochMsRef.current;
          const { sessionStartedAtMs } = useCaptionStore.getState();
          const timestamp =
            epoch !== null && typeof event.audio_start_ms === "number"
              ? Math.max(
                  0,
                  (epoch +
                    event.audio_start_ms -
                    (sessionStartedAtMs ?? epoch)) /
                    1000,
                )
              : sessionTimestamp(epoch);
          items.set(event.item_id, { text: "", timestamp });
          break;
        }
        case "conversation.item.input_audio_transcription.delta": {
          if (!event.item_id) break;
          const item = items.get(event.item_id) ?? {
            text: "",
            timestamp: sessionTimestamp(audioEpochMsRef.current),
          };
          item.text += event.delta ?? "";
          items.set(event.item_id, item);
          if (item.text.trim()) {
            useCaptionStore.getState().upsertTranscriptChunk({
              id: event.item_id,
              text: item.text,
              timestamp: item.timestamp,
              isFinal: false,
            });
          }
          break;
        }
        case "conversation.item.input_audio_transcription.completed": {
          if (!event.item_id) break;
          const item = items.get(event.item_id);
          const transcript = event.transcript?.trim() ?? "";
          if (transcript) {
            // addCaption's reconcile also finalizes the same-id transcript
            // chunk, so this is the only store call needed for a final.
            useCaptionStore.getState().addCaption({
              id: event.item_id,
              speaker: "Speaker",
              text: transcript,
              timestamp:
                item?.timestamp ?? sessionTimestamp(audioEpochMsRef.current),
            });
          }
          items.delete(event.item_id);
          break;
        }
        case "conversation.item.input_audio_transcription.failed": {
          console.warn("[transcription] item failed:", event.error?.message);
          if (event.item_id) items.delete(event.item_id);
          break;
        }
        case "error": {
          // Most realtime errors are recoverable and the session stays open;
          // the socket's close handler escalates the fatal ones.
          console.error("[transcription] server error:", event.error?.message);
          break;
        }
        default:
          break;
      }
    },
    [],
  );

  const start = useCallback(
    async (stream: MediaStream) => {
      generationRef.current += 1;
      const generation = generationRef.current;
      teardown();
      setError(null);
      setStatus("connecting");

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        failSession(generation, "No audio track to transcribe");
        return;
      }

      let secret: RealtimeSecretResponse;
      try {
        const response = await fetch("/api/realtime-secret", {
          method: "POST",
        });
        const data = (await response.json()) as
          | RealtimeSecretResponse
          | { error: string };
        if (!response.ok || "error" in data) {
          failSession(
            generation,
            "error" in data
              ? data.error
              : "Could not start live transcription",
          );
          return;
        }
        secret = data;
      } catch {
        failSession(generation, "Could not start live transcription");
        return;
      }

      if (generation !== generationRef.current) return;

      const ws = new WebSocket(
        REALTIME_WSS_URL,
        realtimeSubprotocols(secret.value),
      );
      wsRef.current = ws;

      ws.onopen = async () => {
        if (generation !== generationRef.current) return;
        try {
          const ctx = new AudioContext({ sampleRate: 24000 });
          audioContextRef.current = ctx;
          await ctx.audioWorklet.addModule(
            "/worklets/pcm16-recorder.worklet.js",
          );
          if (generation !== generationRef.current) return;

          const source = ctx.createMediaStreamSource(
            new MediaStream([audioTrack]),
          );
          const node = new AudioWorkletNode(ctx, "pcm16-recorder");
          // Not connected to ctx.destination — no local echo of the meeting.
          source.connect(node);

          audioEpochMsRef.current = Date.now();
          node.port.onmessage = (messageEvent: MessageEvent<ArrayBuffer>) => {
            if (generation !== generationRef.current) return;
            if (ws.readyState !== WebSocket.OPEN) return;
            ws.send(
              JSON.stringify({
                type: "input_audio_buffer.append",
                audio: pcm16ToBase64(new Int16Array(messageEvent.data)),
              }),
            );
          };
        } catch {
          failSession(
            generation,
            "Live transcription isn't supported in this browser yet",
          );
        }
      };

      ws.onmessage = (messageEvent: MessageEvent<string>) => {
        try {
          handleServerEvent(
            JSON.parse(messageEvent.data) as RealtimeServerEvent,
            generation,
          );
        } catch {
          // Ignore unparseable frames.
        }
      };

      ws.onclose = () => failSession(generation, CONNECTION_LOST_MESSAGE);
      ws.onerror = () => failSession(generation, CONNECTION_LOST_MESSAGE);
    },
    [failSession, handleServerEvent, teardown],
  );

  return { status, error, start, stop };
}
