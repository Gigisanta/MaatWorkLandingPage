import { test, expect, type Page } from '@playwright/test';

test.describe('Mobile Audit - Detailed', () => {
  const MOBILE_WIDTH = 375;

  test('Diagnose z-index and pointer blocking issues', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait for page load animation
    await page.waitForTimeout(1500);

    console.log('\n=== DIAGNOSING POINTER INTERCEPT ISSUE ===');

    // Get navbar info
    const navbar = page.locator('header');
    const navbarBox = await navbar.boundingBox();
    console.log(`Navbar position: ${navbarBox?.x}, ${navbarBox?.y} size: ${navbarBox?.width}x${navbarBox?.height}`);
    const navbarZ = await navbar.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Navbar z-index: ${navbarZ}`);
    const navbarPos = await navbar.evaluate((el) => window.getComputedStyle(el).position);
    console.log(`Navbar position: ${navbarPos}`);

    // Get entrance-banner info
    const banner = page.locator('.entrance-banner');
    const bannerBox = await banner.boundingBox();
    console.log(`Banner position: ${bannerBox?.x}, ${bannerBox?.y} size: ${bannerBox?.width}x${bannerBox?.height}`);
    const bannerZ = await banner.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Banner z-index: ${bannerZ}`);
    const bannerPos = await banner.evaluate((el) => window.getComputedStyle(el).position);
    console.log(`Banner position: ${bannerPos}`);

    // Check menu button
    const menuButton = page.locator('button[aria-label="Menu"]');
    const buttonBox = await menuButton.boundingBox();
    console.log(`Menu button position: ${buttonBox?.x}, ${buttonBox?.y} size: ${buttonBox?.width}x${buttonBox?.height}`);

    // Check what element is at the menu button location
    const elementAtButton = page.evaluate((coords) => {
      const el = document.elementFromPoint(coords.x, coords.y);
      return {
        tagName: el?.tagName,
        className: el?.className,
        id: el?.id,
        ariaLabel: el?.getAttribute('aria-label'),
        zIndex: el ? window.getComputedStyle(el).zIndex : null,
      };
    }, { x: buttonBox!.x + buttonBox!.width/2, y: buttonBox!.y + buttonBox!.height/2 });
    console.log('Element at menu button:', elementAtButton);

    // Try to click with force
    console.log('\nTrying force click...');
    await menuButton.click({ force: true });
    await page.waitForTimeout(500);

    // Check if menu expanded
    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    console.log(`Menu aria-expanded after click: ${ariaExpanded}`);
  });

  test('Check touch targets in mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1500);

    console.log('\n=== TOUCH TARGET AUDIT ===');

    // Force click menu to open
    const menuButton = page.locator('button[aria-label="Menu"]');
    await menuButton.click({ force: true });
    await page.waitForTimeout(500);

    // Check all interactive elements in header area
    const allInteractive = await page.locator('header').first().locator('a, button').all();
    console.log(`Found ${allInteractive.length} interactive elements in header`);

    for (const el of allInteractive) {
      const box = await el.boundingBox();
      const label = await el.getAttribute('aria-label') || await el.textContent();
      const isVisible = await el.isVisible();
      console.log(`${label?.trim().substring(0, 30)}: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}px visible=${isVisible}`);
    }
  });

  test('Footer social icons check', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1500);

    console.log('\n=== FOOTER AUDIT ===');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Get footer
    const footer = page.locator('footer');
    const footerBox = await footer.boundingBox();
    console.log(`Footer at: ${footerBox?.x}, ${footerBox?.y} size: ${footerBox?.width}x${footerBox?.height}`);

    // Social icons
    const socialLinks = page.locator('footer a[aria-label]');
    const count = await socialLinks.count();
    console.log(`Social links with labels: ${count}`);

    for (let i = 0; i < count; i++) {
      const link = socialLinks.nth(i);
      const box = await link.boundingBox();
      const label = await link.getAttribute('aria-label');
      console.log(`${label}: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}px`);
    }

    // Check viewport overflow
    const viewport = page.viewportSize();
    console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);
    console.log(`Footer right edge: ${(footerBox?.x ?? 0) + (footerBox?.width ?? 0)} vs viewport ${viewport?.width}`);
  });
});
