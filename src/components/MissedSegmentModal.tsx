"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCaptionStore } from "@/stores/captionStore";
import type { MissedSegmentResponse } from "@/types";

type MissedSegmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MissedSegmentModal({
  open,
  onOpenChange,
}: MissedSegmentModalProps) {
  const playbackTimeSec = useCaptionStore((state) => state.playbackTimeSec);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MissedSegmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestRecap = async (fromTimestamp: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/missed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromTimestamp,
          toTimestamp: playbackTimeSec,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recap");
      }

      const data = (await response.json()) as MissedSegmentResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>What did I miss?</DialogTitle>
          <DialogDescription>
            Pick a time range to get a short recap and any new action items.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => requestRecap(Math.max(0, playbackTimeSec - 120))}
          >
            Last 2 minutes
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => requestRecap(Math.max(0, playbackTimeSec - 90))}
          >
            Last 90 seconds
          </Button>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Generating recap…</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result && (
          <div className="space-y-3 text-sm">
            <p className="leading-relaxed">{result.recap}</p>
            {result.actionItems.length > 0 && (
              <ul className="space-y-1">
                {result.actionItems.map((item) => (
                  <li key={item.id}>
                    • {item.assignee ? `${item.assignee} → ` : ""}
                    {item.task}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
