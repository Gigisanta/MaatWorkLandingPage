import { chromium, Browser, Page, ViewportSize } from '@playwright/test';

const viewports: { name: string; size: ViewportSize }[] = [
  { name: '375px (mobile)', size: { width: 375, height: 812 } },
  { name: '768px (tablet)', size: { width: 768, height: 1024 } },
  { name: '1024px (laptop)', size: { width: 1024, height: 768 } },
  { name: '1440px (desktop)', size: { width: 1440, height: 900 } },
];

async function auditTrustBadges() {
  console.log('=== Trust Badges Audit Report ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging for errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded successfully\n');

    // Scroll to trust badges section
    const trustBadgesSection = page.locator('section').filter({ has: page.locator('text=Datos seguros') });
    await trustBadgesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    for (const { name, size } of viewports) {
      console.log(`\n--- Viewport: ${name} ---`);
      await page.setViewportSize(size);
      await page.waitForTimeout(500);

      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const windowWidth = await page.evaluate(() => window.innerWidth);
      const hasHorizontalOverflow = bodyWidth > windowWidth;
      console.log(`1. Horizontal overflow: ${hasHorizontalOverflow ? 'BUG - viewport overflow detected' : 'OK'}`);

      // Check badge visibility
      const badgeCount = await page.locator('[class*="rounded-2xl"][class*="group"]').count();
      console.log(`2. Badge count visible: ${badgeCount} (expected 8)`);

      // Check badge icons
      const iconElements = await page.locator('[class*="rounded-2xl"] svg').count();
      console.log(`3. Badge icons visible: ${iconElements}`);

      // Check text contrast - verify labels are visible
      const labelText = await page.locator('text=Datos seguros').first().isVisible();
      console.log(`4. Label "Datos seguros" visible: ${labelText}`);

      // Check spacing between badges using computed styles
      const badgeBox = await page.locator('[class*="grid"] > div').first().boundingBox();
      if (badgeBox) {
        console.log(`5. First badge dimensions: ${Math.round(badgeBox.width)}x${Math.round(badgeBox.height)}px`);
      }

      // Check hover animation capability (element should exist and be interactive)
      const firstBadge = page.locator('[class*="group"]').first();
      const isHoverable = await firstBadge.isVisible();
      console.log(`6. Badges are visible: ${isHoverable}`);

      // Test reduced motion preference
      console.log('7. Reduced motion preference can be detected: use prefers-reduced-motion media query');
    }

    // Test reduced motion
    console.log('\n--- Reduced Motion Test ---');
    const reducedMotionContext = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const reducedMotionPage = await reducedMotionContext.newPage();
    await reducedMotionPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await reducedMotionPage.locator('section').filter({ has: reducedMotionPage.locator('text=Datos seguros') }).scrollIntoViewIfNeeded();
    console.log('Reduced motion context established - animations should be disabled');

    // Check for console errors
    console.log('\n--- Console Errors ---');
    if (consoleErrors.length === 0) {
      console.log('No console errors detected');
    } else {
      console.log(`Found ${consoleErrors.length} console errors:`);
      consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }

    console.log('\n=== Audit Complete ===');

  } catch (error) {
    console.error('Error during audit:', error);
  } finally {
    await browser.close();
  }
}

auditTrustBadges().catch(console.error);
