import fs from 'fs';
import path from 'path';

// Function to parse front matter from markdown (same logic as dog-data.js)
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
        data[currentKey] = [];
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
  
  if (inMultilineString && currentKey && multilineValue.length > 0) {
    data[currentKey] = multilineValue.join('\n').trim();
  }
  
  return data;
}

// Function to strip markdown links from text
function stripMarkdownLinks(text) {
  if (!text) return '';
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

export default async function handler(req, res) {
  // Extract dog name from query parameters
  // Handle both req.query (Vercel) and URL parsing (fallback)
  let dogName = req.query?.dog;
  
  if (!dogName && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      dogName = url.searchParams.get('dog');
    } catch (error) {
      // If URL parsing fails, try manual parsing
      const match = req.url.match(/[?&]dog=([^&]*)/);
      if (match) {
        dogName = decodeURIComponent(match[1]);
      }
    }
  }
  
  // If no dog parameter, serve the regular HTML file
  if (!dogName) {
    try {
      const htmlPath = path.join(process.cwd(), 'dog-page.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (error) {
      console.error('Error reading dog-page.html:', error);
      return res.status(500).send('Error loading page');
    }
  }
  
  try {
    // Read the dog-page.html file
    const htmlPath = path.join(process.cwd(), 'dog-page.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Read the dog data from markdown file
    // Try both encoded and non-encoded versions of the dog name
    const encodedDogName = encodeURIComponent(dogName);
    let dogData = null;
    
    // Try encoded filename first (handles spaces and special characters)
    let dogFilePath = path.join(process.cwd(), 'content', 'dogs', `${encodedDogName}.md`);
    try {
      const dogFileContent = fs.readFileSync(dogFilePath, 'utf8');
      dogData = parseFrontMatter(dogFileContent);
    } catch (error) {
      // Try non-encoded filename as fallback
      try {
        dogFilePath = path.join(process.cwd(), 'content', 'dogs', `${dogName}.md`);
        const dogFileContent = fs.readFileSync(dogFilePath, 'utf8');
        dogData = parseFrontMatter(dogFileContent);
      } catch (fallbackError) {
        console.error(`Error reading dog file for ${dogName}:`, error);
        // Continue with default meta tags if dog file not found
      }
    }
    
    // If we have dog data, inject the meta tags
    if (dogData && dogData.name) {
      const dogUrl = `https://zpiekladodomu.pl/dog-page?dog=${encodeURIComponent(dogName)}`;
      const dogImage = dogData.image 
        ? `https://zpiekladodomu.pl/${dogData.image}` 
        : 'https://zpiekladodomu.pl/images/adopcje-main.jpg';
      const dogTitle = `${dogData.name} - Z Piekła do Domu`;
      const rawDescription = dogData.description && dogData.description.trim()
        ? dogData.description
        : `Poznaj ${dogData.name} i pomóż mu/jej znaleźć kochający dom.`;
      // Facebook has a 200 character limit for descriptions, so truncate if needed
      let dogDescription = stripMarkdownLinks(rawDescription);
      if (dogDescription.length > 200) {
        dogDescription = dogDescription.substring(0, 197) + '...';
      }
      
      // Replace meta tags in HTML
      html = html.replace(
        /<meta property="og:url" content="[^"]*" id="og-url">/,
        `<meta property="og:url" content="${dogUrl}" id="og-url">`
      );
      html = html.replace(
        /<meta property="og:title" content="[^"]*" id="og-title">/,
        `<meta property="og:title" content="${dogTitle.replace(/"/g, '&quot;')}" id="og-title">`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]*" id="og-description">/,
        `<meta property="og:description" content="${dogDescription.replace(/"/g, '&quot;')}" id="og-description">`
      );
      html = html.replace(
        /<meta property="og:image" content="[^"]*" id="og-image">/,
        `<meta property="og:image" content="${dogImage}" id="og-image">`
      );
      
      // Replace Twitter Card tags
      html = html.replace(
        /<meta name="twitter:url" content="[^"]*" id="twitter-url">/,
        `<meta name="twitter:url" content="${dogUrl}" id="twitter-url">`
      );
      html = html.replace(
        /<meta name="twitter:title" content="[^"]*" id="twitter-title">/,
        `<meta name="twitter:title" content="${dogTitle.replace(/"/g, '&quot;')}" id="twitter-title">`
      );
      html = html.replace(
        /<meta name="twitter:description" content="[^"]*" id="twitter-description">/,
        `<meta name="twitter:description" content="${dogDescription.replace(/"/g, '&quot;')}" id="twitter-description">`
      );
      html = html.replace(
        /<meta name="twitter:image" content="[^"]*" id="twitter-image">/,
        `<meta name="twitter:image" content="${dogImage}" id="twitter-image">`
      );
      
      // Replace page title
      html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${dogTitle}</title>`
      );
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error processing dog page:', error);
    // Fallback to regular HTML
    try {
      const htmlPath = path.join(process.cwd(), 'dog-page.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    } catch (fallbackError) {
      return res.status(500).send('Error loading page');
    }
  }
}









