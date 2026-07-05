# PDD: Meeting Catch-Up Companion

## Summary

Build a web app that helps people recover when they lose the thread in a live meeting. The product listens to meeting audio, keeps a rolling transcript, and turns recent conversation into calm, useful answers: what changed, what matters, whether the user was mentioned, and what they may need to do.

This replaces the previous broader "customizable live captions" direction. The new focus is meeting recovery and cognitive accessibility, not speaker labels, video, or generic meeting notes.

## Core Purpose

Help users answer three questions during a meeting:

1. Where are we in the conversation?
2. What did I miss?
3. Do I need to do or say anything?

The app is designed for ADHD users, neurodivergent users, Deaf/hard-of-hearing users, non-native speakers, and anyone who struggles to process fast live conversation.

## MVP Features

### I'm Lost / Catch Me Up

- User marks the moment they stopped following.
- App summarizes from that point to now.
- If no marker exists, summarize the last 2 minutes.
- Output should be short, specific, and practical, not a generic meeting summary.

### Do I Need To Do Anything?

- Detect mentions of the user's name.
- Find possible tasks, deadlines, and direct questions.
- Use cautious language like "Possible task" instead of overclaiming.
- Include source snippets where useful so the user can verify the result.

### Current Thread

- Show a persistent compact panel with:
  - Current topic
  - Last decision
  - Open question
- This helps users rejoin the conversation without rereading the full transcript.

### Ask the Meeting

- Provide constrained prompt buttons instead of a generic chatbot:
  - What did I miss?
  - What are we deciding?
  - Do I need to do anything?
  - Explain this simply.
  - What question should I ask?

### Plain-English Explain

- Let the user ask for a confusing term, acronym, phrase, or decision to be explained simply.
- Keep explanations brief and meeting-specific.

## Explicitly Out Of Scope For MVP

- Speaker names or diarization
- Video analysis
- Chrome extension
- Zoom or Google Meet integration
- Calendar or Slack integration
- Full meeting history database
- Generic post-meeting summaries as the main product
- Large accessibility settings panel with many visual controls
- Heavy caption customization as the primary product hook

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Audio capture:** browser microphone with `getUserMedia`
- **Live transcription:** OpenAI Realtime transcription
- **AI analysis:** OpenAI Responses API
- **Backend:** Next.js API routes for secure OpenAI calls and short-lived Realtime credentials
- **State:** React state or Zustand
- **Persistence:** in-memory for meeting transcript; `localStorage` for user name and lightweight preferences
- **Deployment:** Vercel

## Collaborator Setup

Use this file as the product source of truth. Older planning docs have been removed so contributors do not build against the previous caption-customization concept.

Required local setup:

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `OPENAI_API_KEY` in `.env.local`.
4. Start the app with `npm run dev`.

Do not add another product plan unless it updates or replaces this PDD. Implementation notes can live in code comments, issues, or PR descriptions.

## MVP Architecture

```txt
Browser microphone
  -> OpenAI Realtime transcription
  -> rolling transcript buffer
  -> meeting signal extraction
  -> UI cards:
      Current thread
      Catch me up
      Do I need to do anything?
      Ask the meeting
```

## Data Model

```ts
type TranscriptChunk = {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
};

type MeetingSignal = {
  type: "topic" | "decision" | "task" | "question" | "mention";
  text: string;
  timestamp: number;
  confidence: "low" | "medium" | "high";
  sourceChunkIds: string[];
};

type CatchUpCard = {
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
```

## Demo Flow

1. User enters their name.
2. User starts microphone transcription.
3. Meeting audio begins.
4. User clicks **I'm Lost**.
5. Conversation continues with a decision, possible task, and confusing term.
6. User clicks **Catch Me Up**.
7. App shows:
   - What changed
   - Current topic
   - Last decision
   - Whether the user was mentioned
   - Whether they may need to do anything
8. User taps **Explain this simply** for a confusing term.

## Example Catch-Up Output

```txt
Since you lost the thread:

- The team decided to keep the old dashboard for v1.
- The current topic is auth documentation.
- Marcus may need to write the auth doc by Wednesday.
- You were not clearly asked to do anything.

Question you could ask:
"Are we keeping the old dashboard just for launch, or for the whole v1 cycle?"
```

## Success Criteria

- User can recover from a missed segment in under 10 seconds.
- Catch-up output is short, specific, and not a generic meeting summary.
- App does not rely on speaker labels to be useful.
- User can tell whether they were mentioned or assigned something.
- UI feels calm, human, and assistive rather than surveillance-heavy.
- The MVP works from microphone audio without video or meeting-platform integration.

## Assumptions

- MVP is a web app.
- Live audio comes from the user's microphone.
- Speaker identity is not required.
- The first version is for a single active meeting session.
- Accuracy is handled with cautious wording and visible source snippets where useful.
- Existing repo code may reflect an older product direction; this PDD is the source of truth for the next implementation pass.
