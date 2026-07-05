import {
  DECISION_PATTERN,
  TASK_PATTERN,
  stripOffsets,
} from "@/lib/catchup";
import type { AskPromptKey, AskResponse } from "@/types";

export const ASK_WINDOW_SEC = 180;

export const ASK_PROMPT_KEYS: AskPromptKey[] = [
  "deciding",
  "tasks_for_me",
  "explain",
  "suggest_question",
];

// Strict structured-output schema; snippet modeled as a null union.
export const ASK_ANSWER_SCHEMA = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description:
        "The answer in 1-3 short plain-language sentences (about grade 8 reading level).",
    },
    snippet: {
      type: ["string", "null"],
      description:
        "One short verbatim transcript quote that supports the answer, or null.",
    },
  },
  required: ["answer", "snippet"],
  additionalProperties: false,
} as const;

export function normalizeAskResponse(raw: unknown): AskResponse {
  const data = (raw ?? {}) as Record<string, unknown>;
  const answer =
    typeof data.answer === "string" && data.answer.trim()
      ? data.answer.trim()
      : "I couldn't find an answer to that in the last few minutes.";
  const snippet =
    typeof data.snippet === "string" && data.snippet.trim()
      ? data.snippet.trim()
      : undefined;

  return { answer, snippet };
}

const ACRONYM_PATTERN = /\b[A-Z]{2,}\b/;

function transcriptLines(transcript: string): string[] {
  return transcript.split("\n").map(stripOffsets).filter(Boolean);
}

// Deterministic fallback used when no OpenAI key is configured.
export function buildSampleAskAnswer(
  promptKey: AskPromptKey,
  transcript: string,
  term?: string,
  userName?: string,
): AskResponse {
  const lines = transcriptLines(transcript);

  switch (promptKey) {
    case "deciding": {
      const decision = lines.filter((line) => DECISION_PATTERN.test(line)).at(-1);
      return decision
        ? {
            answer: `It sounds like the group is deciding this: "${decision}"`,
            snippet: decision,
          }
        : {
            answer:
              "I couldn't find an explicit decision in the last few minutes.",
          };
    }
    case "tasks_for_me": {
      const name = userName?.trim().toLowerCase();
      const tasks = lines.filter((line) => TASK_PATTERN.test(line));
      const mine = name
        ? tasks.filter((line) => line.toLowerCase().includes(name))
        : [];
      const task = mine.at(-1) ?? null;
      if (task) {
        return {
          answer: `Possible task for you: "${task}"`,
          snippet: task,
        };
      }
      return {
        answer: tasks.length
          ? "Nothing sounded like a task for you specifically, but tasks were mentioned — check the action items."
          : "Nothing sounded like a task for you in the last few minutes, but I can't be certain.",
      };
    }
    case "explain": {
      const cleanTerm = term?.trim();
      if (cleanTerm) {
        const source = lines
          .filter((line) =>
            line.toLowerCase().includes(cleanTerm.toLowerCase()),
          )
          .at(-1);
        return source
          ? {
              answer: `"${cleanTerm}" comes up here: "${source}". A plain reading: it's part of what the group is working through right now.`,
              snippet: source,
            }
          : {
              answer: `I didn't hear "${cleanTerm}" in the last few minutes, so I can't explain it from this meeting.`,
            };
      }
      const confusing =
        lines.filter((line) => ACRONYM_PATTERN.test(line)).at(-1) ??
        lines.filter((line) => line.split(" ").length > 15).at(-1);
      return confusing
        ? {
            answer: `The trickiest recent bit was: "${confusing}". In plain terms, the group is talking through the details of the current topic.`,
            snippet: confusing,
          }
        : { answer: "Nothing in the last few minutes looked confusing to me." };
    }
    case "suggest_question": {
      const question = lines.filter((line) => line.endsWith("?")).at(-1);
      return question
        ? {
            answer: `You could ask: "Going back a moment — ${question.charAt(0).toLowerCase()}${question.slice(1)}"`,
            snippet: question,
          }
        : {
            answer:
              'You could ask: "Could someone recap where we landed just now?"',
          };
    }
  }
}
