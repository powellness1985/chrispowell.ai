# chrispowell.ai

Personal AI portfolio site for Chris Powell. Built with React + Vite + Tailwind, animated with tsParticles and GSAP, and backed by the Anthropic Claude API through a Vercel serverless function.

Live at [chrispowell.ai](https://chrispowell.ai).

---

## Overview

- Full-screen particle hero that assembles into the name, scatters, then reveals the tagline and badge pills.
- Fixed nav with glass/blur on scroll and active-section highlighting.
- "The Story So Far" vertical career timeline with GSAP scroll animations.
- "Built, Not Just Theorized" project cards.
- "Ask About Chris" chat interface powered by Claude Haiku (cost-efficient) via `/api/chat`.
- Serverless function trims history to the last 4 turns and enforces a 500-char message cap.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- tsParticles (hero animation)
- GSAP (scroll-triggered reveals)
- @anthropic-ai/sdk (serverless function)
- Vercel (hosting + serverless + custom domain)

## Local setup

```bash
npm install
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`.

The chat endpoint (`/api/chat`) only runs under Vercel. To test it locally, install the Vercel CLI and run `vercel dev`:

```bash
npm i -g vercel
vercel dev
```

You will also need a local `.env` file with `ANTHROPIC_API_KEY` set (see `.env.example`).

## Filling in the system prompt

Before the chat experience will represent you well, replace the placeholder in [`api/system-prompt.js`](api/system-prompt.js). The file exports a single string constant `SYSTEM_PROMPT` with scaffolded sections: **Identity**, **Career history**, **Projects**, **Philosophy & approach**, and **Guardrails**. Replace the entire file contents with your own copy — the rest of the app will pick it up automatically.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project** and import the GitHub repo.
3. Framework preset: **Vite** (auto-detected from `vercel.json`).
4. Build command: `npm run build`. Output directory: `dist`.
5. Click **Deploy**. The `/api/chat` function is deployed automatically from the `api/` directory.

## Environment variables on Vercel

In the Vercel project dashboard → **Settings → Environment Variables**:

- Add `ANTHROPIC_API_KEY` with your Anthropic API key.
- Apply to **Production**, **Preview**, and (optionally) **Development**.
- Redeploy so the function picks up the new value.

Never commit your API key to git. `.env` is already in `.gitignore`.

## Custom domain — chrispowell.ai

In the Vercel project dashboard → **Settings → Domains**:

1. Add `chrispowell.ai` and `www.chrispowell.ai`.
2. Vercel will show the DNS records you need — typically either **nameserver delegation** to Vercel, or **A/ALIAS** records at your registrar pointing to Vercel.
3. If the domain is registered somewhere else (e.g., Cloudflare, Namecheap), log into that registrar and add the records Vercel shows you.
4. Wait for DNS propagation (usually minutes, sometimes up to an hour). Vercel auto-provisions an SSL cert once DNS is valid.

## Notes on cost

The chat interface uses **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) for cost efficiency — fast, inexpensive, and strong enough for Q&A about a resume. History is trimmed to the last 4 turns server-side to keep every request bounded. If you want richer answers later, swap to Sonnet in `api/chat.js` — one line change.

## License

Private, personal project. All content © Chris Powell.
