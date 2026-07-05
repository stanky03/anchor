"use client";

import { useRef, useState } from "react";

import { AskTheMeetingPanel } from "@/components/companion/AskTheMeetingPanel";
import { CurrentThreadPanel } from "@/components/companion/CurrentThreadPanel";
import { DoINeedToDoAnythingPanel } from "@/components/companion/DoINeedToDoAnythingPanel";
import { MeetingControls } from "@/components/companion/MeetingControls";
import { TranscriptPanel } from "@/components/companion/TranscriptPanel";
import { UserNameField } from "@/components/companion/UserNameField";
import { useAudioCapture } from "@/hooks/useAudioCapture";
import {
  catchUpCardToUserActionItems,
  deriveCurrentThread,
  getDemoTranscriptUpTo,
  runDemoPlayback,
} from "@/lib/demo";
import { readyPanel } from "@/lib/panel-state";
import {
  meetingErrors,
  meetingLoading,
  useMeetingStore,
} from "@/stores/meetingStore";
import { useUserStore } from "@/stores/userStore";

export function MeetingCompanion() {
  const [isStarting, setIsStarting] = useState(false);
  const [isCatchingUp, setIsCatchingUp] = useState(false);
  const demoAbortRef = useRef<AbortController | null>(null);

  const userName = useUserStore((state) => state.userName);
  const {
    sessionState,
    playbackTimeSec,
    lostMarkerTimestamp,
    transcript,
    setSessionState,
    setPlaybackTimeSec,
    setLostMarker,
    setTranscript,
    setCurrentThread,
    setCatchUp,
    setUserActionItems,
    setTranscriptPanel,
    reset,
  } = useMeetingStore();

  const { startMicrophoneCapture, stopCapture } = useAudioCapture();

  const stopMeeting = () => {
    demoAbortRef.current?.abort();
    demoAbortRef.current = null;
    stopCapture();
    setSessionState("stopped");
    setTranscriptPanel({
      status: "ready",
      data: transcript,
    });
  };

  const resetMeeting = () => {
    demoAbortRef.current?.abort();
    demoAbortRef.current = null;
    stopCapture();
    reset();
  };

  const startMeeting = async () => {
    if (!userName.trim()) return;

    resetMeeting();
    setIsStarting(true);
    setSessionState("active");
    setTranscriptPanel(meetingLoading.transcript);
    setCurrentThread({
      status: "empty",
      message: "Listening for the current topic…",
    });

    try {
      await startMicrophoneCapture();
    } catch {
      setTranscriptPanel(meetingErrors.transcript);
      setSessionState("idle");
      setIsStarting(false);
      return;
    }

    const controller = new AbortController();
    demoAbortRef.current = controller;

    await runDemoPlayback((timeSec) => {
      setPlaybackTimeSec(timeSec);
      const chunks = getDemoTranscriptUpTo(timeSec);
      setTranscript(chunks);
      setCurrentThread(readyPanel(deriveCurrentThread(timeSec)));
    }, controller.signal);

    stopCapture();
    setSessionState("stopped");
    setIsStarting(false);
  };

  const handleImLost = () => {
    setLostMarker(
      playbackTimeSec,
      "Got it — click Catch me up when you're ready.",
    );
  };

  const handleCatchMeUp = async () => {
    if (sessionState !== "active" && sessionState !== "stopped") return;

    setIsCatchingUp(true);
    setCurrentThread(meetingLoading.currentThread);
    setCatchUp(meetingLoading.catchUp);
    setUserActionItems(meetingLoading.userActionItems);

    const toTimestamp = playbackTimeSec;
    const fromTimestamp =
      lostMarkerTimestamp ?? Math.max(0, playbackTimeSec - 120);

    try {
      const response = await fetch("/api/catch-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromTimestamp,
          toTimestamp,
          userName: userName.trim() || undefined,
          transcript: transcript.map((chunk) => chunk.text).join("\n"),
        }),
      });

      if (!response.ok) {
        throw new Error("Catch-up failed");
      }

      const card = await response.json();

      setCatchUp(readyPanel(card));
      setCurrentThread(
        readyPanel({
          currentTopic: card.currentTopic,
          lastDecision: card.decisions.at(-1),
          openQuestion: card.openQuestions.at(0) ?? card.suggestedQuestion,
        }),
      );
      setUserActionItems(readyPanel(catchUpCardToUserActionItems(card)));
      setLostMarker(null, null);
    } catch {
      setCurrentThread(meetingErrors.currentThread);
      setCatchUp(meetingErrors.catchUp);
      setUserActionItems(meetingErrors.userActionItems);
    } finally {
      setIsCatchingUp(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Meeting Catch-Up Companion
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              A calm assistive companion for when you lose the thread in a live
              meeting.
            </p>
          </div>
          <UserNameField />
        </div>
        <div className="mx-auto mt-4 max-w-6xl">
          <MeetingControls
            onStartMeeting={startMeeting}
            onStopMeeting={stopMeeting}
            onImLost={handleImLost}
            onCatchMeUp={handleCatchMeUp}
            isStarting={isStarting}
            isCatchingUp={isCatchingUp}
          />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 lg:grid-cols-2">
        <CurrentThreadPanel />
        <DoINeedToDoAnythingPanel />
        <AskTheMeetingPanel />
        <TranscriptPanel />
      </main>
    </div>
  );
}
