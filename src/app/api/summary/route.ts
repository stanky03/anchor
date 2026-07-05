import { NextResponse } from "next/server";

import { buildSummaryPrompt } from "@/lib/llm";

type SummaryRequest = {
  transcript: string;
  fromTimestamp?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SummaryRequest;

  if (!body.transcript) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 },
    );
  }

  // Phase 2: call LLM with buildSummaryPrompt(body.transcript)
  void buildSummaryPrompt(body.transcript);

  return NextResponse.json({
    text: "Summary generation will be wired in Phase 2.",
    updatedAt: Date.now(),
    coversFromTimestamp: body.fromTimestamp ?? 0,
    stub: true,
  });
}
