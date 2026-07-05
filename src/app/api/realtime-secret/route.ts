import { NextResponse } from "next/server";
import OpenAI from "openai";

import { isOpenAiConfigured } from "@/lib/llm";
import {
  DEFAULT_TRANSCRIBE_MODEL,
  type RealtimeSecretResponse,
} from "@/lib/stt";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  client ??= new OpenAI({ timeout: 15_000, maxRetries: 1 });
  return client;
}

export async function POST() {
  if (!isOpenAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Live transcription isn't configured — set OPENAI_API_KEY on the server",
      },
      { status: 503 },
    );
  }

  const model = process.env.OPENAI_TRANSCRIBE_MODEL ?? DEFAULT_TRANSCRIBE_MODEL;

  try {
    const secret = await getClient().realtime.clientSecrets.create({
      expires_after: { anchor: "created_at", seconds: 600 },
      session: {
        type: "transcription",
        audio: {
          input: {
            format: { type: "audio/pcm", rate: 24000 },
            noise_reduction: { type: "near_field" },
            transcription: { model },
            turn_detection: {
              type: "server_vad",
              silence_duration_ms: 600,
              prefix_padding_ms: 300,
            },
          },
        },
      },
    });

    const response: RealtimeSecretResponse = {
      value: secret.value,
      expiresAt: secret.expires_at * 1000,
      model,
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof OpenAI.APIConnectionTimeoutError) {
      return NextResponse.json(
        { error: "Starting live transcription timed out" },
        { status: 504 },
      );
    }

    // Never log the secret value.
    console.error(
      "[realtime-secret] failed to mint client secret:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Could not start live transcription" },
      { status: 502 },
    );
  }
}
