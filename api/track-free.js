// Free Analytics - Uses external storage (no Vercel resources consumed)
// Option 1: Store in JSON file via GitHub API
// Option 2: Use Supabase free tier (recommended - no Vercel resources)

// This version uses a simple approach that stores data in a JSON file
// that you can host anywhere (GitHub, Supabase, etc.)

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
      
      // Store in external service (configure below)
      // Option 1: Supabase (free tier - recommended)
      // Option 2: MongoDB Atlas (free tier)
      // Option 3: JSONBin.io (free tier)
      // Option 4: Simple logging (no storage)
      
      // For now, just log (no storage cost)
      console.log('Analytics:', JSON.stringify({
        path: trackingData.path,
        timestamp: trackingData.timestamp,
        sessionId: trackingData.sessionId?.substring(0, 8) // Privacy
      }));
      
      // TODO: Configure your preferred free storage option below
      // See ANALYTICS-FREE-SETUP.md for instructions
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Tracking error:', error);
      return res.status(500).json({ error: 'Failed to process tracking' });
    }
  }
  
  if (req.method === 'GET') {
    // Return placeholder - configure storage to get real data
    return res.status(200).json({
      message: 'Configure free storage service (see ANALYTICS-FREE-SETUP.md)',
      totalPageViews: 0,
      uniqueSessions: 0,
      totalPages: 0,
      dailyStats: {},
      topPages: []
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}




