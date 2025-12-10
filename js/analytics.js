// Lightweight Internal Analytics Tracking
(function() {
  'use strict';
  
  // Configuration
  const API_ENDPOINT = '/api/track';
  const DEBUG = false;
  
  // Get current page info
  function getPageInfo() {
    return {
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language || navigator.userLanguage,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
  
  // Generate a simple session ID (stored in sessionStorage)
  function getSessionId() {
    if (!sessionStorage.getItem('analytics_session')) {
      sessionStorage.setItem('analytics_session', Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    return sessionStorage.getItem('analytics_session');
  }
  
  // Send tracking data
  function trackPageView() {
    const data = {
      ...getPageInfo(),
      sessionId: getSessionId()
    };
    
    if (DEBUG) {
      console.log('Analytics Track:', data);
    }
    
    // Use sendBeacon for reliable tracking (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        API_ENDPOINT,
        JSON.stringify(data)
      );
    } else {
      // Fallback to fetch
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(err => {
        if (DEBUG) console.error('Analytics error:', err);
      });
    }
  }
  
  // Track on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }
  
  // Track on visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      // Optional: track return visits
      // trackPageView();
    }
  });
})();




