import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

// Check specific problematic elements
const h1Text = await page.locator('h1').first().textContent();
console.log('=== H1 TEXT ===');
console.log('H1 text content:', h1Text);
console.log('H1 innerHTML:', await page.locator('h1').first().innerHTML());

// Check for visual issues - take screenshot info
const heroSection = await page.locator('section').first();
const heroBox = await heroSection.boundingBox();
console.log('\n=== HERO SECTION ===');
console.log('Hero bounding box:', heroBox);

// Get all visible text content to understand the layout
const visibleText = await page.evaluate(() => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const whitespace = /^\s*$/;
        if (whitespace.test(node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent?.trim();
    if (text && text.length > 2 && text.length < 200) {
      textNodes.push(text);
    }
  }
  return textNodes.slice(0, 100);
});

console.log('\n=== VISIBLE TEXT CONTENT (first 50) ===');
visibleText.slice(0, 50).forEach(t => console.log(' -', t));

// Check for CSS issues - colors and fonts
const cssIssues = await page.evaluate(() => {
  const issues = [];
  
  // Check all text elements for potential contrast
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li');
  textElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const bgColor = getComputedStyle(el.parentElement).backgroundColor;
    // Simple check - would need proper contrast calc
    if (color === 'rgb(255, 255, 255)' || color === '#ffffff') {
      // White text
      const parentBg = window.getComputedStyle(el.parentElement).backgroundColor;
      if (parentBg === 'rgb(0, 0, 0)' || parentBg === 'rgba(0, 0, 0, 1)') {
        // White on black - good
      } else if (parentBg.includes('rgba')) {
        // May have transparency issues
      }
    }
  });
  
  return issues;
});

// Check all sections with their bounding boxes
const sectionsInfo = await page.evaluate(() => {
  const sections = document.querySelectorAll('section');
  return Array.from(sections).map((s, i) => {
    const rect = s.getBoundingClientRect();
    return {
      index: i,
      id: s.id || 'no-id',
      class: s.className.substring(0, 50),
      visible: rect.height > 0 && rect.width > 0,
      top: rect.top,
      height: rect.height
    };
  });
});

console.log('\n=== SECTIONS INFO ===');
sectionsInfo.forEach(s => console.log(JSON.stringify(s)));

// Check for z-index issues with fixed elements
const fixedElements = await page.evaluate(() => {
  const fixed = [];
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed' || style.position === 'sticky') {
      const rect = el.getBoundingClientRect();
      fixed.push({
        tag: el.tagName,
        id: el.id || 'no-id',
        class: el.className.substring(0, 30),
        position: style.position,
        zIndex: style.zIndex,
        top: style.top,
        visible: rect.height > 0,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      });
    }
  });
  return fixed;
});

console.log('\n=== FIXED ELEMENTS ===');
fixedElements.forEach(el => console.log(JSON.stringify(el)));

await browser.close();
