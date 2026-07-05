# Demo Meeting Script

Use this script to record a mock meeting or to generate a canned transcript for demo mode.

## Metadata

- **Title:** Sprint Planning — Noisy Remote Call
- **Duration:** 3–4 minutes
- **Speakers:** 3 (PM, Developer, Designer)
- **Audio characteristics:** Background keyboard, one person slightly quiet, occasional overlap

---

## Script

### Beat 1 — Opening & first action item

**Speaker 1 (PM, Alex):**  
"Okay, let's recap. We need the login fix shipped by Friday. Sarah owns the API piece."

**Speaker 2 (Dev, Sarah):**  
"Uh, I can do the API, but we should probably sync with Marcus on the auth flow before I start."

---

### Beat 2 — Overlap / noisy moment

**Speaker 3 (Design, Jordan):** *(talks over Sarah)*  
"Sorry, quick question — are we keeping the old dashboard or switching to the new one?"

**Speaker 1 (Alex):**  
"Good question. Let's keep the old dashboard for v1. Redesign is Q2."

---

### Beat 3 — Jargon (reading-level demo)

**Speaker 2 (Sarah):**  
"Got it. So we'll need to refactor the OAuth callback handler for the IdP integration. Marcus should document the flow."

**Speaker 1 (Alex):**  
"Agreed. Marcus, can you have the auth doc ready by Wednesday?"

**Speaker 2 (Sarah):** *(quiet, slightly hard to hear)*  
"I'll block time tomorrow to review it with him."

---

### Beat 4 — Decisions & wrap-up

**Speaker 3 (Jordan):**  
"Works for me. I'll update the Figma with the v1 dashboard labels only."

**Speaker 1 (Alex):**  
"Perfect. So to summarize: login fix by Friday, Sarah on API, Marcus on auth doc by Wednesday, dashboard stays as-is for v1. I'll send a stakeholder email after this call."

**Speaker 2 (Sarah):**  
"Sounds good. Thanks everyone."

---

## Expected extractions

### Action items

| Assignee | Task | Timestamp (approx) |
|----------|------|--------------------|
| Sarah | API fix for login | 0:15 |
| Marcus | Auth flow documentation | 1:45 |
| Alex | Stakeholder email after call | 3:30 |
| Jordan | Update Figma with v1 dashboard labels | 3:00 |

### Decisions

- Keep old dashboard for v1; redesign deferred to Q2
- Login fix must ship by Friday

### Summary (plain language, grade 6)

The team is fixing a login bug by Friday. Sarah will work on the API. Marcus will write a document about how sign-in works by Wednesday. The old dashboard stays for now; the new design comes later. Alex will email stakeholders after the meeting.

---

## "What did I miss?" demo moment

**Simulated gap:** User "zones out" from ~1:20 to ~2:50 (during jargon + auth doc discussion).

**Expected recap:**

> While you were away: The team decided to keep the old dashboard for version 1. Sarah will refactor the sign-in code and needs Marcus to document the auth flow by Wednesday. Jordan will update design files to match the v1 dashboard.

**Expected tasks from missed segment:**

- Marcus → auth doc by Wednesday
- Sarah → review auth doc with Marcus tomorrow

---

## Recording tips

- Record in a quiet room, then add light keyboard/room noise in post if needed
- Have one speaker slightly farther from the mic (Sarah's quiet line)
- Allow ~1 second of overlap when Jordan interrupts
- Export as `demo-meeting.mp4` and pair with `demo-transcript.json` keyed by timestamps
