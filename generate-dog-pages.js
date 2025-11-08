const fs = require('fs');
const path = require('path');

console.log('🐕 Generating individual dog pages...');

// Read manifest
const manifestPath = './content/dogs/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const dogFiles = manifest.dogs;

// Read template
const templatePath = './dog-page.html';
const template = fs.readFileSync(templatePath, 'utf-8');

// Create dogs directory if it doesn't exist
if (!fs.existsSync('./dogs')) {
  fs.mkdirSync('./dogs');
}

let successCount = 0;
let errorCount = 0;

dogFiles.forEach(dogFile => {
  try {
    const dogName = dogFile.replace('.md', '');
    const mdPath = `./content/dogs/${dogFile}`;
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    
    // Parse front matter
    const imageMatch = mdContent.match(/image:\s*["']?([^"'\n]+)["']?/);
    const nameMatch = mdContent.match(/name:\s*["']?([^"'\n]+)["']?/);
    const descMatch = mdContent.match(/description:\s*["']?([^"'\n]+)["']?/);
    
    const dogImage = imageMatch ? imageMatch[1] : 'images/adopcje-main.jpg';
    const dogDisplayName = nameMatch ? nameMatch[1] : dogName;
    const dogDesc = (descMatch ? descMatch[1] : `Poznaj ${dogDisplayName} i pomóż mu/jej znaleźć kochający dom.`).replace(/"/g, '&quot;');
    
    // Replace meta tags in template
    let html = template;
    
    // Replace OG tags
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
      `<meta property="og:url" content="https://zpiekladodomu.pl/dogs/${dogName}.html" id="og-url">`
    );
    
    // Replace Twitter tags
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
      `<meta name="twitter:url" content="https://zpiekladodomu.pl/dogs/${dogName}.html" id="twitter-url">`
    );
    
    // Replace title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${dogDisplayName} - Pies do adopcji - Z Piekła do Domu</title>`
    );
    
    // Add a query parameter to the script to load the correct dog
    html = html.replace(
      /const urlParams = new URLSearchParams\(window\.location\.search\);/,
      `const urlParams = new URLSearchParams('?dog=${dogName}');`
    );
    
    // Write the file
    const outputPath = `./dogs/${dogName}.html`;
    fs.writeFileSync(outputPath, html);
    successCount++;
    
  } catch (error) {
    console.error(`❌ Error processing ${dogFile}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Successfully generated ${successCount} dog pages!`);
if (errorCount > 0) {
  console.log(`❌ Failed to generate ${errorCount} pages.`);
}
console.log(`📁 Pages created in ./dogs/ directory`);
console.log(`\n🔗 Example URL: https://zpiekladodomu.pl/dogs/patka.html`);

