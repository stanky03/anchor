import { TASK_PATTERN } from "@/lib/catchup";
import { sortTranscriptChunks } from "@/lib/transcript";
import type { MeetingSignal, TranscriptChunk } from "@/types";

export const USER_SIGNAL_WINDOW_SEC = 600;

const DIRECT_QUESTION_PATTERN = /\b(can|could|would) you\b/i;
const DEADLINE_PATTERN =
  /\bby (monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|end of (day|week))\b/i;

const CONFIDENCE_RANK: Record<MeetingSignal["confidence"], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeName(text: string, name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  return new RegExp(`\\b${escapeRegex(trimmed)}\\b`, "i").test(text);
}

function isDirectAddress(text: string, name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;

  const directPattern = new RegExp(
    `(^|[,.!?]\\s*|\\b(hey|hi|okay|ok)\\s+)${escapeRegex(trimmed)}\\b`,
    "i",
  );
  return directPattern.test(text);
}

function hasTaskCue(text: string): boolean {
  return TASK_PATTERN.test(text) || DEADLINE_PATTERN.test(text);
}

function detectMention(
  chunk: TranscriptChunk,
  userName: string,
): MeetingSignal | null {
  if (!containsWholeName(chunk.text, userName)) return null;

  const confidence: MeetingSignal["confidence"] = isDirectAddress(
    chunk.text,
    userName,
  )
    ? "high"
    : "medium";

  return {
    type: "mention",
    text:
      confidence === "high"
        ? "You were mentioned directly."
        : "Possible mention of you.",
    timestamp: chunk.timestamp,
    confidence,
    sourceChunkIds: [chunk.id],
  };
}

function detectTaskForUser(
  chunk: TranscriptChunk,
  userName: string,
): MeetingSignal | null {
  if (!hasTaskCue(chunk.text)) return null;

  const named = containsWholeName(chunk.text, userName);
  const addressedToYou =
    named &&
    (isDirectAddress(chunk.text, userName) ||
      DIRECT_QUESTION_PATTERN.test(chunk.text) ||
      /\b(you|your)\b/i.test(chunk.text));

  if (!addressedToYou) return null;

  return {
    type: "task",
    text: "Possible task for you.",
    timestamp: chunk.timestamp,
    confidence: isDirectAddress(chunk.text, userName) ? "high" : "medium",
    sourceChunkIds: [chunk.id],
  };
}

function detectQuestionForUser(
  chunk: TranscriptChunk,
  userName: string,
): MeetingSignal | null {
  const text = chunk.text.trim();
  if (!text.endsWith("?")) return null;

  const named = containsWholeName(text, userName);
  const directQuestion = DIRECT_QUESTION_PATTERN.test(text);

  if (!named && !directQuestion) return null;

  return {
    type: "question",
    text: named
      ? "Possible question directed at you."
      : "Possible question for you.",
    timestamp: chunk.timestamp,
    confidence: named ? "high" : "medium",
    sourceChunkIds: [chunk.id],
  };
}

function dedupeSignals(signals: MeetingSignal[]): MeetingSignal[] {
  const byKey = new Map<string, MeetingSignal>();

  for (const signal of signals) {
    const chunkId = signal.sourceChunkIds[0];
    if (!chunkId) continue;

    const key = `${signal.type}-${chunkId}`;
    const existing = byKey.get(key);

    if (
      !existing ||
      CONFIDENCE_RANK[signal.confidence] > CONFIDENCE_RANK[existing.confidence]
    ) {
      byKey.set(key, signal);
    }
  }

  return [...byKey.values()].sort((left, right) => {
    if (left.timestamp !== right.timestamp) {
      return left.timestamp - right.timestamp;
    }

    return left.type.localeCompare(right.type);
  });
}

export function deriveMeetingSignals(
  chunks: TranscriptChunk[],
  userName: string,
  currentTimeSec: number,
  windowSec = USER_SIGNAL_WINDOW_SEC,
): MeetingSignal[] {
  const name = userName.trim();
  if (!name) return [];

  const windowStart = Math.max(0, currentTimeSec - windowSec);
  const recentFinal = sortTranscriptChunks(chunks).filter(
    (chunk) => chunk.isFinal && chunk.timestamp >= windowStart,
  );

  const signals: MeetingSignal[] = [];

  for (const chunk of recentFinal) {
    const mention = detectMention(chunk, name);
    if (mention) signals.push(mention);

    const task = detectTaskForUser(chunk, name);
    if (task) signals.push(task);

    const question = detectQuestionForUser(chunk, name);
    if (
      question &&
      !signals.some(
        (signal) =>
          signal.type === "task" && signal.sourceChunkIds[0] === chunk.id,
      )
    ) {
      signals.push(question);
    }
  }

  return dedupeSignals(signals);
}

export function meetingSignalsEqual(
  left: MeetingSignal[],
  right: MeetingSignal[],
): boolean {
  if (left.length !== right.length) return false;

  return left.every((signal, index) => {
    const other = right[index];
    return (
      signal.type === other.type &&
      signal.text === other.text &&
      signal.timestamp === other.timestamp &&
      signal.confidence === other.confidence &&
      signal.sourceChunkIds.join("|") === other.sourceChunkIds.join("|")
    );
  });
}

export function getSignalLabel(signal: MeetingSignal): string {
  switch (signal.type) {
    case "mention":
      return signal.confidence === "high"
        ? "Mention"
        : "Possible mention";
    case "task":
      return "Possible task";
    case "question":
      return "Possible question";
    default:
      return "Signal";
  }
}
