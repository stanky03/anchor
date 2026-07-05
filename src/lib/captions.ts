import type { CaptionChunk } from "@/types";

const FILLER_WORD_PATTERN =
  /\b(um+|uh+|like|you know|sort of|kind of|basically|actually)\b/gi;

export function stripFillerWords(text: string): string {
  return text
    .replace(FILLER_WORD_PATTERN, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

export function getDisplayText(
  chunk: CaptionChunk,
  readingLevel: "original" | "grade8" | "grade6",
  reduceCognitiveLoad: boolean,
): string {
  const base =
    readingLevel === "original"
      ? chunk.text
      : chunk.simplifiedText ?? chunk.text;

  return reduceCognitiveLoad ? stripFillerWords(base) : base;
}

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
