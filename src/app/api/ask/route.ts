import { NextResponse } from "next/server";

import { getDemoTranscriptText } from "@/lib/demo";
import {
  buildAskMeetingPrompt,
  getDemoAskAnswer,
  isLlmConfigured,
} from "@/lib/llm";
import type { AskMeetingRequest } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as AskMeetingRequest;

  if (!body.prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const transcript =
    body.transcript ??
    (typeof body.fromTimestamp === "number" &&
    typeof body.toTimestamp === "number"
      ? getDemoTranscriptText(body.fromTimestamp, body.toTimestamp)
      : "");

  if (!transcript.trim()) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 },
    );
  }

  void buildAskMeetingPrompt(body.prompt, transcript, body.userName);

  return NextResponse.json(
    isLlmConfigured()
      ? {
          ...getDemoAskAnswer(body.prompt, body.userName),
          stub: true,
          message: "LLM ask not wired yet — returning demo fallback",
        }
      : getDemoAskAnswer(body.prompt, body.userName),
  );
}
