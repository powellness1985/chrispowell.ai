# Analytics Setup & Usage

This document covers the analytics system for chrispowell.ai: question logging, feedback collection, and visitor tracking.

## Overview

The analytics system automatically captures:
- **Questions** — Every visitor question asked in the chat
- **Feedback** — Thumbs up/down reactions and detailed feedback on responses
- **Page Views** — Daily visitor counts across all sections

All data is stored in Upstash Redis (via Vercel KV integration) and accessible via a secure API endpoint.

## Architecture

- **Frontend** — Chat reactions and question logging happen automatically in the browser
- **Backend** — `api/analytics.js` handles all logging and retrieval
- **Storage** — Upstash Redis (serverless, auto-scaling)
- **Security** — Secret key required to access analytics data

## Setup

### 1. Upstash Redis Database (Already Done)

The Upstash Redis database `upstash-kv-green-house` is already created and connected to your Vercel project.

### 2. Environment Variables

These should already be in your Vercel project. To pull them locally:

```bash
vercel env pull .env.development.local
```

Your `.env` should now contain:
```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
KV_URL=https://...
KV_REST_API_KEY=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### 3. Analytics Secret Key

In Vercel dashboard, go to **Settings > Environment Variables** and add:

```
ANALYTICS_SECRET_KEY=<your-secure-random-32-char-string>
```

**Example:**
```
ANALYTICS_SECRET_KEY=abcdef123456789abcdef123456789ab
```

This key protects access to your analytics data. Keep it private.

## API Endpoints

### POST /api/analytics/question
Logs a visitor question (called automatically on each chat message).

**Request:**
```json
{
  "message": "What's Chris's take on AI right now?",
  "timestamp": "2026-04-21T15:30:00Z"
}
```

**Response:**
```json
{
  "id": "q_1713703800000_abc123de"
}
```

### POST /api/analytics/feedback
Logs feedback on a response (thumbs up/down or detailed text feedback).

**Request:**
```json
{
  "message": "👍",
  "chatContext": "Answer excerpt...",
  "sentiment": "positive",
  "timestamp": "2026-04-21T15:30:00Z"
}
```

**Response:**
```json
{
  "id": "f_1713703800000_xyz789ab",
  "flagged": false
}
```

**Sentiment Values:**
- `positive` — Thumbs up
- `negative` — Thumbs down
- `constructive` — Detailed feedback

**Flagged Content:**
If the feedback contains offensive language, `flagged: true` and stored separately in `analytics:feedback:flagged`.

### POST /api/analytics/pageview
Logs a page view (called automatically on app load).

**Request:**
```json
{
  "path": "/",
  "referrer": "https://google.com",
  "timestamp": "2026-04-21T15:30:00Z"
}
```

**Response:**
```json
{
  "id": "v_1713703800000_def456gh"
}
```

### GET /api/analytics
Retrieves all analytics data (requires `ANALYTICS_SECRET_KEY`).

**Authentication:**
Pass the secret key via header or query parameter:
```bash
# Via header
curl -H "x-analytics-key: <your-secret>" https://chrispowell.ai/api/analytics

# Via query parameter
curl https://chrispowell.ai/api/analytics?key=<your-secret>
```

**Query Parameters:**
- `type` — Filter results: `questions`, `feedback`, `pageviews`, or `all` (default: `all`)
- `limit` — Number of results (default: 50, max: 200)

**Example Requests:**

Get all questions:
```bash
curl "https://chrispowell.ai/api/analytics?type=questions&limit=100&key=<secret>"
```

Get flagged feedback:
```bash
curl "https://chrispowell.ai/api/analytics?type=feedback&key=<secret>"
```

Get page view statistics:
```bash
curl "https://chrispowell.ai/api/analytics?type=pageviews&key=<secret>"
```

**Response Example:**
```json
{
  "questions": [
    {
      "id": "q_1713703800000_abc123de",
      "message": "What's Chris's take on AI right now?",
      "timestamp": "2026-04-21T15:30:00Z",
      "reviewed": false
    }
  ],
  "feedback": [
    {
      "id": "f_1713703800000_xyz789ab",
      "message": "Great answer, really helpful!",
      "chatContext": "Answer excerpt...",
      "sentiment": "constructive",
      "flagged": false,
      "timestamp": "2026-04-21T15:31:00Z",
      "reviewed": false
    }
  ],
  "flaggedFeedback": [],
  "pageviews": [
    {
      "id": "v_1713703800000_def456gh",
      "path": "/",
      "referrer": null,
      "timestamp": "2026-04-21T15:30:00Z"
    }
  ],
  "visitCounts": {
    "2026-04-21": 42,
    "2026-04-20": 38,
    "2026-04-19": 29
  }
}
```

## Offline Content Filtering

The analytics API includes basic offensive content filtering:

**Filtered words:**
- stupid, idiot, asshole, dumbass, fuck, shit

If feedback contains any of these words, it's automatically flagged and stored separately in `analytics:feedback:flagged`. You can still see it, but it's separated from constructive feedback.

## Accessing Analytics

### Manual Query
Use curl or a tool like Postman:
```bash
curl -H "x-analytics-key: your-secret-key" \
  https://chrispowell.ai/api/analytics?type=questions&limit=50
```

### Create a Personal Dashboard (Optional)
You could build a simple dashboard by:
1. Creating a protected page (`/admin/analytics`)
2. Fetching from `/api/analytics` with your secret key
3. Displaying questions, feedback reactions, and visitor trends

Example:
```javascript
const response = await fetch('/api/analytics?type=questions&limit=100&key=' + SECRET_KEY);
const data = await response.json();
console.log(data.questions); // Array of all questions
```

## Data Retention

- Questions, feedback, and page views are stored indefinitely in Upstash Redis
- No automatic deletion
- You can manually clear data by connecting to Upstash dashboard and flushing the database

## Best Practices

1. **Keep your secret key private** — Never commit it to git, never share it publicly
2. **Monitor regularly** — Check questions weekly to identify content gaps
3. **Act on feedback** — If multiple people give thumbs down, investigate why
4. **Track trends** — Visit counts and question patterns show what resonates

## Troubleshooting

### Analytics not logging
1. Check that `UPSTASH_REDIS_REST_URL` and `KV_REST_API_KEY` are in your Vercel environment variables
2. Run `vercel env pull .env.development.local` to get the latest credentials locally
3. Restart your dev server

### Can't access analytics endpoint
1. Verify `ANALYTICS_SECRET_KEY` is set in Vercel environment variables
2. Confirm the secret key in your API request matches exactly
3. Check that the request includes the `x-analytics-key` header or `key` query parameter

### Redis connection errors
1. Go to Vercel dashboard > Storage > Upstash for Redis
2. Verify status is "Available" (green dot)
3. If unavailable, click "Connect Project" again

## Files Modified

- `api/analytics.js` — Analytics API endpoint
- `src/components/ChatInterface.jsx` — Question logging and feedback UI
- `src/App.jsx` — Page view tracking
- `package.json` — Added `@vercel/kv` dependency

## Next Steps

1. ✅ Upstash Redis created and connected
2. ✅ Environment variables configured
3. ✅ Analytics code deployed
4. → Monitor incoming questions and feedback
5. → Build dashboard (optional) to visualize trends
