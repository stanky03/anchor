import { NextResponse } from "next/server";

import { buildSimplifyPrompt } from "@/lib/llm";
import type { ReadingLevel } from "@/types";

type SimplifyRequest = {
  text: string;
  readingLevel: ReadingLevel;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SimplifyRequest;

  if (!body.text || !body.readingLevel) {
    return NextResponse.json(
      { error: "text and readingLevel are required" },
      { status: 400 },
    );
  }

  if (body.readingLevel === "original") {
    return NextResponse.json({ text: body.text });
  }

  // Phase 2: call OpenAI / Gemini with buildSimplifyPrompt(body.text, body.readingLevel)
  void buildSimplifyPrompt(body.text, body.readingLevel);

  return NextResponse.json({
    text: body.text,
    stub: true,
    message: "LLM simplify not wired yet — returning original text",
  });
}
