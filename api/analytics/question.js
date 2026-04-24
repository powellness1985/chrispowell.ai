import { kv } from '@vercel/kv';

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
    const { message, timestamp } = req.body || {};
    if (!message || typeof message !== 'string' || message.length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: 'Message too long.' });
    }

    const questionId = `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const logEntry = {
      id: questionId,
      message: message.trim(),
      timestamp: timestamp || new Date().toISOString(),
      reviewed: false,
    };

    await kv.lpush('analytics:questions', JSON.stringify(logEntry));
    return res.status(201).json({ id: questionId });
  } catch (err) {
    console.error('Analytics question error:', err.message);
    return res.status(500).json({ error: 'Failed to process question.' });
  }
}
