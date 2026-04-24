// Analytics API: question logging, feedback collection, visitor tracking
// All data stored in Vercel KV (configure in Vercel dashboard)
// GET /api/analytics — retrieve logs (protected by secret key)
// POST /api/analytics/question — log a visitor question
// POST /api/analytics/feedback — submit feedback on a chat response
// POST /api/analytics/pageview — log page visit

import { kv } from '@vercel/kv';

const ANALYTICS_KEY = process.env.ANALYTICS_SECRET_KEY || '';

// Validate request has correct secret for reading data
function validateSecret(req) {
  const secret = req.headers['x-analytics-key'] || req.query?.key || '';
  return secret === ANALYTICS_KEY && ANALYTICS_KEY.length > 0;
}

// Check if text contains offensive language (basic filter)
function isFlaggedContent(text) {
  if (!text) return false;
  const offensive = [
    /\bstupid\b/i,
    /\bidiot\b/i,
    /\basshole\b/i,
    /\bdumbass\b/i,
    /fuck/i,
    /\bshit\b/i,
  ];
  return offensive.some((pattern) => pattern.test(text));
}

export default async function handler(req, res) {
  // Disable CORS for analytics (backend-only)
  res.setHeader('Access-Control-Allow-Origin', 'https://chrispowell.ai');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST /api/analytics/question — log a visitor question
    if (req.method === 'POST' && req.url?.includes('/question')) {
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
    }

    // POST /api/analytics/feedback — submit feedback on a response
    if (req.method === 'POST' && req.url?.includes('/feedback')) {
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
    }

    // POST /api/analytics/pageview — log page visit
    if (req.method === 'POST' && req.url?.includes('/pageview')) {
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
    }

    // GET /api/analytics — retrieve logs (requires secret)
    if (req.method === 'GET') {
      if (!validateSecret(req)) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      const type = req.query?.type || 'all'; // questions, feedback, pageviews, all
      const limit = Math.min(parseInt(req.query?.limit || 50, 10), 200);

      const data = {};

      if (type === 'questions' || type === 'all') {
        const rawQuestions = await kv.lrange('analytics:questions', 0, limit - 1);
        data.questions = rawQuestions.map((q) => JSON.parse(q));
      }

      if (type === 'feedback' || type === 'all') {
        const rawFeedback = await kv.lrange('analytics:feedback', 0, limit - 1);
        const rawFlagged = await kv.lrange('analytics:feedback:flagged', 0, limit - 1);
        data.feedback = rawFeedback.map((f) => JSON.parse(f));
        data.flaggedFeedback = rawFlagged.map((f) => JSON.parse(f));
      }

      if (type === 'pageviews' || type === 'all') {
        const rawViews = await kv.lrange('analytics:pageviews', 0, limit - 1);
        data.pageviews = rawViews.map((v) => JSON.parse(v));

        // Get last 30 days of visit counts
        const visitCounts = {};
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const count = await kv.get(`analytics:visits:${dateStr}`);
          visitCounts[dateStr] = count ? parseInt(count, 10) : 0;
        }
        data.visitCounts = visitCounts;
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err) {
    console.error('Analytics error:', err.message);
    return res.status(500).json({ error: 'Failed to process analytics.' });
  }
}
