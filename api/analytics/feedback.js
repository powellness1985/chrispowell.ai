import { kv } from '@vercel/kv';

function isFlaggedContent(text) {
  if (!text) return false;
  const flaggedWords = [
    'kill', 'hate', 'fuck', 'shit', 'damn', 'crap',
    'violence', 'sexual', 'abuse', 'racist',
  ];
  const lower = text.toLowerCase();
  return flaggedWords.some(word => lower.includes(word));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://chrispowell.ai');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { message, chatContext, sentiment, timestamp } = req.body || {};
    if (!message || typeof message !== 'string' || message.length === 0) {
      return res.status(400).json({ error: 'Feedback is required.' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: 'Feedback too long.' });
    }

    const isFlagged = isFlaggedContent(message);
    const feedbackId = `f_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const logEntry = {
      id: feedbackId,
      message: message.trim(),
      chatContext: chatContext || null,
      sentiment: sentiment || 'neutral',
      flagged: isFlagged,
      timestamp: timestamp || new Date().toISOString(),
      reviewed: false,
    };

    const key = isFlagged ? 'analytics:feedback:flagged' : 'analytics:feedback';
    await kv.lpush(key, JSON.stringify(logEntry));
    return res.status(201).json({ id: feedbackId, flagged: isFlagged });
  } catch (err) {
    console.error('Analytics feedback error:', err.message);
    return res.status(500).json({ error: 'Failed to process feedback.' });
  }
}
