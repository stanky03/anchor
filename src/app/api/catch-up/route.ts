import { NextResponse } from "next/server";

import {
  getDemoCatchUpCard,
  getDemoTranscriptText,
  getDemoUserActionItems,
} from "@/lib/demo";
import { buildCatchUpPrompt, isLlmConfigured } from "@/lib/llm";
import type { CatchUpRequest } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as CatchUpRequest;

  if (
    typeof body.fromTimestamp !== "number" ||
    typeof body.toTimestamp !== "number"
  ) {
    return NextResponse.json(
      { error: "fromTimestamp and toTimestamp are required" },
      { status: 400 },
    );
  }

  const transcript =
    body.transcript ??
    getDemoTranscriptText(body.fromTimestamp, body.toTimestamp);

  if (!transcript.trim()) {
    return NextResponse.json(
      { error: "No transcript found for that time range." },
      { status: 404 },
    );
  }

  void buildCatchUpPrompt(transcript, body.userName);

  if (!isLlmConfigured()) {
    const card = getDemoCatchUpCard(
      body.fromTimestamp,
      body.toTimestamp,
      body.userName,
    );

    const userItems = getDemoUserActionItems(
      body.fromTimestamp,
      body.toTimestamp,
      body.userName,
    );

    if (userItems.length > 0 && card.possibleTasksForUser.length <= 1) {
      card.possibleTasksForUser = userItems.map(
        (item) => `${item.label}: ${item.sourceSnippet}`,
      );
    }

    return NextResponse.json(card);
  }

  const card = getDemoCatchUpCard(
    body.fromTimestamp,
    body.toTimestamp,
    body.userName,
  );

  return NextResponse.json({
    ...card,
    stub: true,
    message: "LLM catch-up not wired yet — returning demo fallback",
  });
}
