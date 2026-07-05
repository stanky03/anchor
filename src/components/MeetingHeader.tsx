"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCaptionStore } from "@/stores/captionStore";

type MeetingHeaderProps = {
  onStartDemo: () => void;
  onStartLive: () => void;
  onStop: () => void;
  onUpload: () => void;
};

export function MeetingHeader({
  onStartDemo,
  onStartLive,
  onStop,
  onUpload,
}: MeetingHeaderProps) {
  const { mode, isCapturing, isDemoMode } = useCaptionStore();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">
          Accessible Meeting Copilot
        </h1>
        {isDemoMode && <Badge variant="secondary">Demo mode</Badge>}
        {isCapturing && (
          <Badge className="bg-emerald-600 text-white">Live</Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={mode === "demo" ? "default" : "outline"}
          size="sm"
          onClick={onStartDemo}
        >
          Demo
        </Button>
        <Button
          variant={mode === "live" ? "default" : "outline"}
          size="sm"
          onClick={onStartLive}
        >
          Live
        </Button>
        <Button variant="outline" size="sm" onClick={onUpload}>
          Upload
        </Button>
        {(isCapturing || mode !== "idle") && (
          <Button variant="ghost" size="sm" onClick={onStop}>
            Stop
          </Button>
        )}
      </div>
    </header>
  );
}
