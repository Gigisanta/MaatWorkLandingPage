import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleMessages = [];
page.on('console', msg => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

console.log('=== PAGE DOM CHECK ===\n');

// Check for h1
const h1Count = await page.locator('h1').count();
console.log('H1 count:', h1Count);

// Check for nav
const navCount = await page.locator('nav').count();
console.log('Nav count:', navCount);

// Get h1 content if exists
if (h1Count > 0) {
  const h1Text = await page.locator('h1').first().textContent();
  console.log('H1 text:', h1Text?.substring(0, 50));
}

// Get nav links
const navLinks = await page.locator('nav a').count();
console.log('Nav links:', navLinks);

// Check main content
const mainCount = await page.locator('main').count();
console.log('Main count:', mainCount);

// Console messages
console.log('\n=== CONSOLE ERRORS (first 5) ===');
const errors = consoleMessages.filter(m => m.type === 'error').slice(0, 5);
errors.forEach(e => console.log(e.text.substring(0, 150)));

await browser.close();
