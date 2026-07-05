import { NextResponse } from "next/server";

import { buildActionItemsPrompt } from "@/lib/llm";

type ActionItemsRequest = {
  transcript: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ActionItemsRequest;

  if (!body.transcript) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 },
    );
  }

  // Phase 2: call LLM with buildActionItemsPrompt(body.transcript)
  void buildActionItemsPrompt(body.transcript);

  return NextResponse.json({
    actionItems: [],
    stub: true,
    message: "Action item extraction not wired yet",
  });
}
