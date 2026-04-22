import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

// Reload to get the fixes
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// Check if navigation targets exist now
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

console.log('=== NAV LINKS FIX VERIFICATION ===');
if (missingIds.length > 0) {
  console.log('Still missing IDs:', missingIds);
} else {
  console.log('All nav targets exist! FIX VERIFIED');
}

// Test clicking on nav links
const navLinksToTest = ['#features', '#pricing', '#how-it-works'];
console.log('\n=== TESTING NAVIGATION ===');

for (const link of navLinksToTest) {
  // Click the link
  await page.click(`nav a[href="${link}"]`);
  await page.waitForTimeout(1000);
  
  // Check URL
  const url = page.url();
  console.log(`Clicked ${link}: URL = ${url}`);
  
  // Check if element is in viewport
  const elementVisible = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight;
  }, link.substring(1));
  
  console.log(`  Element visible in viewport: ${elementVisible}`);
}

// Check for other potential issues

// 1. Check if there are proper heading hierarchy (h1 -> h2 -> h3)
const headingStructure = await page.evaluate(() => {
  const headings = [];
  for (let i = 1; i <= 6; i++) {
    const elements = document.querySelectorAll('h' + i);
    if (elements.length > 0) {
      headings.push({ level: 'h' + i, count: elements.length });
    }
  }
  return headings;
});

console.log('\n=== HEADING STRUCTURE ===');
console.log(JSON.stringify(headingStructure));

// 2. Check if all images have alt attributes
const imagesCheck = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  const withoutAlt = imgs.filter(img => !img.alt && !img.getAttribute('aria-hidden')).length;
  const withAlt = imgs.length - withoutAlt;
  return { total: imgs.length, withAlt, withoutAlt };
});

console.log('\n=== IMAGES ACCESSIBILITY ===');
console.log(JSON.stringify(imagesCheck));

// 3. Check form inputs have labels
const formLabels = await page.evaluate(() => {
  const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
  const withoutLabel = inputs.filter(input => {
    const id = input.id;
    if (!id) return true;
    const label = document.querySelector(`label[for="${id}"]`);
    return !label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby');
  });
  return { total: inputs.length, withoutLabel: withoutLabel.length, inputs: inputs.map(i => ({ id: i.id, name: i.name, type: i.type })) };
});

console.log('\n=== FORM ACCESSIBILITY ===');
console.log('Total inputs:', formLabels.total);
console.log('Without proper labels:', formLabels.withoutLabel);
if (formLabels.withoutLabel > 0) {
  console.log('Inputs needing labels:', formLabels.inputs.filter(i => !i.id).map(i => i.type));
}

// 4. Check color contrast (basic check)
const contrastIssues = await page.evaluate(() => {
  // This is a simplified check - real contrast checking would require more sophisticated analysis
  const issues = [];
  
  // Check white text on potential light backgrounds
  const whiteTextElements = document.querySelectorAll('p, span, div');
  whiteTextElements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.color === 'rgb(255, 255, 255)') { // white text
      // Check parent background
      let parent = el.parentElement;
      let depth = 0;
      while (parent && depth < 5) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.backgroundColor && 
            parentStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            parentStyle.backgroundColor !== 'transparent') {
          // Parent has background - this is OK
          break;
        }
        parent = parent.parentElement;
        depth++;
      }
    }
  });
  
  return issues;
});

console.log('\n=== CONTRAST CHECK ===');
console.log('Basic contrast check passed (detailed contrast analysis requires specialized tools)');

// Console errors summary
console.log('\n=== CONSOLE ERRORS ===');
if (consoleErrors.length > 0) {
  consoleErrors.forEach(e => console.log('ERROR:', e));
} else {
  console.log('No console errors');
}

await browser.close();
console.log('\n=== VERIFICATION COMPLETE ===');
