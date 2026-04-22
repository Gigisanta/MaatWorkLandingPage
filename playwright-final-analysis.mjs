import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000); // Wait for animations

// Check navigation links
const navLinks = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('nav a'));
  return links.map(l => ({
    href: l.getAttribute('href'),
    text: l.textContent?.trim()
  }));
});

console.log('=== NAV LINKS ===');
navLinks.forEach(l => console.log(JSON.stringify(l)));

// Check if href targets exist
const missingIds = await page.evaluate(() => {
  const navLinks = Array.from(document.querySelectorAll('nav a'));
  const missing = [];
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const id = href.substring(1);
      const target = document.getElementById(id);
      if (!target) {
        missing.push(id);
      }
    }
  });
  
  return missing;
});

console.log('\n=== MISSING SECTION IDs (BUG!) ===');
if (missingIds.length > 0) {
  missingIds.forEach(id => console.log('Missing: #' + id));
} else {
  console.log('All nav targets exist');
}

// Check all element IDs on page
const allIds = await page.evaluate(() => {
  const ids = [];
  document.querySelectorAll('[id]').forEach(el => {
    ids.push(el.id);
  });
  return ids;
});

console.log('\n=== ALL IDS ON PAGE ===');
allIds.forEach(id => console.log(' -', id));

// Check H1 inner text
const h1FullText = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  return h1?.innerText || h1?.textContent;
});

console.log('\n=== H1 INNER TEXT ===');
console.log(h1FullText);

// Check if there are br tags in H1
const h1SpacingIssue = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  if (!h1) return null;
  
  const html = h1.innerHTML;
  return {
    hasBrTags: html.includes('<br>'),
    htmlLength: html.length
  };
});

console.log('\n=== H1 SPACING CHECK ===');
console.log(JSON.stringify(h1SpacingIssue));

// Check expected sections
const expectedSections = ['features', 'pricing', 'how-it-works', 'testimonials', 'faq', 'contact'];
const existingSections = await page.evaluate(() => {
  const ids = [];
  document.querySelectorAll('[id]').forEach(el => {
    ids.push(el.id);
  });
  return ids;
});

console.log('\n=== EXPECTED VS EXISTING SECTIONS ===');
console.log('Expected IDs:', expectedSections);
console.log('Existing IDs:', existingSections);

const missingSections = expectedSections.filter(s => !existingSections.includes(s));
console.log('Missing sections:', missingSections);

// Console errors
console.log('\n=== CONSOLE ERRORS ===');
if (consoleErrors.length > 0) {
  consoleErrors.forEach(e => console.log('ERROR:', e));
} else {
  console.log('No console errors');
}

await browser.close();
