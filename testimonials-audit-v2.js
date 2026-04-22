const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ timeout: 10000 });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Opening page...');
  await page.goto('http://localhost:3000', { timeout: 15000 });

  // Scroll to testimonials
  await page.evaluate(() => {
    document.getElementById('testimonials')?.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  console.log('\n=== Navigation Arrows ===');
  const arrows = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons
      .filter(b => b.getAttribute('aria-label')?.includes('nterior') || b.getAttribute('aria-label')?.includes('iguiente'))
      .map(b => ({
        ariaLabel: b.getAttribute('aria-label'),
        visible: b.offsetWidth > 0 && b.offsetHeight > 0,
        disabled: b.disabled,
        classes: b.className.substring(0, 100)
      }));
  });
  console.log(JSON.stringify(arrows, null, 2));

  console.log('\n=== Star Sizes ===');
  const starInfo = await page.evaluate(() => {
    const stars = document.querySelectorAll('.fill-amber-400');
    const sizes = new Set();
    stars.forEach(s => {
      const r = s.getBoundingClientRect();
      sizes.add(`${r.width}x${r.height}`);
    });
    return Array.from(sizes);
  });
  console.log('Star sizes found:', starInfo);

  console.log('\n=== Card Hover States ===');
  const cardStates = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="absolute"][class*="left-1/2"]');
    return Array.from(cards).slice(0, 3).map((c, i) => {
      const style = window.getComputedStyle(c);
      return {
        card: i,
        opacity: style.opacity,
        transform: style.transform.substring(0, 80),
        pointerEvents: style.pointerEvents
      };
    });
  });
  console.log(JSON.stringify(cardStates, null, 2));

  console.log('\n=== Active Card Details ===');
  const activeCard = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="absolute"][class*="left-1/2"]');
    for (const c of cards) {
      const style = window.getComputedStyle(c);
      if (style.opacity === '1' && style.pointerEvents === 'auto') {
        const rect = c.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          transform: style.transform.substring(0, 100)
        };
      }
    }
    return null;
  });
  console.log(JSON.stringify(activeCard, null, 2));

  console.log('\n=== Progress Counter ===');
  const counter = await page.evaluate(() => {
    const el = document.querySelector('text=/[0-9][0-9] \\/ [0-9][0-9]/');
    return el ? el.textContent : 'Not found';
  });
  console.log('Counter:', counter);

  console.log('\nAudit done');
  await browser.close();
})();
