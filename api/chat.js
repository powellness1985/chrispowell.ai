import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './system-prompt.js';

const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_TURNS = 4; // last 4 turns = 8 messages

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

    const result = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        ...trimmed.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
    });

    const text =
      Array.isArray(result?.content) && result.content.length > 0
        ? result.content
            .filter((block) => block.type === 'text')
            .map((block) => block.text)
            .join('\n')
            .trim()
        : '';

    if (!text) {
      return res.status(502).json({ error: 'Empty response from model.' });
    }

    return res.status(200).json({ response: text });
  } catch (err) {
    const msg =
      err?.error?.message ||
      err?.message ||
      'Unexpected error calling the Claude API.';
    return res.status(500).json({ error: msg });
  }
}
