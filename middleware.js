// Vercel Edge Middleware for dynamic Open Graph meta tags

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
  
  // Only handle dog-page.html requests with dog parameter
  if (url.pathname !== '/dog-page.html' || !url.searchParams.has('dog')) {
    return;
  }
  
  const dogName = url.searchParams.get('dog');
  
  try {
    // Fetch the dog markdown file
    const baseUrl = `${url.protocol}//${url.host}`;
    const dogFileUrl = `${baseUrl}/content/dogs/${dogName}.md`;
    const dogResponse = await fetch(dogFileUrl);
    
    if (!dogResponse.ok) {
      // If dog file not found, return normal response
      return;
    }
    
    const markdownText = await dogResponse.text();
    const dogData = parseFrontMatter(markdownText);
    
    if (!dogData || !dogData.name) {
      return;
    }
    
    // Fetch the original HTML page
    const htmlUrl = `${baseUrl}/dog-page.html`;
    const htmlResponse = await fetch(htmlUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Vercel-Edge-Middleware',
      },
    });
    
    if (!htmlResponse.ok) {
      return;
    }
    
    let html = await htmlResponse.text();
    
    // Get the dog image - use main image or first image from images array
    const dogImage = dogData.image || (Array.isArray(dogData.images) && dogData.images.length > 0 ? dogData.images[0] : 'images/adopcje-main.jpg');
    const fullImageUrl = dogImage.startsWith('http') 
      ? dogImage 
      : `${baseUrl}/${dogImage}`;
    
    // Get description - clean it up
    let description = (dogData.description || 'Poznaj naszych podopiecznych i pomóż im znaleźć kochający dom.')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit description length
    
    // Get the title
    const title = `${dogData.name} - Z Piekła do Domu`;
    
    // Escape values for HTML
    const escapedTitle = escapeHtml(title);
    const escapedDescription = escapeHtml(description);
    const escapedImageUrl = escapeHtml(fullImageUrl);
    const escapedPageUrl = escapeHtml(url.href);
    
    // Replace meta tags in the HTML using regex
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
    
    // Return modified HTML response
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    
  } catch (error) {
    console.error('Error in middleware:', error);
    // On error, return nothing (let normal request proceed)
    return;
  }
}

export const config = {
  matcher: ['/dog-page.html'],
};
