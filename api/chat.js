import Anthropic from '@anthropic-ai/sdk';

const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_TURNS = 4; // last 4 turns = 8 messages

// SYSTEM_PROMPT is loaded from an environment variable, never from a file in
// the repo. The real prompt is private career content; see
// api/system-prompt.example.js for the expected structure.
//
// Accepts two formats so the workflow is forgiving:
//   - base64-encoded (recommended for local .env — avoids multi-line quoting)
//   - plain multi-line text (works in Vercel dashboard, which supports it)
// If neither looks valid, the request returns a 500 with an explicit message.
function loadSystemPrompt() {
  const raw = process.env.SYSTEM_PROMPT || '';
  if (!raw.trim()) {
    throw new Error(
      'SYSTEM_PROMPT is not set. Set it in .env for local dev and in ' +
        'Vercel > Settings > Environment Variables for production.'
    );
  }
  // Try base64 first.
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    if (decoded.includes('Chris Powell')) return decoded;
  } catch {
    /* fall through */
  }
  // Plain text (Vercel dashboard accepts multi-line values natively).
  if (raw.includes('Chris Powell')) return raw;
  throw new Error(
    'SYSTEM_PROMPT is set but does not look like the expected prompt ' +
      '(no identifier found). Check the value.'
  );
}

// The system prompt instructs the model to end every reply with a
// <followups>...</followups> block containing three suggested questions.
// Extract those, strip the tag from the visible response.
function extractFollowups(text) {
  if (!text) return { response: '', followups: [] };
  const match = text.match(/<followups>([\s\S]*?)<\/followups>/i);
  if (!match) return { response: stripEmDashes(text.trim()), followups: [] };
  const followups = match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').replace(/^["'“”]|["'“”]$/g, '').trim())
    .filter((line) => line.length > 0 && line.length <= 160)
    .slice(0, 3);
  const response = stripEmDashes(text.replace(match[0], '').trim());
  return { response, followups };
}

// Voice rule: no em dashes, ever. The model sometimes ignores it; enforce in post.
// Replace em/en dash with comma+space, tidy spacing while preserving paragraph breaks.
function stripEmDashes(text) {
  return text
    .replace(/[ \t]*[—–][ \t]*/g, ', ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/,[ \t]*,/g, ',');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body ?? {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return res
        .status(400)
        .json({ error: `Message must be ${MAX_MESSAGE_CHARS} characters or fewer.` });
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const trimmed = safeHistory
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string'
      )
      .slice(-MAX_HISTORY_TURNS * 2);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY.' });
    }

    const client = new Anthropic({ apiKey });

    let systemPrompt;
    try {
      systemPrompt = loadSystemPrompt();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    const result = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
    });

    const raw =
      Array.isArray(result?.content) && result.content.length > 0
        ? result.content
            .filter((block) => block.type === 'text')
            .map((block) => block.text)
            .join('\n')
            .trim()
        : '';

    if (!raw) {
      return res.status(502).json({ error: 'Empty response from model.' });
    }

    const { response, followups } = extractFollowups(raw);

    if (!response) {
      return res.status(502).json({ error: 'Empty response from model.' });
    }

    return res.status(200).json({ response, followups });
  } catch (err) {
    const msg =
      err?.error?.message ||
      err?.message ||
      'Unexpected error calling the Claude API.';
    return res.status(500).json({ error: msg });
  }
}
