import { kv } from '@vercel/kv';

const ANALYTICS_KEY = process.env.ANALYTICS_SECRET_KEY || '';

function validateSecret(req) {
  const secret = req.headers['x-analytics-key'] || req.query?.key || '';
  return secret === ANALYTICS_KEY && ANALYTICS_KEY.length > 0;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://chrispowell.ai');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    if (!validateSecret(req)) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const limit = parseInt(req.query?.limit || '100', 10);
    const type = req.query?.type || 'all';

    const data = {
      questions: [],
      feedback: [],
      flaggedFeedback: [],
      pageviews: [],
      visitCounts: {},
    };

    // Get questions
    if (type === 'all' || type === 'questions') {
      try {
        const questionsRaw = await kv.lrange('analytics:questions', 0, limit - 1);
        data.questions = (questionsRaw || []).map(q => typeof q === 'string' ? JSON.parse(q) : q);
      } catch (e) {
        console.error('Error fetching questions:', e);
        data.questions = [];
      }
    }

    // Get feedback
    if (type === 'all' || type === 'feedback') {
      try {
        const feedbackRaw = await kv.lrange('analytics:feedback', 0, limit - 1);
        data.feedback = (feedbackRaw || []).map(f => typeof f === 'string' ? JSON.parse(f) : f);
      } catch (e) {
        console.error('Error fetching feedback:', e);
        data.feedback = [];
      }

      try {
        const flaggedRaw = await kv.lrange('analytics:feedback:flagged', 0, limit - 1);
        data.flaggedFeedback = (flaggedRaw || []).map(f => typeof f === 'string' ? JSON.parse(f) : f);
      } catch (e) {
        console.error('Error fetching flagged feedback:', e);
        data.flaggedFeedback = [];
      }
    }

    // Get pageviews
    if (type === 'all' || type === 'pageviews') {
      try {
        const pageviewsRaw = await kv.lrange('analytics:pageviews', 0, limit - 1);
        data.pageviews = (pageviewsRaw || []).map(p => typeof p === 'string' ? JSON.parse(p) : p);
      } catch (e) {
        console.error('Error fetching pageviews:', e);
        data.pageviews = [];
      }
    }

    // Get visit counts
    if (type === 'all' || type === 'visits') {
      try {
        const visitCounts = {};
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const count = await kv.get(`analytics:visits:${dateStr}`);
          visitCounts[dateStr] = count ? parseInt(count, 10) : 0;
        }
        data.visitCounts = visitCounts;
      } catch (e) {
        console.error('Error fetching visit counts:', e);
      }
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Analytics error:', err.message, err.stack);
    return res.status(500).json({ error: 'Failed to process analytics.', details: err.message });
  }
}
