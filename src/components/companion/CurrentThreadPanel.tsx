"use client";

import { PanelShell } from "@/components/companion/PanelShell";
import { useMeetingStore } from "@/stores/meetingStore";

export function CurrentThreadPanel() {
  const currentThread = useMeetingStore((state) => state.currentThread);

  return (
    <PanelShell
      title="Current Thread"
      description="Where the conversation is right now."
      status={currentThread}
      loadingMessage="Updating thread…"
    >
      {(thread) => (
        <dl className="space-y-3">
          <div>
            <dt className="font-medium">Current topic</dt>
            <dd className="text-muted-foreground">
              {thread.currentTopic ?? "Still forming…"}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Last decision</dt>
            <dd className="text-muted-foreground">
              {thread.lastDecision ?? "None captured yet."}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Open question</dt>
            <dd className="text-muted-foreground">
              {thread.openQuestion ?? "No open question right now."}
            </dd>
          </div>
        </dl>
      )}
    </PanelShell>
  );
}
