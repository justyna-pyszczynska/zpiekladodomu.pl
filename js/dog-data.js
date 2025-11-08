// Dog Data System
// This file handles dynamic loading of dog data from .md files

const dogData = {};

// Function to parse front matter from markdown
function parseFrontMatter(text) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = text.match(frontMatterRegex);
  
  if (!match) return {};
  
  const frontMatterText = match[1];
  const content = match[2];
  
  const data = {};
  const lines = frontMatterText.split('\n');
  
  let currentKey = null;
  let inList = false;
  let inMultilineString = false;
  let multilineValue = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // If we're in a multiline string (pipe syntax), read indented lines
    if (inMultilineString) {
      if (line.startsWith('  ') || line.startsWith('\t')) {
        // Indented line - part of multiline string
        multilineValue.push(trimmed);
        continue;
      } else if (trimmed === '') {
        // Empty line in multiline - preserve as paragraph break
        multilineValue.push('');
        continue;
      } else {
        // Non-indented line - end of multiline string
        data[currentKey] = multilineValue.join('\n').trim();
        multilineValue = [];
        inMultilineString = false;
        // Don't skip this line, process it below
      }
    }
    
    if (trimmed === '') continue;
    
    if (trimmed.startsWith('-') && currentKey) {
      // This is a list item
      const listItem = trimmed.substring(1).trim().replace(/"/g, '');
      if (!Array.isArray(data[currentKey])) {
        // Convert existing value to array
        const previousValue = data[currentKey];
        data[currentKey] = [];
        if (previousValue && previousValue !== '') {
          // Split by newline if it was a multiline string
          const lines = previousValue.split('\n').map(l => l.trim()).filter(l => l);
          data[currentKey].push(...lines);
        }
      }
      data[currentKey].push(listItem);
      inList = true;
    } else {
      // This is a key-value pair
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        currentKey = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Check if value is pipe (multiline string)
        if (value === '|') {
          inMultilineString = true;
          multilineValue = [];
          inList = false;
          continue;
        }
        
        // Remove quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // If the value is empty and this is a known list field, initialize as array
        if (value === '' && (currentKey === 'special_features' || currentKey === 'images' || currentKey === 'video_urls')) {
          data[currentKey] = [];
        } else {
          data[currentKey] = value;
        }
        inList = false;
      }
    }
  }
  
  // Save any remaining multiline string
  if (inMultilineString && currentKey && multilineValue.length > 0) {
    data[currentKey] = multilineValue.join('\n').trim();
  }
  
  return data;
}

// Function to get dog data by name (loads from .md file)
async function getDogData(dogName) {
  if (dogData[dogName]) {
    return dogData[dogName];
  }
  
  try {
    console.log('Loading dog data for:', dogName);
    // Encode the dog name to handle spaces in filenames
    const encodedDogName = encodeURIComponent(dogName);
    const response = await fetch(`content/dogs/${encodedDogName}.md`);
    console.log('Fetch response:', response);
    if (!response.ok) {
      console.error('Dog file not found:', dogName, 'Status:', response.status);
      return null;
    }
    
    const text = await response.text();
    console.log('Loaded text:', text.substring(0, 200));
    const data = parseFrontMatter(text);
    console.log('Parsed data:', data);
    
    // Store in cache
    dogData[dogName] = data;
    return data;
  } catch (error) {
    console.error('Error loading dog data:', error);
    return null;
  }
}

// Function to load dog content into the page
async function loadDogContent(dogName) {
  const dog = await getDogData(dogName);
  if (!dog) {
    console.error('Dog not found:', dogName);
    return;
  }

  // Update page title
  document.title = `${dog.name} - Z Piekła do Domu`;

  // Update hero section
  const hero = document.querySelector('.hero');
  if (hero && dog.image) {
    hero.style.backgroundImage = `url('${dog.image}')`;
  }

  // Update hero title
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle && dog.name) {
    heroTitle.textContent = dog.name;
  }

  // Update main card content
  const cardContent = document.querySelector('.big-card .muted');
  if (cardContent && dog.description) {
    cardContent.textContent = dog.description;
  }

  // Update dog images array for navigation
  if (dog.images && Array.isArray(dog.images)) {
    window.dogImages = dog.images;
  } else if (dog.image) {
    window.dogImages = [dog.image];
  }
  window.currentDogIndex = 0;
}

// Function to get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Initialize dog content when page loads
document.addEventListener('DOMContentLoaded', async function() {
  const dogName = getUrlParameter('dog');
  if (dogName) {
    await loadDogContent(dogName);
  }
});










