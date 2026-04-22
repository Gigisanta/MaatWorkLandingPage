const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { timeout: 15000, waitUntil: 'domcontentloaded' });

  // Wait a bit for React to hydrate
  await page.waitForTimeout(3000);

  // Scroll to testimonials
  await page.evaluate(() => {
    document.getElementById('testimonials')?.scrollIntoView();
  });
  await page.waitForTimeout(2000);

  console.log('=== All buttons in testimonials section ===');
  const allButtons = await page.evaluate(() => {
    const section = document.getElementById('testimonials');
    if (!section) return ['Section not found'];
    const buttons = section.querySelectorAll('button');
    return Array.from(buttons).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      className: b.className.substring(0, 80),
      rect: b.getBoundingClientRect()
    }));
  });
  console.log(JSON.stringify(allButtons, null, 2));

  console.log('\n=== Stars in testimonials ===');
  const stars = await page.evaluate(() => {
    const section = document.getElementById('testimonials');
    if (!section) return [];
    const stars = section.querySelectorAll('svg[class*="amber"], [class*="fill-amber"]');
    return Array.from(stars).slice(0, 10).map(s => ({
      className: s.className,
      width: s.getBoundingClientRect().width,
      height: s.getBoundingClientRect().height
    }));
  });
  console.log(JSON.stringify(stars, null, 2));

  console.log('\n=== Carousel cards ===');
  const cards = await page.evaluate(() => {
    const section = document.getElementById('testimonials');
    if (!section) return [];
    const cards = section.querySelectorAll('[class*="absolute"][class*="w-full"]');
    return Array.from(cards).map(c => ({
      opacity: window.getComputedStyle(c).opacity,
      transform: window.getComputedStyle(c).transform.substring(0, 50),
      visible: c.getBoundingClientRect().width > 0
    }));
  });
  console.log('Found', cards.length, 'cards');
  console.log(JSON.stringify(cards.slice(0, 5), null, 2));

  console.log('\n=== Checking isMobile ===');
  const isMobile = await page.evaluate(() => window.innerWidth < 768);
  console.log('Is mobile:', isMobile, '(width:', await page.evaluate(() => window.innerWidth), ')');

  await browser.close();
  console.log('\nDone');
})();
