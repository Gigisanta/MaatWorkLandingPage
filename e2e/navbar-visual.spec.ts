import { test, expect } from '@playwright/test';

test.describe('Navbar Visual Check', () => {
  test('visual and state check', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log('\n========== VISUAL CHECK ==========\n');

    // Get initial state
    const menuButton = page.locator('button[aria-label="Menu"]');
    const initialExpanded = await menuButton.getAttribute('aria-expanded');
    console.log(`Initial aria-expanded: ${initialExpanded}`);

    // Click and immediately check
    await menuButton.click();
    await page.waitForTimeout(100);
    const expanded100ms = await menuButton.getAttribute('aria-expanded');
    console.log(`After click (100ms): aria-expanded = ${expanded100ms}`);

    await page.waitForTimeout(400);
    const expanded500ms = await menuButton.getAttribute('aria-expanded');
    console.log(`After click (500ms): aria-expanded = ${expanded500ms}`);

    // Check hamburger state
    const spans = page.locator('button[aria-label="Menu"] span');
    for (let i = 0; i < 3; i++) {
      const span = spans.nth(i);
      const top = await span.evaluate((el) => window.getComputedStyle(el).top);
      const transform = await span.evaluate((el) => window.getComputedStyle(el).transform);
      console.log(`Span ${i}: top=${top}, transform=${transform}`);
    }

    // Check menu visibility
    const menuLinks = page.locator('header >> text=Características');
    const menuVisible = await menuLinks.isVisible();
    console.log(`Menu "Características" visible: ${menuVisible}`);

    // Check main content visibility
    const mainContent = page.locator('main');
    const mainVisible = await mainContent.isVisible();
    const mainBox = await mainContent.boundingBox();
    console.log(`Main content visible: ${mainVisible}, position: ${mainBox?.y}`);

    // Check if floating whatsapp is covering menu
    const whatsapp = page.locator('[class*="whatsapp"], [class*="WhatsApp"]');
    const whatsappCount = await whatsapp.count();
    console.log(`WhatsApp elements found: ${whatsappCount}`);
    if (whatsappCount > 0) {
      const whatsappBox = await whatsapp.first().boundingBox();
      console.log(`WhatsApp position: ${whatsappBox?.x}, ${whatsappBox?.y}`);
    }

    // Screenshot for debugging
    await page.screenshot({ path: '/tmp/navbar-test.png', fullPage: false });
    console.log('\nScreenshot saved to /tmp/navbar-test.png');

    console.log('\n========== END VISUAL CHECK ==========\n');
  });
});