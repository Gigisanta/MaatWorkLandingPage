import { test, expect } from '@playwright/test';

test.describe('Navbar Scroll Lock Test', () => {
  test('verify scroll lock behavior', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Scroll down first to have content to scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    console.log('\n========== SCROLL LOCK TEST ==========\n');

    // Check scroll position before
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY before menu open: ${scrollYBefore}`);

    // Open menu
    const menuButton = page.locator('button[aria-label="Menu"]');
    console.log(`Menu button visible: ${await menuButton.isVisible()}`);

    await menuButton.click({ force: true });
    await page.waitForTimeout(500);

    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    console.log(`aria-expanded after click: ${ariaExpanded}`);

    // Check body overflow styles
    const bodyStyle = await page.evaluate(() => ({
      inline: document.body.style.overflow,
      computed: window.getComputedStyle(document.body).overflow,
      overflowX: window.getComputedStyle(document.body).overflowX,
      overflowY: window.getComputedStyle(document.body).overflowY,
    }));
    console.log(`Body overflow - inline: "${bodyStyle.inline}", computed: "${bodyStyle.computed}"`);
    console.log(`Body overflowX: "${bodyStyle.overflowX}", overflowY: "${bodyStyle.overflowY}"`);

    // Try to scroll
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(200);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY after scroll attempt: ${scrollYAfter}`);
    console.log(`Scroll position changed: ${scrollYBefore !== scrollYAfter ? 'YES (BUG)' : 'NO (CORRECT)'}`);

    // Check if scroll is locked
    const isLocked = bodyStyle.overflow === 'hidden' || bodyStyle.overflow.includes('hidden');
    console.log(`\nSCROLL LOCK STATUS: ${isLocked ? 'ENABLED (PASS)' : 'NOT ENABLED (FAIL)'}`);

    console.log('\n========== END TEST ==========\n');
  });
});