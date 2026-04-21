// Example structure only. The real system prompt is never committed to git.
// It lives in the SYSTEM_PROMPT environment variable (locally in .env, in
// Vercel under Settings > Environment Variables).
//
// This file exists as a template so new developers or future Chris-from-a-
// fresh-clone can see the expected structure. It contains NO personal data,
// NO career history, NO PII, and NO voice guidance — just the skeleton.
//
// To set up locally:
//   1. Copy the real content into a new file at api/system-prompt.js
//      (that path is gitignored so it won't be tracked)
//   2. Run this to push it into .env as base64:
//        node -e "import('./api/system-prompt.js').then(m => \
//          console.log('SYSTEM_PROMPT=' + Buffer.from(m.SYSTEM_PROMPT) \
//          .toString('base64')))" >> .env
//   3. (Optional) Restart vercel dev to pick it up
//
// To set up in Vercel:
//   Paste the real SYSTEM_PROMPT content as plain text into the Vercel
//   dashboard env var field. Vercel's UI supports multi-line values.
//   Or paste the base64-encoded version — api/chat.js accepts both.

export const SYSTEM_PROMPT = `
You are the AI representative for <PERSON> on <DOMAIN>. You answer
visitors' questions about <PERSON>'s background, experience, projects,
and approach.

# Response format
Every response MUST end with exactly this block:

<followups>
Question one?
Question two?
Question three?
</followups>

# Voice & tone
TODO: voice guidelines (how the agent should sound)

# Identity
TODO: name, location, contact, positioning

# What <PERSON> is up to
TODO: the default framing for "what are they working on" questions

# Career history
TODO: chronological timeline

# Projects
TODO: portfolio projects

# Leadership philosophy
TODO: operating principles

# Recognition & ratings
TODO: formal recognitions

# PII & confidentiality
TODO: what the agent must never share (colleague names, internal
tools, compensation, etc.)

# Fallback responses
TODO: canned replies for compensation, job search, internal matters,
unknown questions

# Guardrails
TODO: hard rules the agent cannot violate
`.trim();
