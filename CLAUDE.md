# chrispowell.ai — Claude Code Project Guide

## Overview
Personal portfolio site for Chris Powell built with React, Vite, Tailwind, and Claude API. Single-page app showcasing work, creative projects, and an AI-powered chat interface.

## Key Files & Architecture
- **src/components/** — React components (ParticleHero, About, Projects, AlsoMe, Chat, Navigation, Footer)
- **src/data/** — Data files (projects.js, alsoMe.js)
- **api/** — Vercel serverless function for chat backend
- **public/** — Static assets (headshot.jpg, favicon)

## Development
```bash
npm run dev    # Vite dev server on port 5173
npm run build  # Production build
```

## Style Guide
- **Color palette:** Dark bg (#0a0a0f), cyan accents (#00D4FF), white text (#e8e8f0)
- **Spacing/layout:** Tailwind, max-width 6xl containers, consistent padding
- **Components:** Use existing pill, card, btn-ghost classes from index.css
- **Typography:** Inter font, semibold for headings, tracking-tight for brand

## Code Conventions
- No comments unless WHY is non-obvious
- Prefer existing abstractions (don't create premature helpers)
- Edit existing files > create new ones
- Test UI changes in browser before committing (can't always do this, but verify when possible)

## Content Areas (Update in .js files)
- **Timeline:** src/components/About.jsx (TIMELINE array)
- **Projects:** src/data/projects.js
- **Also Me:** src/data/alsoMe.js
- **Chat suggestions:** src/components/ChatInterface.jsx (SUGGESTED array)

## API
- Chat backend: api/chat.js (Claude Haiku via Anthropic SDK)
- System prompt: api/system-prompt.js (contains personal context for AI — git-ignored)
- Environment: .env (API key, etc.)

## Git Workflow
- Commit frequently with clear messages
- Always `git pull` before starting work on a different machine
- Push after each logical unit of work

## Known Gaps
- Also Me section images are TODO placeholders (need real assets)
- DadOps Bot and Proactive AI links are placeholder (#)
- Podcast link is placeholder (#)

## Notes for Claude
- This is Chris's personal story/brand — tone is authentic, not LinkedIn-y
- Emphasize: leadership + curiosity + building (the "same brain, different materials" theme)
- Site was built in one evening as proof of the learning/building ethos
- Personal context (Enneagram, communication style, etc.) lives in api/system-prompt.js for AI chat
