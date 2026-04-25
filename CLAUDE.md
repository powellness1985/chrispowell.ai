# chrispowell.ai — Claude Code Project Guide

## Overview
Personal portfolio site for Chris Powell built with React, Vite, Tailwind, and Claude API. Single-page app showcasing work, creative projects, and an AI-powered chat interface.

## Key Files & Architecture
- **src/components/** — React components (ParticleHero, About, Projects, AlsoMe, Chat, Navigation, Footer)
- **src/data/** — Data files (projects.js, alsoMe.js)
- **api/** — Vercel serverless function for chat backend
- **public/** — Static assets (headshot.webp, favicon) — headshot converted from .jpg to .webp Apr 2026 (61% smaller)

## Development
```bash
npm run dev    # Vite dev server on port 5173
npm run build  # Production build — always run before pushing to catch build errors
```

## Style Guide
- **Color palette:** Dark bg (#0a0a0f), cyan accents (#00D4FF), white text (#e8e8f0)
- **Spacing/layout:** Tailwind, max-width 6xl containers, consistent padding
- **Components:** Use existing pill, card, btn-ghost, section, h-section, sub classes from index.css
- **Typography:** Inter (body), JetBrains Mono (code/terminal), Fraunces (serif headings)

## Changelog
- **ad32243** (Apr 2026) — Full site update: 22 years (was 20), Tokyo/proposal terminal line, FAA NSI POC line, mentorship line, 3 new AI portfolio projects (Adoption Insights, Ticket Analytics, Compliance Tool), Girl Dad card in AlsoMe, Photography+Drone update, CNC card from planning to active, headshot.jpg → headshot.webp
- **a40b024** (Apr 2026) — Matrix rain: denser columns, longer trails, fuller wall of text
- **016570e** (Apr 2026) — Terminal: floating widget desktop/iPad, inline mobile
- **4cda093** (Apr 2026) — Glitch: scan line tear (seizure-safe), replaced flash/white-fill events

## Code Conventions
- No comments unless WHY is non-obvious
- Prefer existing abstractions (don't create premature helpers)
- Edit existing files > create new ones
- Always run `npm run build` before committing — esbuild will catch JS string/syntax errors
- Multi-line strings in JSX data files: use `\n` escape sequences, NOT literal newlines in single-quoted strings

## Content Areas (Update in .js files)
- **Timeline:** src/components/About.jsx (TIMELINE array)
- **Projects:** src/data/projects.js
- **Also Me:** src/data/alsoMe.js
- **Chat suggestions:** src/components/ChatInterface.jsx (AUDIENCES object)
- **Terminal commands:** src/components/TerminalAnimation.jsx (COMMANDS array)

## API
- Chat backend: api/chat.js (Claude Haiku via Anthropic SDK)
- System prompt loaded from SYSTEM_PROMPT env variable (base64 or plain text)
- Environment: .env (ANTHROPIC_API_KEY, SYSTEM_PROMPT — never commit these)

## Git Workflow
- Commit frequently with clear messages
- Always `git pull` before starting work on a different machine
- Push after each logical unit of work

## Change Log
### 2026-04-25 — Scan line tear glitch (Perplexity Computer session)
**Intro Animation — glitch transition rewrite (ParticleHero.jsx)**
- Replaced flash-based glitch with a seizure-safe **scan line tear** transition:
  - Rain freezes → 18 horizontal bands begin shearing left/right (VHS mistrack feel)
  - Chromatic aberration (red/blue pixel offset) drifts in and grows across the 1200ms window
  - Bands progressively drop out to background color — no brightness events
  - Canvas fades to black via CSS `opacity` transition (300ms) — zero strobing
  - Site content already loaded underneath; particle burst fires as final punctuation
- `GLITCH_DURATION` extended from 900ms → 1200ms to give the tear more room to develop
- All `flash` and white-fill events removed — no `rgba(255,255,255,...)` draws anywhere

### 2026-04-25 (Perplexity Computer session)
**Intro Animation — complete rewrite (ParticleHero.jsx)**
- Replaced the previous slow particle-assembly intro (was disabled/skipped by default) with a new two-phase cinematic intro:
  1. **ASCII scramble overlay** — full-screen grid of random characters (0/1/katakana/#/$) cascade across the screen for ~1.6s, resolving cell-by-cell into the page background. Cyan → white → transparent color shift as each cell resolves.
  2. **Particle flash** — as the scramble clears, "Chris Powell" briefly assembles as cyan particles then instantly scatters outward (~600ms). The particles were always the wow moment — now it's fast and doesn't require waiting.
- Content reveals at ~40% through the scramble (under 1 second), so the page is never blocked.
- Skip button appears immediately on load (fixed position, z-index 60), always accessible.
- Full build tested before push — no unterminated string errors.

**Mobile layout fixes**
- `.section` padding: added `px-4 sm:px-6` tiers — was too tight on small screens
- `.h-section` font: added `text-2xl sm:text-3xl` — section headers were oversized on mobile
- `.sub` font: added `text-sm sm:text-base` tier
- `.card` padding: `p-4 sm:p-6` — less cramped on mobile
- Hero `h1`: added `text-3xl sm:text-4xl` tier and `<br className="md:hidden" />` in headline to control wrapping
- Hero subhead: `text-sm sm:text-base` tier
- Career trail: hides "→ Reaction" on very small screens to prevent overflow
- TechStack: reduced top margin on mobile (`mt-5 md:mt-8`)
- Terminal (mobile): moved from top overlay (was colliding with hero content) to `fixed bottom-20` with reduced opacity/size. Now shows only first line of multi-line output to fit small screen.

**Navigation**
- Resume link removed — site + LinkedIn + email are the contact paths for now
- OG/Twitter meta tags added to index.html for LinkedIn/Slack/iMessage share previews

**Content fixes**
- BuilderLoop Step 5: fixed circular copy ("The change matters as much as the change" → "The person matters as much as the outcome")
- Making the Darkness Conscious (alsoMe.js): changed dead `link: '#'` to `link: null` — Card component handles gracefully
- Footer: chrispowell.ai text is now a live hyperlink, copyright year is dynamic via `new Date().getFullYear()`
- UnicornLand added to Also Me section (was only in Projects)
- Also Me cards: GSAP ScrollTrigger stagger animations added (matching timeline section)

**Chat interface**
- "Recruiter" audience tab renamed to "Let's Connect" — neutral framing, not job-search signaling
- Last question changed from "What is Chris looking for next?" to "What kind of work energizes Chris most?"

**Terminal**
- Added 3 `git log` style command sequences showing career history as fake commit messages
- Added `git log --format="%s"` sequence that reads as a personal manifesto
- Fixed: multi-line output strings must use `\n` escape sequences, not literal newlines

**Status badge**
- Pulsing cyan dot + "Always open for a conversation" added below stack tags in hero
- Fades in with staggered hero entrance (950ms delay)

## Known Gaps
- Also Me section images are TODO placeholders — real photos needed (photography, lights, shop, 3D prints)
- Podcast link (Making the Darkness Conscious) is null until published
- Resume link removed from nav — add back when updated PDF is ready
- headshot.jpg is 79KB — consider converting to WebP for faster load

## Notes for Claude Code
- This is Chris's personal story/brand — tone is authentic, direct, no LinkedIn-speak
- Emphasize: leadership + curiosity + building (the "same brain, different materials" theme)
- Site was built in one evening as proof of the learning/building ethos
- Personal context (values, career detail, voice) lives in SYSTEM_PROMPT env var for AI chat
- The AI chat is the centerpiece — it's a live demo of Chris's AI capability, not just a contact form
- UnicornLand (unicornland.chrispowell.ai) is live — game co-designed with a creative collaborator, Kaboom.js
- image-forge (github.com/chrispowell-ai/image-forge) is live — DALL-E 3 batch image generation tool
