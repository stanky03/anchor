import type {
  CatchUpCard,
  CurrentThread,
  TranscriptChunk,
  UserActionItem,
} from "@/types";

type DemoChunk = {
  id: string;
  speaker?: string;
  text: string;
  timestamp: number;
  isActionItem?: boolean;
  isDecision?: boolean;
};

type DemoActionItem = {
  id: string;
  assignee?: string;
  task: string;
  timestamp: number;
  sourceCaptionId: string;
};

export type DemoTranscript = {
  title: string;
  durationSec: number;
  chunks: DemoChunk[];
  actionItems: DemoActionItem[];
  summary: string;
};

import demoTranscript from "./demo-transcript.json";

export const DEMO_TRANSCRIPT = demoTranscript as DemoTranscript;

export function toTranscriptChunk(chunk: DemoChunk): TranscriptChunk {
  return {
    id: chunk.id,
    text: chunk.text,
    timestamp: chunk.timestamp,
    isFinal: true,
  };
}

export function getDemoTranscriptUpTo(timeSec: number): TranscriptChunk[] {
  return DEMO_TRANSCRIPT.chunks
    .filter((chunk) => chunk.timestamp <= timeSec)
    .map(toTranscriptChunk);
}

export function getDemoTranscriptText(
  fromTimestamp: number,
  toTimestamp: number,
  includeSpeaker = false,
): string {
  return DEMO_TRANSCRIPT.chunks
    .filter(
      (chunk) =>
        chunk.timestamp >= fromTimestamp && chunk.timestamp <= toTimestamp,
    )
    .map((chunk) =>
      includeSpeaker && chunk.speaker
        ? `${chunk.speaker}: ${chunk.text}`
        : chunk.text,
    )
    .join("\n");
}

export function deriveCurrentThread(timeSec: number): CurrentThread {
  if (timeSec < 5) {
    return {};
  }

  if (timeSec < 42) {
    return {
      currentTopic: "Login fix and API ownership",
      openQuestion: "Whether to sync on auth flow before starting API work",
    };
  }

  if (timeSec < 80) {
    return {
      currentTopic: "Dashboard scope for v1",
      lastDecision: "Keep the old dashboard for v1; redesign is Q2.",
      openQuestion: "Whether the old dashboard is only for launch",
    };
  }

  if (timeSec < 150) {
    return {
      currentTopic: "Auth documentation",
      lastDecision: "Keep the old dashboard for v1.",
      openQuestion: "Who owns the auth flow documentation",
    };
  }

  return {
    currentTopic: "Sprint wrap-up and stakeholder follow-up",
    lastDecision: "Login fix by Friday; dashboard stays as-is for v1.",
    openQuestion: "Whether v1 dashboard scope covers the whole cycle",
  };
}

export function getDemoCatchUpCard(
  fromTimestamp: number,
  toTimestamp: number,
  userName?: string,
): CatchUpCard {
  const normalizedName = userName?.trim().toLowerCase();
  const chunksInRange = DEMO_TRANSCRIPT.chunks.filter(
    (chunk) =>
      chunk.timestamp >= fromTimestamp && chunk.timestamp <= toTimestamp,
  );

  const isAuthDocSegment =
    fromTimestamp >= 70 && toTimestamp <= 180 && chunksInRange.length > 0;

  if (isAuthDocSegment) {
    const mentionsUser = normalizedName
      ? DEMO_TRANSCRIPT.chunks.some((chunk) =>
          chunk.text.toLowerCase().includes(normalizedName),
        )
      : false;

    return {
      fromTimestamp,
      toTimestamp,
      currentTopic: "Auth documentation",
      whatChanged: [
        "The team decided to keep the old dashboard for v1.",
        "The current topic is auth documentation.",
        "Marcus may need to write the auth doc by Wednesday.",
      ],
      decisions: ["Keep the old dashboard for v1."],
      possibleTasksForUser: mentionsUser
        ? ["Possible task: review the auth doc with Marcus tomorrow."]
        : ["You were not clearly asked to do anything."],
      openQuestions: [
        "Are we keeping the old dashboard just for launch, or for the whole v1 cycle?",
      ],
      userMentions: mentionsUser
        ? [`Possible mention of ${userName} in the meeting.`]
        : [],
      suggestedQuestion:
        "Are we keeping the old dashboard just for launch, or for the whole v1 cycle?",
    };
  }

  const decisions = chunksInRange
    .filter((chunk) => chunk.isDecision)
    .map((chunk) => chunk.text);

  const actionItems = DEMO_TRANSCRIPT.actionItems
    .filter(
      (item) =>
        item.timestamp >= fromTimestamp && item.timestamp <= toTimestamp,
    )
    .map((item) =>
      item.assignee
        ? `Possible task for ${item.assignee}: ${item.task}`
        : `Possible task: ${item.task}`,
    );

  const thread = deriveCurrentThread(toTimestamp);

  return {
    fromTimestamp,
    toTimestamp,
    currentTopic: thread.currentTopic,
    whatChanged: chunksInRange.slice(-3).map((chunk) => chunk.text),
    decisions,
    possibleTasksForUser: actionItems.length
      ? actionItems
      : ["Nothing clearly assigned to you in this window."],
    openQuestions: thread.openQuestion ? [thread.openQuestion] : [],
    userMentions: [],
    suggestedQuestion: thread.openQuestion,
  };
}

export function getDemoUserActionItems(
  fromTimestamp: number,
  toTimestamp: number,
  userName?: string,
): UserActionItem[] {
  const normalizedName = userName?.trim().toLowerCase();
  const items: UserActionItem[] = [];

  for (const chunk of DEMO_TRANSCRIPT.chunks) {
    if (chunk.timestamp < fromTimestamp || chunk.timestamp > toTimestamp) {
      continue;
    }

    if (
      normalizedName &&
      chunk.text.toLowerCase().includes(normalizedName)
    ) {
      items.push({
        id: `mention-${chunk.id}`,
        kind: "mention",
        label: "Possible mention",
        sourceSnippet: chunk.text,
        timestamp: chunk.timestamp,
        confidence: "medium",
      });
    }

    if (chunk.isActionItem) {
      items.push({
        id: `task-${chunk.id}`,
        kind: "task",
        label: "Possible task",
        sourceSnippet: chunk.text,
        timestamp: chunk.timestamp,
        confidence: "medium",
      });
    }
  }

  for (const item of DEMO_TRANSCRIPT.actionItems) {
    if (item.timestamp < fromTimestamp || item.timestamp > toTimestamp) {
      continue;
    }

    const assignedToUser =
      normalizedName &&
      item.assignee?.trim().toLowerCase() === normalizedName;

    items.push({
      id: item.id,
      kind: assignedToUser ? "task" : "task",
      label: assignedToUser ? "Possible task for you" : "Possible task",
      sourceSnippet: item.assignee
        ? `${item.assignee}: ${item.task}`
        : item.task,
      timestamp: item.timestamp,
      confidence: assignedToUser ? "high" : "medium",
    });
  }

  return items;
}

export async function runDemoPlayback(
  onTick: (timeSec: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  const tickMs = 500;
  let elapsed = 0;

  while (elapsed <= DEMO_TRANSCRIPT.durationSec) {
    if (signal?.aborted) return;

    onTick(elapsed);
    await new Promise((resolve) => setTimeout(resolve, tickMs));
    elapsed += tickMs / 1000;
  }
}

export function catchUpCardToUserActionItems(
  card: CatchUpCard,
): UserActionItem[] {
  const items: UserActionItem[] = [];

  for (const [index, mention] of card.userMentions.entries()) {
    items.push({
      id: `catchup-mention-${index}`,
      kind: "mention",
      label: "Possible mention",
      sourceSnippet: mention,
      timestamp: card.toTimestamp,
      confidence: "medium",
    });
  }

  for (const [index, task] of card.possibleTasksForUser.entries()) {
    items.push({
      id: `catchup-task-${index}`,
      kind: "task",
      label: "Possible task",
      sourceSnippet: task,
      timestamp: card.toTimestamp,
      confidence: "medium",
    });
  }

  for (const [index, question] of card.openQuestions.entries()) {
    items.push({
      id: `catchup-question-${index}`,
      kind: "question",
      label: "Open question",
      sourceSnippet: question,
      timestamp: card.toTimestamp,
      confidence: "low",
    });
  }

  return items;
}
