import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Capture all console messages
const consoleMessages = [];
page.on('console', msg => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

// Navigate and wait for full load
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000); // Wait for React to hydrate

// Get page title
const title = await page.title();
console.log('=== PAGE INFO ===');
console.log('Title:', title);

// Check for horizontal overflow after full render
const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
const windowWidth = await page.evaluate(() => window.innerWidth);
console.log('\n=== OVERFLOW CHECK ===');
console.log('Body width:', bodyWidth, 'Window width:', windowWidth);
console.log('Horizontal overflow:', bodyWidth > windowWidth ? 'YES - BUG!' : 'NO');

// Get computed styles for body
const bodyStyles = await page.evaluate(() => {
  const body = document.body;
  const style = window.getComputedStyle(body);
  return {
    overflow: style.overflow,
    overflowX: style.overflowX,
    overflowY: style.overflowY,
    position: style.position,
    minHeight: style.minHeight
  };
});
console.log('Body styles:', bodyStyles);

// Check specific sections
const sections = await page.locator('section').count();
console.log('\nSections found:', sections);

// Check nav
const navCount = await page.locator('nav').count();
console.log('Nav found:', navCount);

// Get all buttons with details
const buttons = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('button')).map(btn => ({
    text: btn.textContent?.trim().substring(0, 50),
    class: btn.className,
    disabled: btn.disabled,
    ariaLabel: btn.getAttribute('aria-label')
  }));
});
console.log('\n=== BUTTONS ===');
console.log(JSON.stringify(buttons, null, 2));

// Get all links with details
const links = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a')).map(link => ({
    href: link.href,
    text: link.textContent?.trim().substring(0, 50),
    class: link.className?.substring(0, 50)
  }));
});
console.log('\n=== LINKS ===');
console.log(JSON.stringify(links, null, 2));

// Get headings hierarchy
const headings = await page.evaluate(() => {
  const hs = [];
  for (let i = 1; i <= 6; i++) {
    const elements = document.querySelectorAll('h' + i);
    elements.forEach(h => {
      hs.push({
        level: i,
        text: h.textContent?.trim().substring(0, 80),
        id: h.id || null
      });
    });
  }
  return hs;
});
console.log('\n=== HEADINGS ===');
console.log(JSON.stringify(headings, null, 2));

// Check for images without alt
const imagesWithoutAlt = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img')).filter(img => !img.alt);
  return imgs.map(img => ({
    src: img.src?.substring(0, 100),
    class: img.className
  }));
});
console.log('\n=== IMAGES WITHOUT ALT ===');
console.log(JSON.stringify(imagesWithoutAlt, null, 2));

// Console errors
console.log('\n=== CONSOLE ERRORS ===');
consoleMessages.filter(m => m.type === 'error').forEach(m => console.log('ERROR:', m.text));
if (consoleMessages.filter(m => m.type === 'error').length === 0) {
  console.log('No console errors');
}

await browser.close();
console.log('\n=== ANALYSIS COMPLETE ===');
