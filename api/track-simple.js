// Simple Analytics - Stores data in GitHub repo JSON file
// No external services, no Vercel resources, completely free

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
      
      // Simple: Just log it
      // The data will be in Vercel logs
      // For a dashboard, you can manually copy logs or use a simple file
      console.log('[ANALYTICS]', JSON.stringify({
        path: trackingData.path,
        timestamp: trackingData.timestamp,
        session: trackingData.sessionId?.substring(0, 8)
      }));
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Tracking error:', error);
      return res.status(500).json({ error: 'Failed to process tracking' });
    }
  }
  
  if (req.method === 'GET') {
    // Return message - data is in logs
    return res.status(200).json({
      message: 'Analytics are being logged. View in Vercel Dashboard > Functions > Logs',
      totalPageViews: 0,
      note: 'For a simple dashboard, check your Vercel function logs'
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}




