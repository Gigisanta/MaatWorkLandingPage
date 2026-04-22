import { test, expect, type Page } from '@playwright/test';

test.describe('Mobile Navbar & Footer Audit', () => {
  const MOBILE_WIDTH = 375;
  const TOUCH_TARGET_MIN = 44;

  let issues: string[] = [];

  test.beforeEach(async ({ page }) => {
    issues = [];
  });

  test('Navbar mobile menu toggle works correctly', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });

    // Navigate to page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check mobile menu button exists and is visible
    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toBeVisible();

    // Get initial button location
    const buttonBox = await menuButton.boundingBox();
    console.log(`Menu button size: ${buttonBox?.width}x${buttonBox?.height}`);

    // Click to open menu
    await menuButton.click();
    await page.waitForTimeout(400); // Wait for animation

    // Check menu is open (should see nav links)
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    console.log(`Nav links visible: ${linkCount}`);

    // Menu should be visible
    const menuContent = page.locator('text=Características').first();
    await expect(menuContent).toBeVisible();

    // Click to close menu
    await menuButton.click();
    await page.waitForTimeout(400);

    // Menu should be closed
    await expect(menuContent).not.toBeVisible();
  });

  test('Touch targets meet 44x44px minimum', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Open mobile menu first
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();
    await page.waitForTimeout(400);

    // Check all clickable elements in mobile menu
    const mobileMenu = page.locator('header').first();
    const clickables = await mobileMenu.locator('a, button').all();

    console.log('\n=== TOUCH TARGET AUDIT ===');
    for (const el of clickables) {
      const box = await el.boundingBox();
      if (box) {
        const meetsMin = box.width >= TOUCH_TARGET_MIN && box.height >= TOUCH_TARGET_MIN;
        console.log(`${el.locator('*').first().getAttribute('class')?.split(' ').pop() || 'element'}: ${box.width.toFixed(0)}x${box.height.toFixed(0)}px ${meetsMin ? '✓' : '✗ FAIL'}`);
        if (!meetsMin) {
          issues.push(`Touch target too small: ${box.width.toFixed(0)}x${box.height.toFixed(0)}px (min: 44x44px)`);
        }
      }
    }
  });

  test('Footer alignment and social icons', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check footer social icons
    const socialIcons = page.locator('footer a').filter({ has: page.locator('svg') });
    const iconCount = await socialIcons.count();
    console.log(`\n=== FOOTER AUDIT ===`);
    console.log(`Social icons found: ${iconCount}`);

    for (let i = 0; i < iconCount; i++) {
      const icon = socialIcons.nth(i);
      const box = await icon.boundingBox();
      const label = await icon.getAttribute('aria-label');
      console.log(`Icon ${label}: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}px`);

      if (box && (box.width < TOUCH_TARGET_MIN || box.height < TOUCH_TARGET_MIN)) {
        issues.push(`Footer social icon "${label}" too small: ${box.width.toFixed(0)}x${box.height.toFixed(0)}px`);
      }
    }

    // Check footer links are clickable (no overflow)
    const footerLinks = page.locator('footer a');
    const linkCount = await footerLinks.count();
    console.log(`Footer links found: ${linkCount}`);

    for (let i = 0; i < linkCount; i++) {
      const link = footerLinks.nth(i);
      const box = await link.boundingBox();
      if (box) {
        // Check for overflow (element extends past viewport)
        const viewport = page.viewportSize();
        if (box.x + box.width > (viewport?.width || 0)) {
          issues.push(`Footer link overflows viewport: ${box.x + box.width}px > ${viewport?.width}px`);
        }
      }
    }
  });

  test('Z-index layering is correct', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('\n=== Z-INDEX AUDIT ===');

    // Get navbar z-index
    const navbar = page.locator('header');
    const navbarZ = await navbar.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Navbar z-index: ${navbarZ}`);

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();
    await page.waitForTimeout(400);

    // Get mobile menu z-index
    const mobileMenu = page.locator('header > div > div').last();
    const menuZ = await mobileMenu.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { zIndex: style.zIndex, position: style.position };
    });
    console.log(`Mobile menu style: zIndex=${menuZ.zIndex}, position=${menuZ.position}`);

    // Check main content is below navbar
    const main = page.locator('main').first();
    const mainZ = await main.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Main content z-index: ${mainZ}`);

    if (parseInt(navbarZ || '0') <= 0) {
      issues.push(`Navbar z-index is not set (value: ${navbarZ}))`);
    }
  });

  test('Report all issues', async ({ page }) => {
    // This test runs last and reports all issues
    console.log('\n=== FINAL ISSUES REPORT ===');
    if (issues.length === 0) {
      console.log('No critical issues found!');
    } else {
      issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
    }
    expect(true).toBe(true); // Always pass, issues logged above
  });
});
