import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000); // Wait for animations

console.log('=== FINAL VERIFICATION ===\n');

// Check navigation targets
const missingIds = await page.evaluate(() => {
  const navLinks = Array.from(document.querySelectorAll('nav a'));
  const missing = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const id = href.substring(1);
      if (!document.getElementById(id)) {
        missing.push(id);
      }
    }
  });
  return missing;
});

console.log('1. NAVIGATION IDS:');
if (missingIds.length === 0) {
  console.log('   PASS - All nav targets exist');
} else {
  console.log('   FAIL - Missing IDs:', missingIds);
}

// Test clicking navigation
console.log('\n2. NAVIGATION CLICK TEST:');
try {
  await page.click('nav a[href="#features"]', { timeout: 5000 });
  await page.waitForTimeout(500);
  const url = page.url();
  console.log('   PASS - Clicked #features, URL:', url.includes('#features') ? 'has #features' : 'no hash');
} catch (e) {
  console.log('   FAIL - Click failed:', e.message.split('\n')[0]);
}

// Check accessibility
const accessibilityCheck = await page.evaluate(() => {
  const issues = [];
  
  // Check h1
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) issues.push('No h1');
  
  // Check images without alt
  const imgsWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imgsWithoutAlt.length > 0) issues.push(`${imgsWithoutAlt.length} images without alt`);
  
  // Check buttons without accessible name
  const btnsWithoutName = Array.from(document.querySelectorAll('button')).filter(btn => {
    return !btn.getAttribute('aria-label') && !btn.textContent?.trim();
  });
  if (btnsWithoutName.length > 0) issues.push(`${btnsWithoutName.length} buttons without name`);
  
  // Check main landmark
  if (!document.querySelector('main')) issues.push('No main landmark');
  
  // Check nav landmark
  if (!document.querySelector('nav')) issues.push('No nav landmark');
  
  return issues;
});

console.log('\n3. ACCESSIBILITY:');
if (accessibilityCheck.length === 0) {
  console.log('   PASS - No accessibility issues');
} else {
  console.log('   ISSUES:', accessibilityCheck);
}

// Check responsive overflow
console.log('\n4. RESPONSIVE OVERFLOW:');
const overflowCheck = [];
const viewports = [
  { width: 320, height: 568, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' }
];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(300);
  const hasOverflow = await page.evaluate(() => 
    document.body.scrollWidth > window.innerWidth
  );
  overflowCheck.push({ name: vp.name, hasOverflow });
}

if (overflowCheck.every(v => !v.hasOverflow)) {
  console.log('   PASS - No overflow at any viewport');
} else {
  overflowCheck.forEach(v => {
    if (v.hasOverflow) console.log(`   FAIL - ${v.name} has overflow`);
    else console.log(`   OK - ${v.name} no overflow`);
  });
}

// Console errors
console.log('\n5. CONSOLE ERRORS:');
if (consoleErrors.length === 0) {
  console.log('   PASS - No console errors');
} else {
  console.log('   FAIL - Errors found:');
  consoleErrors.forEach(e => console.log('   -', e.substring(0, 100)));
}

await browser.close();
console.log('\n=== VERIFICATION COMPLETE ===');
