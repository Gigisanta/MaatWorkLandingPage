const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Opening page at desktop resolution...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll to testimonials section
  await page.evaluate(() => {
    const testimonials = document.getElementById('testimonials');
    if (testimonials) {
      testimonials.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(2000);

  console.log('\n=== Desktop Navigation Arrows Check ===');
  await page.screenshot({ path: '/Users/prueba/Desktop/maatwork-web/testimonials-audit-desktop-arrows.png', fullPage: false });

  // Check for arrows with different selector
  const arrowsCheck = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    return Array.from(buttons).map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      text: b.textContent?.trim().substring(0, 30),
      visible: b.offsetParent !== null,
      disabled: b.disabled
    }));
  });
  console.log('All buttons found:', JSON.stringify(arrowsCheck, null, 2));

  // Specifically look for the arrow buttons
  const arrowButtons = await page.$$('button[class*="w-14"][class*="h-14"]');
  console.log(`Found ${arrowButtons.length} buttons with w-14 h-14 classes`);

  // Click next and take screenshot
  const nextButton = await page.$('button[aria-label="Siguiente"]');
  if (nextButton) {
    await nextButton.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: '/Users/prueba/Desktop/maatwork-web/testimonials-audit-after-next.png', fullPage: false });
    console.log('Clicked next, screenshot taken');
  } else {
    console.log('Next button NOT found with aria-label selector');
  }

  // Check hover effects
  console.log('\n=== Checking Hover Effects ===');

  // Find the carousel container
  const carouselContainer = await page.$('.relative.h-\\[520px\\]');
  if (carouselContainer) {
    await carouselContainer.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/prueba/Desktop/maatwork-web/testimonials-audit-hover.png', fullPage: false });
    console.log('Hovered carousel, screenshot taken');
  }

  // Check video testimonials specifically
  console.log('\n=== Checking Video Testimonials ===');
  const videoCards = await page.$$('[class*="aspect-video"]');
  console.log(`Found ${videoCards.length} video containers`);

  // Check for the video indicator badge
  const videoBadge = await page.$eval('text=Video', el => {
    const rect = el.getBoundingClientRect();
    return { found: true, text: el.textContent, width: rect.width, height: rect.height };
  }).catch(() => ({ found: false }));
  console.log(`Video badge: ${JSON.stringify(videoBadge)}`);

  // Check the glass effect on cards
  console.log('\n=== Checking Glass Effect ===');
  const glassCard = await page.$('.glass-premium-strong');
  if (glassCard) {
    const style = await glassCard.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        background: s.background,
        backdropFilter: s.backdropFilter,
        border: s.border
      };
    });
    console.log('Glass card styles:', JSON.stringify(style, null, 2));
  } else {
    console.log('No glass-premium-strong element found');
  }

  // Check quote mark decorations
  console.log('\n=== Checking Quote Marks ===');
  const quoteMarks = await page.$$('text="\\""');
  console.log(`Found ${quoteMarks.length} quote mark elements`);

  // Check result badges
  console.log('\n=== Checking Result Badges ===');
  const resultBadges = await page.$$eval('text=/\\+[0-9]+%/', els =>
    els.map(el => ({
      text: el.textContent,
      visible: el.offsetParent !== null
    }))
  );
  console.log(`Found ${resultBadges.length} result badges:`, JSON.stringify(resultBadges, null, 2));

  // Check online indicator
  console.log('\n=== Checking Online Indicator ===');
  const onlineIndicator = await page.$('.bg-emerald-500.rounded-full');
  if (onlineIndicator) {
    console.log('Online indicator found on active card');
  } else {
    console.log('Online indicator NOT found');
  }

  console.log('\n=== Audit Complete ===');

  await browser.close();
})();
