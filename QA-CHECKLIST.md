# Manual QA checklist

Run before a hackathon demo or handoff. Product scope lives in [PDD.md](./PDD.md).

## Setup

- [ ] Clean checkout: `npm install` succeeds
- [ ] `.env.local` copied from `.env.example` (with or without `OPENAI_API_KEY`)
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run dev` — app loads at localhost without console errors

## Keyboard & focus

- [ ] Tab from page load: **Skip to meeting view** link appears and jumps to main content
- [ ] Tab reaches **Start listening**, settings, and bottom-bar controls with visible focus ring
- [ ] During session: **L** sets lost marker (not when focus is in an input)
- [ ] During session: **C** opens catch-up modal
- [ ] Catch-up modal traps focus; Escape closes it
- [ ] Ask-the-meeting buttons are reachable and activatable by keyboard

## Responsive layout

- [ ] Desktop (~1280px): two columns — captions left, orientation panels right
- [ ] Narrow (~375px): panels stack; bottom bar wraps without clipping
- [ ] Bottom **I'm lost** / **Catch me up** bar stays visible above fold content

## Demo meeting (no mic)

- [ ] More → **Play demo meeting** starts playback and **Demo** badge shows
- [ ] Captions appear with timestamps (no speaker names in caption list)
- [ ] **Summary** fills in during demo
- [ ] **Current thread** updates (topic, decision, open question)
- [ ] Stop or let demo end — replay / start listening options appear

## Mic permission (live session)

- [ ] **Start listening** prompts for microphone permission
- [ ] Grant permission → **Listening** indicator appears
- [ ] Deny permission → clear error or warning (no silent failure)
- [ ] **Stop** ends session and clears active state

## Lost marker

- [ ] **I'm lost** disabled when idle
- [ ] Click sets **Lost at …** pill and screen-reader announcement
- [ ] Pill **Clear** removes marker
- [ ] Second click on **I'm lost** updates marker time

## Catch-up card

- [ ] **Catch me up** disabled when idle
- [ ] With lost marker: recap covers marker → now (modal shows window)
- [ ] Without marker: recap uses last ~2 minutes
- [ ] Card sections render: what changed, decisions, tasks, mentions, suggested question
- [ ] Works without API key (sample output badge) and with API key (live generation)
- [ ] **Try again** on error retries the request

## User mentions & tasks

- [ ] Without name in settings: panel explains how to add one
- [ ] Name set to `Marcus` during demo: **Possible task** for auth doc appears
- [ ] Source snippet shown under each signal
- [ ] Confidence shown as human phrasing (not raw "high"/"low")

## Current thread

- [ ] Empty state before captions
- [ ] Populates during demo with topic / decision / question
- [ ] Stale helper text after long pause (if applicable)

## Ask the meeting

- [ ] Buttons disabled when idle
- [ ] **What did I miss?** opens catch-up modal
- [ ] **What are we deciding?** returns an answer
- [ ] **Do I need to do anything?** returns an answer
- [ ] **Explain this simply** expands input; Enter submits
- [ ] **What question should I ask?** returns a suggestion

## Copy & tone

- [ ] No surveillance-style language ("monitoring", "tracking users", etc.)
- [ ] Task/mention labels use cautious phrasing ("Possible task", "Possible mention")
- [ ] Name usage explained as local, mention-spotting only
