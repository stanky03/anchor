# Accessible Meeting Copilot — Product Plan

## 1. Problem & Positioning

Virtual meetings are a barrier for many people:

| User group | Pain |
|------------|------|
| Deaf / hard-of-hearing | No reliable captions, poor speaker attribution |
| ADHD / neurodivergent | Cognitive overload from fast speech, tangents, multitasking |
| Non-native speakers | Jargon, idioms, fast pace, unclear action items |

**Core insight:** Transcription alone is not enough. People need **captions they can read**, **structure they can trust**, and **recovery when they zone out**.

**Differentiator vs past winners (Katakan AI, Lingo):** Same transcription foundation, but with **user-controlled caption presentation** and a **"what did I miss?" recovery loop** tuned for cognitive accessibility — not just hearing access.

---

## 2. Product Shape

**Start with a web app.** Add a thin Chrome extension later if time allows.

| Approach | Pros | Cons |
|----------|------|------|
| **Web app (recommended MVP)** | Fast to build, full UI control, easy demo | User must share tab audio or upload a file |
| **Chrome extension** | Captures any tab (Meet, Zoom web) | More setup, store review, harder in 48h |

### MVP capture strategy

1. **Demo mode:** Pre-recorded noisy mock meeting (guaranteed demo)
2. **Live mode:** Browser tab audio via `getDisplayMedia` + `MediaStream` (works in Chrome)
3. **Fallback:** Upload `.mp4` / `.wav` for offline replay

---

## 3. MVP Feature Set

### Must-have (demo-critical)

1. **Live captions** with word-by-word or phrase-by-phrase display
2. **Speaker labels** (Speaker A/B/C or names if diarization works)
3. **Action item highlighting** (auto-detected + pinned sidebar)
4. **Rolling simplified summary** (plain language, updated every ~30s)
5. **"What did I miss?"** — user picks a time range or clicks "last 2 min"; app returns a short recap + tasks
6. **Accessibility customization panel** (the twist)

### Nice-to-have (if time)

- Bookmark / "I lost focus" button (one-click recap)
- Export: summary + action items as markdown
- Keyword glossary for non-native speakers ("ASAP" → "as soon as possible")

### Out of scope for MVP

- Calendar integration, Slack bot, mobile app, full Zoom SDK native capture

---

## 4. The Twist — Caption & Cognitive Customization

A dedicated **Accessibility Panel** (always visible, not buried in settings):

| Control | What it does |
|---------|--------------|
| **Reading level** | Slider: Grade 6 → Grade 12 → Original. Rewrites live captions via LLM (simpler vocab, shorter sentences) |
| **Font size** | 16px → 32px, persists in `localStorage` |
| **Caption speed** | Delay buffer: show 0 / 3 / 5 / 10 sec behind live (lets users read at their pace) |
| **Color contrast** | Presets: High contrast (black/yellow), Dark calm, Light minimal, **Dyslexia-friendly** (OpenDyslexic, increased letter-spacing) |
| **Reduce cognitive load mode** | One toggle that applies a bundle: slower caption roll, max 2 lines visible, hide filler words, larger font, muted UI chrome, summary pinned top |

### Reduce cognitive load mode behavior

- Show only **current sentence + previous sentence** (not full scrollback)
- Strip "um, uh, like, you know" from display (keep in raw transcript)
- Auto-highlight **decisions** and **action items** in distinct colors
- Optional: dim non-essential UI during active captioning

---

## 5. User Flows

### Flow A — Demo (judge-safe)

```
Landing → "Play demo meeting" → Live captions + speakers
       → Toggle reading level / contrast / cognitive load
       → Click "What did I miss?" (simulated 90s gap)
       → See recap + 3 action items
```

### Flow B — Live meeting

```
Start → Share tab with audio (Google Meet / YouTube / etc.)
     → Captions stream in real time
     → User adjusts accessibility settings mid-meeting
     → "I zoned out" button → instant recap
     → End → Summary + export
```

---

## 6. Implementation Phases

### Phase 0 — Setup (Day 1)

- Next.js scaffold, accessibility settings store, design tokens for contrast presets
- Record or source mock meeting audio

### Phase 1 — Core pipeline (Days 2–4)

- Audio capture (file upload + tab share)
- Streaming STT → caption UI with speaker labels
- Transcript buffer with timestamps

### Phase 2 — Intelligence layer (Days 5–7)

- Rolling summary (every 30s or on pause)
- Action item detection (regex + LLM pass)
- "What did I miss?" for a time range

### Phase 3 — Accessibility twist (Days 8–9)

- Reading level rewriter (debounced LLM calls on sentence boundaries)
- Caption delay buffer
- Reduce cognitive load mode (UI + display rules)
- Contrast / font presets

### Phase 4 — Demo polish (Days 10–11)

- Landing page with clear value prop
- One-click demo mode (no mic permission needed)
- Fallback if live STT fails
- Short pitch deck / README

See [TECH-SPEC.md](TECH-SPEC.md) for architecture and stack details.

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| STT fails on noisy audio | Pre-baked demo transcript; show "demo mode" badge |
| LLM latency breaks "live" feel | Simplify reading level in batch every 2–3 sentences, not per word |
| Tab audio capture blocked | File upload fallback; clear browser instructions |
| Reading-level rewrite wrong | Show toggle: Original / Simplified side-by-side |
| Hackathon judges can't hear demo | Visual-first: captions + summary + action items speak for themselves |

---

## 8. Success Metrics (for pitch)

- **Time to first caption:** < 3 seconds after audio starts
- **Reading level:** Grade 12 → Grade 6 without losing meaning (show before/after)
- **Recovery:** "What did I miss?" returns useful recap in < 5 seconds
- **Accessibility:** WCAG AA contrast on all presets; keyboard-navigable panel

---

## 9. Recommended Next Steps

1. **Confirm format:** Web app only vs web app + extension for v0.1
2. **Pick STT provider:** Deepgram (streaming + diarization) is the fastest path
3. **Build demo-first:** Mock meeting + canned transcript before live capture
4. **Name the product:** e.g. *ClearMeet*, *CaptionFlow*, *FocusCaptions*
