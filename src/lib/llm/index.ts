import type { ReadingLevel } from "@/types";

export type LlmProvider = "openai" | "gemini";

export function getLlmProvider(): LlmProvider {
  return process.env.GEMINI_API_KEY ? "gemini" : "openai";
}

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);
}

export function buildSimplifyPrompt(text: string, readingLevel: ReadingLevel) {
  const target =
    readingLevel === "grade6"
      ? "grade 6 reading level"
      : "grade 8 reading level";

  return `Rewrite the following meeting caption in plain ${target}. Keep names and decisions intact. Return only the rewritten text.\n\n${text}`;
}

export function buildSummaryPrompt(transcript: string) {
  return `Summarize this meeting transcript in plain language (grade 6 reading level). Use 2-3 short sentences.\n\n${transcript}`;
}

export function buildActionItemsPrompt(transcript: string) {
  return `Extract action items from this meeting transcript. Return JSON array of { "assignee": string | null, "task": string }.\n\n${transcript}`;
}

export function buildMissedSegmentPrompt(transcript: string) {
  return `The user missed part of a meeting. Write a short recap (2-3 sentences) and list any new action items.\n\n${transcript}`;
}
