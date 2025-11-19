// Vercel Edge Middleware for dynamic Open Graph meta tags
export const runtime = 'edge';

// Function to parse front matter from markdown
function parseFrontMatter(text) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontMatterRegex);
  
  if (!match) return {};
  
  const frontMatterText = match[1];
  const data = {};
  const lines = frontMatterText.split('\n');
  
  let currentKey = null;
  let inList = false;
  let inMultilineString = false;
  let multilineValue = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (inMultilineString) {
      if (line.startsWith('  ') || line.startsWith('\t')) {
        multilineValue.push(trimmed);
        continue;
      } else if (trimmed === '') {
        multilineValue.push('');
        continue;
      } else {
        data[currentKey] = multilineValue.join('\n').trim();
        multilineValue = [];
        inMultilineString = false;
      }
    }
    
    if (trimmed === '') continue;
    
    if (trimmed.startsWith('-') && currentKey) {
      const listItem = trimmed.substring(1).trim().replace(/"/g, '');
      if (!Array.isArray(data[currentKey])) {
        const previousValue = data[currentKey];
        data[currentKey] = [];
        if (previousValue && previousValue !== '') {
          const lines = previousValue.split('\n').map(l => l.trim()).filter(l => l);
          data[currentKey].push(...lines);
        }
      }
      data[currentKey].push(listItem);
      inList = true;
    } else {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        currentKey = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        if (value === '|') {
          inMultilineString = true;
          multilineValue = [];
          inList = false;
          continue;
        }
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        if (value === '' && (currentKey === 'special_features' || currentKey === 'images' || currentKey === 'video_urls')) {
          data[currentKey] = [];
        } else {
          data[currentKey] = value;
        }
        inList = false;
      }
    }
  }
  
  if (inMultilineString && currentKey) {
    data[currentKey] = multilineValue.join('\n').trim();
  }
  
  return data;
}

// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

export default async function middleware(request) {
  const url = new URL(request.url);
  
  // Skip if this is an internal request (to avoid middleware loops)
  if (request.headers.get('X-Internal-Request') === 'true') {
    return;
  }
  
  // Only modify HTML for social media crawlers, not regular browsers
  const userAgent = request.headers.get('User-Agent') || '';
  const isSocialMediaCrawler = 
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('Facebot') ||
    userAgent.includes('facebook') ||
    userAgent.includes('Meta') ||
    userAgent.includes('Twitterbot') ||
    userAgent.includes('LinkedInBot') ||
    userAgent.includes('WhatsApp') ||
    userAgent.includes('Slackbot') ||
    userAgent.includes('SkypeUriPreview') ||
    userAgent.includes('Applebot') ||
    userAgent.includes('Googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('crawler') ||
    userAgent.includes('bot') ||
    userAgent.includes('spider') ||
    userAgent.includes('preview') ||
    userAgent.includes('MetaInspector') ||
    userAgent.includes('MetaURI') ||
    userAgent.includes('Pinterest') ||
    userAgent.includes('Discordbot');
  
  // If it's not a social media crawler, let the request pass through normally
  if (!isSocialMediaCrawler) {
    return;
  }
  
  // Handle both /dog-page and /dog-page.html with dog parameter
  const isDogPage = (url.pathname === '/dog-page' || url.pathname === '/dog-page.html');
  if (!isDogPage || !url.searchParams.has('dog')) {
    return;
  }
  
  const dogName = url.searchParams.get('dog');
  
  if (!dogName) {
    return;
  }
  
  try {
    // Get base URL - handle both www and non-www, http and https
    const protocol = url.protocol || 'https:';
    const host = url.host || 'zpiekladodomu.pl';
    const baseUrl = `${protocol}//${host}`;
    
    // Encode dog name for URL (handle special characters and spaces)
    const encodedDogName = encodeURIComponent(dogName);
    const dogFileUrl = `${baseUrl}/content/dogs/${encodedDogName}.md`;
    
    console.log(`[Middleware] Fetching dog file: ${dogFileUrl}`);
    const dogResponse = await fetch(dogFileUrl);
    
    if (!dogResponse.ok) {
      console.log(`[Middleware] Dog file not found: ${dogFileUrl}, status: ${dogResponse.status}`);
      return;
    }
    
    const markdownText = await dogResponse.text();
    const dogData = parseFrontMatter(markdownText);
    
    if (!dogData || !dogData.name) {
      console.log(`[Middleware] Invalid dog data for: ${dogName}`);
      // If we can't parse the dog data, return without modifying (let default page show)
      return;
    }
    
    console.log(`[Middleware] Loaded dog data for: ${dogData.name}`);
    
    // Fetch the original HTML page (fetch the static file directly, without query params to avoid middleware loop)
    // Use the file path directly since we're on the same domain
    let htmlUrl = `${baseUrl}/dog-page.html`;
    let htmlResponse = await fetch(htmlUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Vercel-Edge-Middleware',
        // Add a header to indicate this is an internal fetch (some setups use this to bypass middleware)
        'X-Internal-Request': 'true',
      },
    });
    
    if (!htmlResponse.ok) {
      // Try without .html extension (in case cleanUrls affects internal fetches)
      htmlUrl = `${baseUrl}/dog-page`;
      htmlResponse = await fetch(htmlUrl, {
        headers: {
          'User-Agent': request.headers.get('User-Agent') || 'Vercel-Edge-Middleware',
          'X-Internal-Request': 'true',
        },
      });
    }
    
    if (!htmlResponse.ok) {
      console.log(`[Middleware] HTML page not found: ${htmlUrl}, status: ${htmlResponse.status}`);
      return;
    }
    
    let html = await htmlResponse.text();
    
    // Get the dog image - use main image or first image from images array
    let dogImage = dogData.image || (Array.isArray(dogData.images) && dogData.images.length > 0 ? dogData.images[0] : null);
    
    // If no image found, use default
    if (!dogImage) {
      dogImage = 'images/adopcje-main.jpg';
    }
    
    // Construct absolute image URL - ensure it's HTTPS and fully qualified
    let fullImageUrl;
    if (dogImage.startsWith('http://') || dogImage.startsWith('https://')) {
      fullImageUrl = dogImage;
    } else if (dogImage.startsWith('/')) {
      fullImageUrl = `${baseUrl}${dogImage}`;
    } else {
      fullImageUrl = `${baseUrl}/${dogImage}`;
    }
    
    // Ensure HTTPS (Facebook requires HTTPS for images)
    if (fullImageUrl.startsWith('http://')) {
      fullImageUrl = fullImageUrl.replace('http://', 'https://');
    }
    
    console.log(`[Middleware] Using image: ${fullImageUrl}`);
    
    // Get description - clean it up
    let description = (dogData.description || 'Poznaj naszych podopiecznych i pomóż im znaleźć kochający dom.')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit description length
    
    // Get the title - ensure dogData.name exists
    const dogNameForTitle = dogData.name || 'Pies do adopcji';
    const title = `${dogNameForTitle} - Z Piekła do Domu`;
    
    // Construct the page URL (ensure it matches the request URL)
    const pageUrl = url.href;
    
    // Escape values for HTML
    const escapedTitle = escapeHtml(title);
    const escapedDescription = escapeHtml(description);
    const escapedImageUrl = escapeHtml(fullImageUrl);
    const escapedPageUrl = escapeHtml(pageUrl);
    
    // Replace meta tags in the HTML - handle both with and without id attributes
    html = html.replace(
      /<meta\s+property="og:title"[^>]*>/i,
      `<meta property="og:title" content="${escapedTitle}">`
    );
    
    html = html.replace(
      /<meta\s+property="og:description"[^>]*>/i,
      `<meta property="og:description" content="${escapedDescription}">`
    );
    
    html = html.replace(
      /<meta\s+property="og:image"[^>]*>/i,
      `<meta property="og:image" content="${escapedImageUrl}">`
    );
    
    // Update image dimensions - Facebook prefers 1200x630 for large image cards
    // This tells Facebook to use the large image layout (big photo at top)
    html = html.replace(
      /<meta\s+property="og:image:width"[^>]*>/i,
      `<meta property="og:image:width" content="1200">`
    );
    
    html = html.replace(
      /<meta\s+property="og:image:height"[^>]*>/i,
      `<meta property="og:image:height" content="630">`
    );
    
    html = html.replace(
      /<meta\s+property="og:url"[^>]*>/i,
      `<meta property="og:url" content="${escapedPageUrl}">`
    );
    
    html = html.replace(
      /<meta\s+name="twitter:title"[^>]*>/i,
      `<meta name="twitter:title" content="${escapedTitle}">`
    );
    
    html = html.replace(
      /<meta\s+name="twitter:description"[^>]*>/i,
      `<meta name="twitter:description" content="${escapedDescription}">`
    );
    
    html = html.replace(
      /<meta\s+name="twitter:image"[^>]*>/i,
      `<meta name="twitter:image" content="${escapedImageUrl}">`
    );
    
    html = html.replace(
      /<meta\s+name="twitter:url"[^>]*>/i,
      `<meta name="twitter:url" content="${escapedPageUrl}">`
    );
    
    html = html.replace(
      /<title>[^<]*<\/title>/i,
      `<title>${escapedTitle}</title>`
    );
    
    console.log(`[Middleware] Successfully modified HTML for: ${dogData.name}`);
    
    // Return modified HTML response
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error('[Middleware] Error:', error);
    // On error, return nothing (let normal request proceed)
    return;
  }
}

export const config = {
  matcher: ['/dog-page', '/dog-page.html'],
};

