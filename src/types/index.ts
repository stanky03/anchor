export type MeetingSessionState = "idle" | "active" | "stopped";

export type TranscriptChunk = {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
};

export type MeetingSignal = {
  type: "topic" | "decision" | "task" | "question" | "mention";
  text: string;
  timestamp: number;
  confidence: "low" | "medium" | "high";
  sourceChunkIds: string[];
};

export type CatchUpCard = {
  fromTimestamp: number;
  toTimestamp: number;
  currentTopic?: string;
  whatChanged: string[];
  decisions: string[];
  possibleTasksForUser: string[];
  openQuestions: string[];
  userMentions: string[];
  suggestedQuestion?: string;
};

export type CurrentThread = {
  currentTopic?: string;
  lastDecision?: string;
  openQuestion?: string;
};

export type UserActionItem = {
  id: string;
  kind: "task" | "mention" | "question";
  label: string;
  sourceSnippet: string;
  timestamp: number;
  confidence: "low" | "medium" | "high";
};

export type AskMeetingPrompt =
  | "whatDidIMiss"
  | "whatAreWeDeciding"
  | "doINeedToDoAnything"
  | "explainSimply"
  | "whatQuestionShouldIAsk";

export type PanelStatus<T> =
  | { status: "empty"; message: string }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

export type CatchUpRequest = {
  fromTimestamp: number;
  toTimestamp: number;
  userName?: string;
  transcript?: string;
};

export type AskMeetingRequest = {
  prompt: AskMeetingPrompt;
  userName?: string;
  transcript?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
};

export type AskMeetingResponse = {
  answer: string;
  sources?: string[];
};
