import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Capture console errors
const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') {
    consoleErrors.push(msg.text());
  }
});

// Navigate to the page
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

// Get page title
const title = await page.title();
console.log('=== PAGE INFO ===');
console.log('Title:', title);

// Check for horizontal overflow
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
const windowWidth = await page.evaluate(() => window.innerWidth);
console.log('Body width:', bodyWidth, 'Window width:', windowWidth);
console.log('Horizontal overflow:', bodyWidth > windowWidth ? 'YES' : 'NO');

// Get element counts
const btnCount = await page.locator('button').count();
const linkCount = await page.locator('a').count();
const inputCount = await page.locator('input').count();
console.log('Buttons:', btnCount);
console.log('Links:', linkCount);
console.log('Inputs:', inputCount);

// Check images without alt
const imagesWithoutAlt = await page.locator('img').evaluateAll(imgs => 
  imgs.filter(img => !img.alt).map(img => img.src || img.className)
);
console.log('\nImages without alt:', imagesWithoutAlt.length);
if (imagesWithoutAlt.length > 0) {
  imagesWithoutAlt.forEach(src => console.log('  -', src.substring(0, 100)));
}

// Get headings
const headings = await page.locator('h1, h2, h3').evaluateAll(els => 
  els.map(el => el.tagName + ': ' + el.textContent?.trim().substring(0, 80))
);
console.log('\n=== HEADINGS ===');
headings.forEach(h => console.log(' ', h));

// Check fixed/sticky elements
const fixedElements = await page.evaluate(() => {
  const fixed = [];
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed' || style.position === 'sticky') {
      fixed.push(el.tagName + (el.id ? '#' + el.id : '') + ' - ' + style.position);
    }
  });
  return fixed;
});
console.log('\nFixed/Sticky elements:', fixedElements.length);
fixedElements.forEach(el => console.log('  -', el));

// Console errors
console.log('\n=== CONSOLE ERRORS ===');
if (consoleErrors.length > 0) {
  consoleErrors.forEach(err => console.log('ERROR:', err));
} else {
  console.log('No console errors');
}

// Get main sections
const sections = await page.locator('section').evaluateAll(els => 
  els.map(el => el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ')[0] : ''))
);
console.log('\n=== SECTIONS ===');
sections.forEach(s => console.log(' ', s));

await browser.close();
console.log('\n=== ANALYSIS COMPLETE ===');
