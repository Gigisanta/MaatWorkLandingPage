import { test, expect } from '@playwright/test';

test('simple mobile check', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000');

  // Wait for content
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Get page content
  const html = await page.content();
  console.log('Page loaded, checking elements...');
  console.log('Has header:', html.includes('<header'));
  console.log('Has footer:', html.includes('<footer'));
  console.log('Has button:', html.includes('button'));

  // Try to find menu button
  const menuBtn = page.locator('button[aria-label="Menu"]');
  const count = await menuBtn.count();
  console.log('Menu button count:', count);

  if (count > 0) {
    const box = await menuBtn.boundingBox();
    console.log('Menu button box:', box);
  }

  // Take screenshot
  await page.screenshot({ path: 'mobile-test.png' });
  console.log('Screenshot saved');
});
