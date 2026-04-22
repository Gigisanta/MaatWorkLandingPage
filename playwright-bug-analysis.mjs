import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Track console errors
const consoleErrors = [];
const consoleWarnings = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
  if (msg.type() === 'warning') consoleWarnings.push(msg.text());
});

// Track page errors
page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Wait for typing animation to complete
await page.waitForTimeout(3000);

// Now check H1
const h1Text = await page.locator('h1').first().textContent();
console.log('=== H1 AFTER ANIMATION ===');
console.log('H1 text:', h1Text);

// Check accessibility - full audit
const accessibilityIssues = await page.evaluate(() => {
  const issues = [];
  
  // Check heading hierarchy
  const h1s = document.querySelectorAll('h1');
  const h2s = document.querySelectorAll('h2');
  const h3s = document.querySelectorAll('h3');
  
  if (h1s.length === 0) issues.push('No h1 found');
  if (h1s.length > 1) issues.push(`Multiple h1 found: ${h1s.length}`);
  if (h2s.length === 0) issues.push('No h2 found (good for SEO)');
  
  // Check for images without alt
  const imgsWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imgsWithoutAlt.length > 0) {
    issues.push(`Images without alt: ${imgsWithoutAlt.length}`);
  }
  
  // Check for buttons without accessible name
  const buttonsWithoutName = Array.from(document.querySelectorAll('button')).filter(btn => {
    return !btn.getAttribute('aria-label') && !btn.textContent?.trim();
  });
  if (buttonsWithoutName.length > 0) {
    issues.push(`Buttons without accessible name: ${buttonsWithoutName.length}`);
  }
  
  // Check for links without text
  const linksWithoutText = Array.from(document.querySelectorAll('a')).filter(link => {
    return !link.getAttribute('aria-label') && !link.textContent?.trim() && !link.querySelector('img');
  });
  if (linksWithoutText.length > 0) {
    issues.push(`Links without text: ${linksWithoutText.length}`);
  }
  
  // Check for main landmark
  const mainLandmark = document.querySelector('main');
  if (!mainLandmark) issues.push('No main landmark');
  
  // Check for skip link
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (!skipLink) issues.push('No skip link');
  
  // Check for nav landmark
  const navLandmark = document.querySelector('nav');
  if (!navLandmark) issues.push('No nav landmark');
  
  return issues;
});

console.log('\n=== ACCESSIBILITY ISSUES ===');
if (accessibilityIssues.length > 0) {
  accessibilityIssues.forEach(i => console.log(' -', i));
} else {
  console.log('No accessibility issues found');
}

// Check visual issues - viewport at different sizes
const viewports = [
  { width: 320, height: 568, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
];

console.log('\n=== RESPONSIVE OVERFLOW CHECK ===');
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(500);
  
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const windowWidth = await page.evaluate(() => window.innerWidth);
  const hasOverflow = bodyWidth > windowWidth;
  
  console.log(`${vp.name} (${vp.width}x${vp.height}): overflow=${hasOverflow ? 'YES - BUG!' : 'NO'}`);
}

// Reset to desktop
await page.setViewportSize({ width: 1440, height: 900 });

// Check for horizontal scrollbar appearing
const hasHorizontalScroll = await page.evaluate(() => {
  return document.documentElement.scrollWidth > document.documentElement.clientWidth;
});
console.log('Desktop horizontal scroll:', hasHorizontalScroll ? 'YES' : 'NO');

// Check all sections with IDs
const sectionsWithIds = await page.evaluate(() => {
  const sections = document.querySelectorAll('section');
  return Array.from(sections).map(s => ({
    id: s.id || 'no-id',
    class: s.className.substring(0, 60),
    ariaLabel: s.getAttribute('aria-label'),
    visible: s.getBoundingClientRect().height > 0
  }));
});

console.log('\n=== SECTIONS WITH IDS ===');
sectionsWithIds.forEach(s => console.log(JSON.stringify(s)));

// Check what scrollable elements exist
const scrollableElements = await page.evaluate(() => {
  const scrollable = [];
  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.overflow !== 'visible' && style.overflow !== 'hidden' && 
        (style.overflowX === 'auto' || style.overflowY === 'auto' || 
         style.overflowX === 'scroll' || style.overflowY === 'scroll')) {
      scrollable.push({
        tag: el.tagName,
        class: el.className.substring(0, 40),
        overflow: style.overflow
      });
    }
  });
  return scrollable.slice(0, 10);
});

console.log('\n=== SCROLLABLE ELEMENTS ===');
scrollableElements.forEach(s => console.log(JSON.stringify(s)));

// Check for any overflow:hidden issues on body
const bodyOverflow = await page.evaluate(() => {
  const body = document.body;
  const html = document.documentElement;
  const bodyStyle = window.getComputedStyle(body);
  const htmlStyle = window.getComputedStyle(html);
  return {
    bodyOverflow: bodyStyle.overflow,
    htmlOverflow: htmlStyle.overflow,
    bodyScrollWidth: body.scrollWidth,
    htmlScrollWidth: html.scrollWidth
  };
});

console.log('\n=== OVERFLOW STYLES ===');
console.log(JSON.stringify(bodyOverflow, null, 2));

// Console errors summary
console.log('\n=== CONSOLE ERRORS ===');
if (consoleErrors.length > 0) {
  consoleErrors.forEach(e => console.log('ERROR:', e));
} else {
  console.log('No console errors');
}

await browser.close();
