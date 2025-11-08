import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { dog } = req.query;
  
  if (!dog) {
    return res.redirect(302, '/dog-page.html');
  }
  
  try {
    // Read the dog's .md file
    const mdPath = path.join(process.cwd(), 'content', 'dogs', `${dog}.md`);
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    
    // Parse front matter
    const imageMatch = mdContent.match(/image:\s*["']?([^"'\n]+)["']?/);
    const nameMatch = mdContent.match(/name:\s*["']?([^"'\n]+)["']?/);
    const descMatch = mdContent.match(/description:\s*["']?([^"'\n]+)["']?/);
    
    const dogImage = imageMatch ? imageMatch[1] : 'images/adopcje-main.jpg';
    const dogDisplayName = nameMatch ? nameMatch[1] : dog;
    const dogDesc = descMatch ? descMatch[1] : `Poznaj ${dogDisplayName} i pomóż mu/jej znaleźć kochający dom.`;
    
    // Read the base dog-page.html template
    const templatePath = path.join(process.cwd(), 'dog-page.html');
    let html = fs.readFileSync(templatePath, 'utf-8');
    
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
      `<meta property="og:url" content="https://zpiekladodomu.pl/dog-page?dog=${encodeURIComponent(dog)}" id="og-url">`
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
      `<meta name="twitter:url" content="https://zpiekladodomu.pl/dog-page?dog=${encodeURIComponent(dog)}" id="twitter-url">`
    );
    
    // Update page title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${dogDisplayName} - Pies do adopcji - Z Piekła do Domu</title>`
    );
    
    // Return modified HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error:', error);
    // Fallback to regular page
    res.redirect(302, `/dog-page.html?dog=${dog}`);
  }
}

