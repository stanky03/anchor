"use client";

import { useEffect, useRef } from "react";

import { PanelShell } from "@/components/companion/PanelShell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimestamp } from "@/lib/format";
import { useMeetingStore } from "@/stores/meetingStore";

export function TranscriptPanel() {
  const transcriptPanel = useMeetingStore((state) => state.transcriptPanel);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptPanel.status === "ready") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcriptPanel]);

  return (
    <PanelShell
      title="Transcript"
      description="Rolling transcript from the meeting audio."
      status={transcriptPanel}
      loadingMessage="Listening…"
    >
      {(chunks) => (
        <ScrollArea className="h-[280px] pr-3">
          <ul className="space-y-3">
            {chunks.map((chunk) => (
              <li key={chunk.id} className="space-y-1">
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={`PT${chunk.timestamp}S`}
                >
                  {formatTimestamp(chunk.timestamp)}
                </time>
                <p>{chunk.text}</p>
              </li>
            ))}
          </ul>
          <div ref={bottomRef} />
        </ScrollArea>
      )}
    </PanelShell>
  );
}
