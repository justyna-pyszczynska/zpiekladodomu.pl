# Free Analytics Setup (Zero Vercel Resources)

This guide shows you how to set up analytics using **completely free external services** that won't consume any Vercel resources or bandwidth.

## ✅ Recommended: Supabase (Free Tier)

**Why Supabase:**
- ✅ 500 MB database (plenty for analytics)
- ✅ Unlimited API requests
- ✅ **Zero cost** forever on free tier
- ✅ **Zero Vercel resources consumed** (external service)
- ✅ Easy setup
- ✅ Real-time capabilities

### Setup Steps:

1. **Create free Supabase account:**
   - Go to https://supabase.com
   - Sign up (free)
   - Create a new project

2. **Create analytics table:**
   ```sql
   CREATE TABLE analytics (
     id BIGSERIAL PRIMARY KEY,
     path TEXT NOT NULL,
     session_id TEXT,
     referrer TEXT,
     timestamp TIMESTAMPTZ DEFAULT NOW(),
     user_agent TEXT,
     screen_width INTEGER,
     screen_height INTEGER,
     language TEXT,
     timezone TEXT
   );

   CREATE INDEX idx_analytics_path ON analytics(path);
   CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);
   CREATE INDEX idx_analytics_session ON analytics(session_id);
   ```

3. **Get your Supabase credentials:**
   - Project Settings > API
   - Copy "Project URL" and "anon public" key

4. **Update `api/track.js`:**
   - See `api/track-supabase.js.example` for the code
   - Set environment variables in Vercel:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`

## ✅ Alternative: MongoDB Atlas (Free Tier)

**Why MongoDB Atlas:**
- ✅ 512 MB free storage
- ✅ **Zero Vercel resources**
- ✅ Very generous free tier

### Setup Steps:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update API endpoint (see example files)

## ✅ Alternative: JSONBin.io (Free Tier)

**Why JSONBin:**
- ✅ Free tier: 100 requests/day
- ✅ Simple JSON storage
- ✅ **Zero Vercel resources**

**Setup:**
1. Sign up at https://jsonbin.io
2. Get API key
3. Store analytics data as JSON

## ✅ Option: Client-Side Only (Zero Server Resources)

Store analytics entirely in the browser and export when needed:

- Use IndexedDB (browser storage)
- Export to CSV/JSON
- No server resources at all

See `js/analytics-client-only.js.example` for this approach.

## Cost Comparison

| Solution | Cost | Vercel Resources | Storage | Best For |
|----------|------|------------------|---------|----------|
| **Supabase** | FREE | 0% | 500 MB | ⭐ Recommended |
| **MongoDB Atlas** | FREE | 0% | 512 MB | Good alternative |
| **JSONBin.io** | FREE | 0% | Unlimited* | Simple use |
| **Client-side** | FREE | 0% | Browser only | Small sites |

*With free tier limits

## Recommendation

**Use Supabase** - it's the easiest, most reliable, and completely free solution that won't touch your Vercel resources at all.

## Next Steps

1. Choose your storage solution (Supabase recommended)
2. Follow the setup guide for that service
3. Update `api/track.js` with the storage code
4. Set environment variables in Vercel
5. Start tracking!

All solutions are **completely free** and use **zero Vercel resources**.




