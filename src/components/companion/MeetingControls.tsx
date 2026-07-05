"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMeetingStore } from "@/stores/meetingStore";
import { useUserStore } from "@/stores/userStore";

type MeetingControlsProps = {
  onStartMeeting: () => void;
  onStopMeeting: () => void;
  onImLost: () => void;
  onCatchMeUp: () => void;
  isStarting?: boolean;
  isCatchingUp?: boolean;
};

export function MeetingControls({
  onStartMeeting,
  onStopMeeting,
  onImLost,
  onCatchMeUp,
  isStarting = false,
  isCatchingUp = false,
}: MeetingControlsProps) {
  const userName = useUserStore((state) => state.userName);
  const sessionState = useMeetingStore((state) => state.sessionState);
  const lostMarkerMessage = useMeetingStore((state) => state.lostMarkerMessage);

  const isActive = sessionState === "active";
  const canStart = userName.trim().length > 0 && !isActive && !isStarting;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {!isActive ? (
          <Button onClick={onStartMeeting} disabled={!canStart || isStarting}>
            {isStarting ? "Starting…" : "Start meeting"}
          </Button>
        ) : (
          <Button variant="outline" onClick={onStopMeeting}>
            Stop meeting
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onImLost}
          disabled={!isActive}
        >
          I&apos;m lost
        </Button>
        <Button
          onClick={onCatchMeUp}
          disabled={!isActive || isCatchingUp}
        >
          {isCatchingUp ? "Catching up…" : "Catch me up"}
        </Button>
        {isActive && <Badge variant="secondary">Meeting active</Badge>}
        {sessionState === "stopped" && (
          <Badge variant="outline">Meeting ended</Badge>
        )}
      </div>

      {!userName.trim() && (
        <p className="text-sm text-muted-foreground">
          Enter your name before starting a meeting.
        </p>
      )}

      {lostMarkerMessage && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {lostMarkerMessage}
        </p>
      )}
    </div>
  );
}
