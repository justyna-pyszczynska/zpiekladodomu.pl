# Internal Analytics Setup Guide

This is a lightweight, internal analytics system for tracking page views and basic user statistics without using Vercel's paid analytics tools.

## Features

- ✅ Lightweight tracking (minimal resource usage)
- ✅ Page view tracking
- ✅ Session tracking
- ✅ Daily statistics
- ✅ Top pages analysis
- ✅ Admin dashboard

## Setup Instructions

### Option 1: Simple Logging (Current - No Storage)

The current setup logs analytics data to Vercel's function logs. You can view this in your Vercel dashboard under **Functions > Logs**.

**Pros:**
- No setup required
- Zero cost
- Works immediately

**Cons:**
- Data is not persistent
- Limited to viewing in logs
- Not ideal for long-term analytics

### Option 2: Vercel KV (Recommended - Free Tier Available)

For persistent storage, use Vercel KV (free tier available):

1. **Install Vercel KV:**
   ```bash
   npm install @vercel/kv
   ```

2. **Set up KV in Vercel Dashboard:**
   - Go to your Vercel project
   - Navigate to **Storage** tab
   - Create a new **KV Database**
   - Copy the connection details

3. **Update `api/track.js`:**
   Replace the file with the KV-enabled version (see below)

4. **Set Environment Variables in Vercel:**
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### Option 3: Supabase (Free Tier Available)

Alternatively, use Supabase for storage:

1. Create a free Supabase project
2. Create a table for analytics
3. Use their API to store data

## Installation

1. **Add the tracking script to all your HTML pages:**

   Add this line before the closing `</body>` tag in all HTML files:
   
   ```html
   <script src="/js/analytics.js"></script>
   ```

2. **Access the admin dashboard:**
   
   Visit `/analytics.html` to view your analytics data.

## Adding Tracking to Pages

### Manual Method

Add to each HTML file before `</body>`:
```html
<script src="/js/analytics.js"></script>
```

### Automatic Method (Bulk Update)

You can use a script or search/replace to add it to all HTML files.

## What Gets Tracked

- Page path/URL
- Referrer (where users came from)
- Timestamp
- User agent
- Screen resolution
- Language
- Timezone
- Session ID

## Privacy

This system:
- ✅ No cookies required
- ✅ No external services
- ✅ No third-party tracking
- ✅ Data stored internally
- ✅ Session-based tracking (sessionStorage)

## Dashboard

Access your analytics at: `https://yourdomain.com/analytics.html`

The dashboard shows:
- Total page views
- Unique sessions
- Total pages tracked
- Top pages
- Daily statistics

## Upgrading to Persistent Storage

If you want persistent storage, choose one of these options:

### Vercel KV Setup

1. Install: `npm install @vercel/kv`
2. Create KV database in Vercel dashboard
3. Update `api/track.js` with KV code (see example below)
4. Set environment variables

Example KV-enabled code:

```javascript
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const date = new Date(data.timestamp).toISOString().split('T')[0];
    
    // Increment page view
    await kv.incr(`pageview:${data.path}`);
    await kv.incr(`daily:${date}`);
    
    // Store session
    await kv.set(`session:${data.sessionId}`, data, { ex: 86400 });
    
    return res.json({ success: true });
  }
  
  // GET handler for dashboard...
}
```

## Cost Considerations

- **Current Setup**: Free (logs only)
- **Vercel KV Free Tier**: 256 MB storage, 30K commands/day
- **Expected Usage**: Very low resource usage

## Troubleshooting

1. **Not seeing data?**
   - Check that `analytics.js` is included on pages
   - Check browser console for errors
   - Verify API endpoint is accessible

2. **Dashboard shows no data?**
   - Configure persistent storage (KV or database)
   - Current setup only logs to Vercel function logs

3. **API errors?**
   - Check Vercel function logs
   - Verify CORS settings
   - Check network requests in browser dev tools

## Security

- Consider adding authentication to `/analytics.html`
- Add rate limiting to API endpoint
- Validate and sanitize tracking data

## Notes

- This is a lightweight solution designed to minimize resource usage
- For production use, consider adding:
  - Rate limiting
  - Authentication
  - Data retention policies
  - Export functionality







