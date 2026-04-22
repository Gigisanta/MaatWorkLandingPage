import { test, expect } from '@playwright/test';

test.describe('Mobile 375px Comprehensive Audit', () => {
  test('Navbar mobile menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500); // Wait for entrance animations

    const menuBtn = page.locator('button[aria-label="Menu"]');

    // Menu should be closed initially
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await menuBtn.click();
    await page.waitForTimeout(400);

    // Menu should be open
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

    // Check nav links are visible
    const navLink = page.locator('text=Características').first();
    await expect(navLink).toBeVisible();

    // Click to close
    await menuBtn.click();
    await page.waitForTimeout(400);

    // Menu should be closed
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('Touch target sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const menuBtn = page.locator('button[aria-label="Menu"]');
    await menuBtn.click();
    await page.waitForTimeout(400);

    // Check header interactive elements
    const header = page.locator('header');
    const interactives = await header.locator('a, button').all();

    console.log('\n=== HEADER TOUCH TARGETS ===');
    let allPass = true;
    for (const el of interactives) {
      const box = await el.boundingBox();
      const label = await el.getAttribute('aria-label') || await el.textContent();
      const labelShort = (label || '').trim().substring(0, 25);
      const pass = box && box.width >= 44 && box.height >= 44;
      if (!pass) allPass = false;
      console.log(`${labelShort}: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}px ${pass ? '✓' : '✗'}`);
    }

    expect(allPass).toBe(true);
  });

  test('Footer audit', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('footer');
    const footerBox = await footer.boundingBox();

    console.log('\n=== FOOTER AUDIT ===');
    console.log(`Footer size: ${footerBox?.width.toFixed(0)}x${footerBox?.height.toFixed(0)}`);
    console.log(`Footer right edge: ${(footerBox?.x ?? 0) + (footerBox?.width ?? 0)}`);

    // Check social icons (should be 44x44px)
    const socialIcons = page.locator('footer a[aria-label]');
    const iconCount = await socialIcons.count();
    console.log(`Social icons: ${iconCount}`);

    let allPass = true;
    for (let i = 0; i < iconCount; i++) {
      const icon = socialIcons.nth(i);
      const box = await icon.boundingBox();
      const label = await icon.getAttribute('aria-label');
      const pass = box && box.width >= 44 && box.height >= 44;
      if (!pass) allPass = false;
      console.log(`  ${label}: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}px ${pass ? '✓' : '✗'}`);
    }

    // Check for overflow
    const viewport = page.viewportSize();
    const hasOverflow = ((footerBox?.x ?? 0) + (footerBox?.width ?? 0)) > (viewport?.width ?? 0);
    console.log(`Overflow: ${hasOverflow ? 'YES ✗' : 'No ✓'}`);

    expect(allPass).toBe(true);
  });

  test('Z-index layering', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    console.log('\n=== Z-INDEX LAYERING ===');

    const header = page.locator('header');
    const headerZ = await header.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Header z-index: ${headerZ}`);

    // Check if z-index is meaningful (not auto/0)
    const headerZNum = parseInt(headerZ || '0');
    expect(headerZNum).toBeGreaterThan(0);

    // The header has z-50 which should be above content
    console.log(`Header z-index ${headerZ} is valid (above 0)`);
  });

  test('Mobile menu z-index above all', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const menuBtn = page.locator('button[aria-label="Menu"]');
    await menuBtn.click();
    await page.waitForTimeout(400);

    console.log('\n=== MOBILE MENU Z-INDEX ===');

    // The mobile menu container should have z-index set
    const menuContainer = page.locator('header > div > div').last();
    const menuZ = await menuContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { zIndex: style.zIndex, position: style.position };
    });

    console.log(`Menu position: ${menuZ.position}, zIndex: ${menuZ.zIndex}`);

    // Menu should have z-index of at least 50 (same as header)
    const menuZNum = parseInt(menuZ.zIndex || '0');
    expect(menuZNum).toBeGreaterThanOrEqual(50);
  });
});
