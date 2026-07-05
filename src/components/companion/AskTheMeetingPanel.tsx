"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAskPromptLabel } from "@/lib/llm";
import {
  meetingErrors,
  meetingLoading,
  useMeetingStore,
} from "@/stores/meetingStore";
import { useUserStore } from "@/stores/userStore";
import type { AskMeetingPrompt } from "@/types";

const ASK_PROMPTS: AskMeetingPrompt[] = [
  "whatDidIMiss",
  "whatAreWeDeciding",
  "doINeedToDoAnything",
  "explainSimply",
  "whatQuestionShouldIAsk",
];

export function AskTheMeetingPanel() {
  const [activePrompt, setActivePrompt] = useState<AskMeetingPrompt | null>(
    null,
  );
  const sessionState = useMeetingStore((state) => state.sessionState);
  const playbackTimeSec = useMeetingStore((state) => state.playbackTimeSec);
  const transcript = useMeetingStore((state) => state.transcript);
  const askResponse = useMeetingStore((state) => state.askResponse);
  const setAskResponse = useMeetingStore((state) => state.setAskResponse);
  const userName = useUserStore((state) => state.userName);

  const handleAsk = async (prompt: AskMeetingPrompt) => {
    if (sessionState !== "active" && sessionState !== "stopped") {
      setAskResponse({
        status: "empty",
        message: "Pick a prompt once the meeting is running.",
      });
      return;
    }

    if (transcript.length === 0) {
      setAskResponse({
        status: "empty",
        message: "Pick a prompt once the meeting is running.",
      });
      return;
    }

    setActivePrompt(prompt);
    setAskResponse(meetingLoading.askResponse);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          userName: userName.trim() || undefined,
          transcript: transcript.map((chunk) => chunk.text).join("\n"),
          fromTimestamp: Math.max(0, playbackTimeSec - 120),
          toTimestamp: playbackTimeSec,
        }),
      });

      if (!response.ok) {
        throw new Error("Ask request failed");
      }

      const data = await response.json();
      setAskResponse({ status: "ready", data });
    } catch {
      setAskResponse(meetingErrors.askResponse);
    } finally {
      setActivePrompt(null);
    }
  };

  const canAsk =
    (sessionState === "active" || sessionState === "stopped") &&
    transcript.length > 0;

  return (
    <Card className="flex min-h-[220px] flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ask the Meeting</CardTitle>
        <CardDescription>
          Short, constrained prompts — not a generic chatbot.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 text-sm leading-relaxed">
        <div className="flex flex-wrap gap-2">
          {ASK_PROMPTS.map((prompt) => (
            <Button
              key={prompt}
              variant={activePrompt === prompt ? "default" : "outline"}
              size="sm"
              disabled={!canAsk || activePrompt !== null}
              onClick={() => handleAsk(prompt)}
            >
              {getAskPromptLabel(prompt)}
            </Button>
          ))}
        </div>

        {askResponse.status === "empty" && (
          <p className="text-muted-foreground">{askResponse.message}</p>
        )}
        {askResponse.status === "loading" && (
          <p className="text-muted-foreground">Thinking…</p>
        )}
        {askResponse.status === "error" && (
          <p className="text-destructive">{askResponse.message}</p>
        )}
        {askResponse.status === "ready" && (
          <div className="space-y-2">
            <p>{askResponse.data.answer}</p>
            {askResponse.data.sources &&
              askResponse.data.sources.length > 0 && (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {askResponse.data.sources.map((source) => (
                    <li key={source}>Source: {source}</li>
                  ))}
                </ul>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
