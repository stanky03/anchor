"use client";

import { PanelShell } from "@/components/companion/PanelShell";
import { formatTimestamp } from "@/lib/format";
import { useMeetingStore } from "@/stores/meetingStore";

export function DoINeedToDoAnythingPanel() {
  const userActionItems = useMeetingStore((state) => state.userActionItems);
  const catchUp = useMeetingStore((state) => state.catchUp);

  const status =
    catchUp.status === "loading" ? catchUp : userActionItems;

  return (
    <PanelShell
      title="Do I Need To Do Anything?"
      description="Possible tasks, mentions, and questions — phrased cautiously."
      status={status}
      loadingMessage="Checking for mentions and tasks…"
    >
      {(items) =>
        items.length === 0 ? (
          <p className="text-muted-foreground">
            Nothing flagged for you yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="space-y-1">
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground">{item.sourceSnippet}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(item.timestamp)} · {item.confidence}{" "}
                  confidence
                </p>
              </li>
            ))}
          </ul>
        )
      }
    </PanelShell>
  );
}
