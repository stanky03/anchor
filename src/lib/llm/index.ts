import type { AskMeetingPrompt } from "@/types";

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const ASK_PROMPT_LABELS: Record<AskMeetingPrompt, string> = {
  whatDidIMiss: "What did I miss?",
  whatAreWeDeciding: "What are we deciding?",
  doINeedToDoAnything: "Do I need to do anything?",
  explainSimply: "Explain this simply.",
  whatQuestionShouldIAsk: "What question should I ask?",
};

export function getAskPromptLabel(prompt: AskMeetingPrompt): string {
  return ASK_PROMPT_LABELS[prompt];
}

export function buildCatchUpPrompt(
  transcript: string,
  userName?: string,
): string {
  const userContext = userName
    ? `The user's name is ${userName}. Flag possible mentions or tasks for them with cautious language.`
    : "The user's name is unknown. Do not invent assignments.";

  return `You are helping someone rejoin a live meeting they lost track of.
${userContext}
Return a short, practical catch-up based only on this transcript segment.
Focus on what changed, current topic, decisions, possible tasks, mentions, and one helpful question they could ask.

Transcript:
${transcript}`;
}

export function buildAskMeetingPrompt(
  prompt: AskMeetingPrompt,
  transcript: string,
  userName?: string,
): string {
  const userContext = userName ? `The user's name is ${userName}.` : "";
  const question = getAskPromptLabel(prompt);

  return `You are a calm meeting assistant. ${userContext}
Answer this constrained prompt briefly and specifically for the meeting below:
"${question}"

Use cautious language for tasks or mentions. Keep the answer under 120 words.

Transcript:
${transcript}`;
}

export function buildUserActionPrompt(
  transcript: string,
  userName?: string,
): string {
  const userContext = userName
    ? `Look for possible tasks, deadlines, direct questions, or mentions involving ${userName}.`
    : "Look for possible tasks, deadlines, or direct questions.";

  return `Review this meeting transcript and identify anything the user may need to respond to.
${userContext}
Use cautious wording like "Possible task" or "Possible mention".

Transcript:
${transcript}`;
}

export function getDemoAskAnswer(
  prompt: AskMeetingPrompt,
  userName?: string,
): { answer: string; sources: string[] } {
  switch (prompt) {
    case "whatDidIMiss":
      return {
        answer:
          "Since you lost the thread: the team decided to keep the old dashboard for v1, the current topic is auth documentation, and Marcus may need to write the auth doc by Wednesday.",
        sources: [
          "Let's keep the old dashboard for v1. Redesign is Q2.",
          "Marcus, can you have the auth doc ready by Wednesday?",
        ],
      };
    case "whatAreWeDeciding":
      return {
        answer:
          "The main decision on the table is whether v1 keeps the old dashboard. The team already decided yes for v1, with redesign deferred to Q2.",
        sources: ["Let's keep the old dashboard for v1. Redesign is Q2."],
      };
    case "doINeedToDoAnything":
      return {
        answer: userName
          ? `Nothing clearly asks ${userName} to do anything in the recent thread. Marcus may need the auth doc by Wednesday.`
          : "Nothing clearly asks you to do anything in the recent thread. Marcus may need the auth doc by Wednesday.",
        sources: [
          "Marcus, can you have the auth doc ready by Wednesday?",
        ],
      };
    case "explainSimply":
      return {
        answer:
          "OAuth callback handler: the code that finishes sign-in after a user authenticates with an outside identity provider.",
        sources: [
          "refactor the OAuth callback handler for the IdP integration",
        ],
      };
    case "whatQuestionShouldIAsk":
      return {
        answer:
          "Are we keeping the old dashboard just for launch, or for the whole v1 cycle?",
        sources: ["Let's keep the old dashboard for v1. Redesign is Q2."],
      };
  }
}
