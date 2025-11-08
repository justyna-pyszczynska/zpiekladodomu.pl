export async function middleware(request) {
  const url = new URL(request.url);
  
  // Skip middleware for internal requests to avoid infinite loops
  if (request.headers.get('x-middleware-prefetch')) {
    return;
  }
  
  // Handle dog-page.html requests
  if (url.pathname === '/dog-page.html') {
    const dogName = url.searchParams.get('dog');
    
    if (dogName) {
      try {
        // Fetch the dog's .md file
        const mdUrl = `${url.origin}/content/dogs/${dogName}.md`;
        const mdResponse = await fetch(mdUrl);
        
        if (mdResponse.ok) {
          const mdContent = await mdResponse.text();
          
          // Parse front matter to get image, name, and description
          const imageMatch = mdContent.match(/image:\s*["']?([^"'\n]+)["']?/);
          const nameMatch = mdContent.match(/name:\s*["']?([^"'\n]+)["']?/);
          const descMatch = mdContent.match(/description:\s*["']?([^"'\n]+)["']?/);
          
          const dogImage = imageMatch ? imageMatch[1] : 'images/adopcje-main.jpg';
          const dogDisplayName = nameMatch ? nameMatch[1] : dogName;
          const dogDesc = descMatch ? descMatch[1] : `Poznaj ${dogDisplayName} i pomóż mu/jej znaleźć kochający dom.`;
          
          // Create a new URL without query params to fetch the base HTML
          const baseUrl = new URL(url.origin + '/dog-page.html');
          const htmlResponse = await fetch(baseUrl, {
            headers: {
              'x-middleware-prefetch': '1'
            }
          });
          let html = await htmlResponse.text();
          
          // Replace Open Graph meta tags
          html = html.replace(
            /<meta property="og:image" content="[^"]*" id="og-image">/,
            `<meta property="og:image" content="https://zpiekladodomu.pl/${dogImage}" id="og-image">`
          );
          html = html.replace(
            /<meta property="og:title" content="[^"]*" id="og-title">/,
            `<meta property="og:title" content="${dogDisplayName} - Pies do adopcji" id="og-title">`
          );
          html = html.replace(
            /<meta property="og:description" content="[^"]*" id="og-description">/,
            `<meta property="og:description" content="${dogDesc}" id="og-description">`
          );
          html = html.replace(
            /<meta property="og:url" content="[^"]*" id="og-url">/,
            `<meta property="og:url" content="https://zpiekladodomu.pl/dog-page.html?dog=${encodeURIComponent(dogName)}" id="og-url">`
          );
          
          // Replace Twitter Card meta tags
          html = html.replace(
            /<meta name="twitter:image" content="[^"]*" id="twitter-image">/,
            `<meta name="twitter:image" content="https://zpiekladodomu.pl/${dogImage}" id="twitter-image">`
          );
          html = html.replace(
            /<meta name="twitter:title" content="[^"]*" id="twitter-title">/,
            `<meta name="twitter:title" content="${dogDisplayName} - Pies do adopcji" id="twitter-title">`
          );
          html = html.replace(
            /<meta name="twitter:description" content="[^"]*" id="twitter-description">/,
            `<meta name="twitter:description" content="${dogDesc}" id="twitter-description">`
          );
          html = html.replace(
            /<meta name="twitter:url" content="[^"]*" id="twitter-url">/,
            `<meta name="twitter:url" content="https://zpiekladodomu.pl/dog-page.html?dog=${encodeURIComponent(dogName)}" id="twitter-url">`
          );
          
          // Update page title
          html = html.replace(
            /<title>[^<]*<\/title>/,
            `<title>${dogDisplayName} - Pies do adopcji - Z Piekła do Domu</title>`
          );
          
          // Return modified HTML
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
            },
          });
        }
      } catch (error) {
        console.error('Error in middleware:', error);
      }
    }
  }
  
  // Handle inicjatywa.html requests (for initiatives)
  if (url.pathname === '/inicjatywa.html') {
    const initiativeSlug = url.searchParams.get('initiative');
    
    if (initiativeSlug) {
      try {
        // Fetch the initiative's .md file
        const mdUrl = `${url.origin}/content/initiatives/${initiativeSlug}.md`;
        const mdResponse = await fetch(mdUrl);
        
        if (mdResponse.ok) {
          const mdContent = await mdResponse.text();
          
          // Parse front matter
          const imageMatch = mdContent.match(/image:\s*["']?([^"'\n]+)["']?/);
          const titleMatch = mdContent.match(/title:\s*["']?([^"'\n]+)["']?/);
          const descMatch = mdContent.match(/description:\s*["']?([^"'\n]+)["']?/);
          
          const initImage = imageMatch ? imageMatch[1] : 'images/inicjatywy.jpg';
          const initTitle = titleMatch ? titleMatch[1] : 'Inicjatywa';
          const initDesc = descMatch ? descMatch[1] : 'Poznaj naszą inicjatywę na rzecz zwierząt z Turcji.';
          
          // Fetch the original HTML
          const htmlResponse = await fetch(`${url.origin}/inicjatywa.html`, {
            headers: {
              'User-Agent': 'Vercel-Edge-Middleware'
            }
          });
          let html = await htmlResponse.text();
          
          // Replace meta tags
          html = html.replace(
            /<meta property="og:image" content="[^"]*" id="og-image">/,
            `<meta property="og:image" content="https://zpiekladodomu.pl/${initImage}" id="og-image">`
          );
          html = html.replace(
            /<meta property="og:title" content="[^"]*" id="og-title">/,
            `<meta property="og:title" content="${initTitle} - Z Piekła do Domu" id="og-title">`
          );
          html = html.replace(
            /<meta property="og:description" content="[^"]*" id="og-description">/,
            `<meta property="og:description" content="${initDesc}" id="og-description">`
          );
          
          // Twitter tags
          html = html.replace(
            /<meta name="twitter:image" content="[^"]*" id="twitter-image">/,
            `<meta name="twitter:image" content="https://zpiekladodomu.pl/${initImage}" id="twitter-image">`
          );
          html = html.replace(
            /<meta name="twitter:title" content="[^"]*" id="twitter-title">/,
            `<meta name="twitter:title" content="${initTitle} - Z Piekła do Domu" id="twitter-title">`
          );
          html = html.replace(
            /<meta name="twitter:description" content="[^"]*" id="twitter-description">/,
            `<meta name="twitter:description" content="${initDesc}" id="twitter-description">`
          );
          
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
            },
          });
        }
      } catch (error) {
        console.error('Error in middleware:', error);
      }
    }
  }
}

export const config = {
  matcher: ['/dog-page.html', '/inicjatywa.html'],
};

