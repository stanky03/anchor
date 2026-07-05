"use client";

import { useRef, useState } from "react";

import { AccessibilityPanel } from "@/components/AccessibilityPanel";
import { ActionItemsList } from "@/components/ActionItemsList";
import { CaptionDisplay } from "@/components/CaptionDisplay";
import { MeetingHeader } from "@/components/MeetingHeader";
import { MissedSegmentModal } from "@/components/MissedSegmentModal";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Button } from "@/components/ui/button";
import {
  DEMO_TRANSCRIPT,
  getDemoActionItemsUpTo,
  getDemoCaptionsUpTo,
  runDemoPlayback,
} from "@/lib/demo";
import { useAudioCapture } from "@/hooks/useAudioCapture";
import { useCaptionStore } from "@/stores/captionStore";

export function MeetingCopilot() {
  const [missedOpen, setMissedOpen] = useState(false);
  const demoAbortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    reset,
    setMode,
    setIsCapturing,
    setIsDemoMode,
    setCaptions,
    setActionItems,
    setSummary,
    setPlaybackTimeSec,
  } = useCaptionStore();

  const { startTabCapture, startFileCapture, stopCapture } = useAudioCapture();

  const stopSession = () => {
    demoAbortRef.current?.abort();
    demoAbortRef.current = null;
    stopCapture();
    reset();
  };

  const startDemo = async () => {
    stopSession();
    setMode("demo");
    setIsDemoMode(true);
    setIsCapturing(true);
    setSummary({
      text: DEMO_TRANSCRIPT.summary,
      updatedAt: Date.now(),
      coversFromTimestamp: 0,
    });

    const controller = new AbortController();
    demoAbortRef.current = controller;

    await runDemoPlayback((timeSec) => {
      setPlaybackTimeSec(timeSec);
      setCaptions(getDemoCaptionsUpTo(timeSec));
      setActionItems(getDemoActionItemsUpTo(timeSec));
    }, controller.signal);

    setIsCapturing(false);
  };

  const startLive = async () => {
    stopSession();
    setMode("live");
    setIsDemoMode(false);

    try {
      await startTabCapture();
      setIsCapturing(true);
      // Phase 1: connect tab audio stream to STT pipeline.
    } catch {
      setMode("idle");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    stopSession();
    setMode("upload");
    setIsDemoMode(false);

    try {
      await startFileCapture(file);
      setIsCapturing(true);
      // Phase 1: send uploaded file to STT pipeline.
    } catch {
      setMode("idle");
    }

    event.target.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MeetingHeader
        onStartDemo={startDemo}
        onStartLive={startLive}
        onStop={stopSession}
        onUpload={handleUploadClick}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp4,.wav,.webm"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[1fr_320px]">
        <div className="flex min-h-0 flex-col gap-4">
          <CaptionDisplay />
        </div>

        <aside className="flex min-h-0 flex-col gap-4">
          <AccessibilityPanel />
          <SummaryPanel />
        </aside>
      </main>

      <footer className="grid gap-4 border-t p-4 lg:grid-cols-[1fr_auto]">
        <ActionItemsList />
        <div className="flex flex-wrap items-end justify-end gap-2">
          <Button variant="secondary" onClick={() => setMissedOpen(true)}>
            What did I miss?
          </Button>
          <Button variant="outline" disabled>
            Export
          </Button>
        </div>
      </footer>

      <MissedSegmentModal open={missedOpen} onOpenChange={setMissedOpen} />
    </div>
  );
}
