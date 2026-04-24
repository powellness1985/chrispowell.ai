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
    const { path, referrer, timestamp } = req.body || {};
    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: 'Path is required.' });
    }

    const viewId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const logEntry = {
      id: viewId,
      path: path.trim(),
      referrer: referrer || null,
      timestamp: timestamp || new Date().toISOString(),
    };

    await kv.lpush('analytics:pageviews', JSON.stringify(logEntry));

    // Increment daily counter
    const today = new Date().toISOString().split('T')[0];
    await kv.incr(`analytics:visits:${today}`);

    return res.status(201).json({ id: viewId });
  } catch (err) {
    console.error('Analytics pageview error:', err.message);
    return res.status(500).json({ error: 'Failed to process pageview.' });
  }
}
