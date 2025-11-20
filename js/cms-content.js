// CMS Content Loader
// This script loads content from the CMS and populates the HTML

document.addEventListener('DOMContentLoaded', function() {
    // Load about page content
    loadAboutContent();
});

async function loadAboutContent() {
    try {
        // Fetch the about page content
        const response = await fetch('/content/pages/about.md');
        if (!response.ok) {
            console.log('About content not found, using default values');
            return;
        }
        
        const text = await response.text();
        const frontMatter = parseFrontMatter(text);
        
        // Update main card content
        updateMainCard(frontMatter);
        
        // Update map section content
        updateMapSection(frontMatter);
        
    } catch (error) {
        console.log('Error loading about content:', error);
    }
}

function parseFrontMatter(text) {
    // Simple front matter parser
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontMatterRegex);
    
    if (!match) return {};
    
    const frontMatterText = match[1];
    const content = match[2];
    
    const data = {};
    const lines = frontMatterText.split('\n');
    
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            data[key] = value;
        }
    }
    
    return data;
}

// Convert Markdown bold syntax (**text**) to HTML (<strong>text</strong>)
function convertMarkdownBold(text) {
    if (!text) return '';
    // Escape any existing HTML tags to prevent XSS, then convert **text** to <strong>text</strong>
    // First, escape HTML
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    // Then convert **text** to <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
}

function updateMainCard(data) {
    // Update main card title
    const mainCardTitle = document.getElementById('main-card-title');
    if (mainCardTitle && data.main_card_title) {
        mainCardTitle.textContent = data.main_card_title;
    }
    
    // Update main card content (with Markdown bold conversion)
    const mainCardContent = document.getElementById('main-card-content');
    if (mainCardContent && data.main_card_content) {
        mainCardContent.innerHTML = convertMarkdownBold(data.main_card_content);
    }
    
    // Update button text and link
    const button = document.getElementById('main-card-button');
    if (button) {
        if (data.button_text) {
            button.textContent = data.button_text + ' ↗';
        }
        if (data.button_link) {
            button.setAttribute('href', data.button_link);
        }
    }
}

function updateMapSection(data) {
    // Update map section title
    const mapTitle = document.getElementById('map-title');
    if (mapTitle && data.map_title) {
        mapTitle.textContent = data.map_title;
    }
    
    // Update map panel title
    const mapPanelTitle = document.getElementById('map-panel-title');
    if (mapPanelTitle && data.map_panel_title) {
        mapPanelTitle.textContent = data.map_panel_title;
    }
    
    // Update map panel description
    const mapPanelDesc = document.getElementById('map-panel-description');
    if (mapPanelDesc && data.map_panel_description) {
        mapPanelDesc.textContent = data.map_panel_description;
    }
    
    // Update statistics
    const stat1Number = document.getElementById('stat1-number');
    if (stat1Number && data.stat1_number) {
        stat1Number.textContent = data.stat1_number;
    }
    
    const stat1Label = document.getElementById('stat1-label');
    if (stat1Label && data.stat1_label) {
        stat1Label.textContent = data.stat1_label;
    }
    
    const stat2Number = document.getElementById('stat2-number');
    if (stat2Number && data.stat2_number) {
        stat2Number.textContent = data.stat2_number;
    }
    
    const stat2Label = document.getElementById('stat2-label');
    if (stat2Label && data.stat2_label) {
        stat2Label.textContent = data.stat2_label;
    }
}
