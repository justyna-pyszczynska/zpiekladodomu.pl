import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { initiative } = req.query;
  
  if (!initiative) {
    return res.redirect(302, '/inicjatywa.html');
  }
  
  try {
    // Read the initiative's .md file
    const mdPath = path.join(process.cwd(), 'content', 'initiatives', `${initiative}.md`);
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    
    // Parse front matter
    const imageMatch = mdContent.match(/image:\s*["']?([^"'\n]+)["']?/);
    const titleMatch = mdContent.match(/title:\s*["']?([^"'\n]+)["']?/);
    const descMatch = mdContent.match(/description:\s*["']?([^"'\n]+)["']?/);
    
    const initImage = imageMatch ? imageMatch[1] : 'images/inicjatywy.jpg';
    const initTitle = titleMatch ? titleMatch[1] : 'Inicjatywa';
    const initDesc = descMatch ? descMatch[1] : 'Poznaj naszą inicjatywę na rzecz zwierząt z Turcji.';
    
    // Read the base inicjatywa.html template
    const templatePath = path.join(process.cwd(), 'inicjatywa.html');
    let html = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace Open Graph meta tags
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
    html = html.replace(
      /<meta property="og:url" content="[^"]*" id="og-url">/,
      `<meta property="og:url" content="https://zpiekladodomu.pl/inicjatywa?initiative=${encodeURIComponent(initiative)}" id="og-url">`
    );
    
    // Replace Twitter Card meta tags
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
    html = html.replace(
      /<meta name="twitter:url" content="[^"]*" id="twitter-url">/,
      `<meta name="twitter:url" content="https://zpiekladodomu.pl/inicjatywa?initiative=${encodeURIComponent(initiative)}" id="twitter-url">`
    );
    
    // Update page title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${initTitle} - Z Piekła do Domu</title>`
    );
    
    // Return modified HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Fallback to regular page
    res.redirect(302, `/inicjatywa.html?initiative=${initiative}`);
  }
}

