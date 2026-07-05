# Demo script

Short walkthrough aligned to [PDD.md](./PDD.md) Demo Flow. Uses the built-in **Play demo meeting** transcript (~3.5 minutes). No microphone needed.

## Before you start (~1 min)

1. `npm install && cp .env.example .env.local` (add `OPENAI_API_KEY` if you have one)
2. `npm run dev` → open the app
3. **Accessibility settings** (person icon) → set **Your name** to `Marcus`
4. **More** (⋯) → **Play demo meeting**

Point out the layout: captions on the left, **Current thread** and **Do I need to do anything?** on the right, recovery controls at the bottom.

## Act 1 — Lose the thread (~30 sec)

**~0:32** — Jordan asks about the old vs new dashboard. Say:

> "Imagine I zoned out here — I don't know what we're deciding."

Press **I'm lost** (or **L**). Show the **Lost at …** pill.

Let the demo keep playing. Mention that captions and the **Current thread** panel keep updating.

## Act 2 — Catch up (~45 sec)

**~1:30** — After the dashboard decision and Marcus auth-doc ask. Press **Catch me up** (or **C**).

Walk through the recap card:

- **What changed** since the lost marker
- **Current topic** (auth documentation)
- **Last decision** (keep old dashboard for v1)
- **Possible tasks** mentioning Marcus / Wednesday
- **Suggested question** to rejoin the conversation

Optional: click **Clear marker** on the pill, or leave it for the next recap.

## Act 3 — Do I need to do anything? (~20 sec)

Scroll to **Do I need to do anything?** on the right.

- Show **Possible task** for Marcus (auth doc by Wednesday) with source snippet
- Note cautious wording ("possible", "fairly clear match" vs "uncertain match")

## Act 4 — Ask the meeting (~30 sec)

In **Ask the meeting**:

1. **What are we deciding?** — short answer from recent transcript
2. **Explain this simply** → type `OAuth` or `IdP` → **Explain**

If no API key, mention the **Sample output** badge — real answers need `OPENAI_API_KEY`.

## Close (~15 sec)

Recap the three PDD questions this answers:

1. Where are we? → **Current thread**
2. What did I miss? → **Catch me up**
3. Do I need to act? → **Do I need to do anything?** + ask buttons

Offer **Start listening** for a live mic session if time allows.

## Timing cheat sheet (demo transcript)

| Time | What happens |
|------|----------------|
| 0:05 | Login fix by Friday; Sarah on API |
| 0:32 | Dashboard old vs new question |
| 0:42 | **Decision:** keep old dashboard for v1 |
| 1:20 | OAuth / IdP / auth flow discussion |
| 1:35 | **Marcus:** auth doc by Wednesday |
| 2:50 | Wrap-up recap |

**Suggested lost marker:** ~0:32–0:45 (before or right after the dashboard decision).  
**Suggested catch-up:** ~1:35+ (after Marcus is assigned the doc).
