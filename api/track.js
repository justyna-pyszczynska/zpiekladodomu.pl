// Free Analytics - Zero Vercel Resources
// Currently: Simple logging (no storage cost)
// To enable persistent storage, see ANALYTICS-FREE-SETUP.md

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const trackingData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Current: Just log (no storage, no cost, zero Vercel resources)
      // Logs are visible in Vercel Dashboard > Functions > Logs
      console.log('[ANALYTICS]', JSON.stringify({
        path: trackingData.path,
        timestamp: trackingData.timestamp,
        sessionId: trackingData.sessionId?.substring(0, 8) // Privacy-safe
      }));
      
      // TODO: To enable persistent storage with zero Vercel resources:
      // 1. See ANALYTICS-FREE-SETUP.md
      // 2. Choose: Supabase (recommended), MongoDB Atlas, or JSONBin.io
      // 3. Update this file with the storage code from examples
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Tracking error:', error);
      return res.status(500).json({ error: 'Failed to process tracking' });
    }
  }
  
  if (req.method === 'GET') {
    // Return placeholder - configure free storage to get real data
    // See ANALYTICS-FREE-SETUP.md for setup instructions
    return res.status(200).json({
      message: 'Analytics logging enabled. For persistent storage, see ANALYTICS-FREE-SETUP.md',
      note: 'Current setup: Logs to Vercel function logs (view in Dashboard > Functions > Logs)',
      totalPageViews: 0,
      uniqueSessions: 0,
      totalPages: 0,
      dailyStats: {},
      topPages: [],
      setupGuide: 'See ANALYTICS-FREE-SETUP.md for free storage options (Supabase recommended)'
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}











