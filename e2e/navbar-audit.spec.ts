import { test, expect, type Page } from '@playwright/test';

test.describe('Navbar Mobile Audit at 375px', () => {
  const MOBILE_WIDTH = 375;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_WIDTH, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('1. Mobile menu button touch target (must be 44x44px)', async ({ page }) => {
    console.log('\n=== 1. MOBILE MENU BUTTON TOUCH TARGET ===');
    const menuButton = page.locator('button[aria-label="Menu"]');
    await expect(menuButton).toBeVisible();
    const box = await menuButton.boundingBox();
    console.log(`Menu button size: ${box?.width.toFixed(1)}x${box?.height.toFixed(1)}px`);
    console.log(`Pass: ${box!.width >= 44 && box!.height >= 44 ? 'YES' : 'NO'} (required: 44x44px)`);
  });

  test('2. Menu overlay appearance and animation', async ({ page }) => {
    console.log('\n=== 2. MENU OVERLAY APPEARANCE ===');
    const menuButton = page.locator('button[aria-label="Menu"]');

    // Check for backdrop element BEFORE clicking
    const backdropBefore = page.locator('[class*="backdrop"]').count();
    console.log(`Backdrop elements before click: ${backdropBefore}`);

    await menuButton.click();
    await page.waitForTimeout(500);

    // Check for backdrop/overlay after clicking
    const backdropAfter = page.locator('[class*="backdrop"]').count();
    console.log(`Backdrop elements after click: ${backdropAfter}`);

    // Check if mobile menu is visible
    const mobileMenu = page.locator('header >> text=Características');
    const isMenuVisible = await mobileMenu.isVisible();
    console.log(`Mobile menu visible: ${isMenuVisible}`);

    // Check for overlay styles
    const menuPanel = page.locator('header > div > div > div').last();
    const bgColor = await menuPanel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log(`Menu panel background: ${bgColor}`);
  });

  test('3. Menu item spacing and touch targets', async ({ page }) => {
    console.log('\n=== 3. MENU ITEM SPACING AND TOUCH TARGETS ===');
    const menuButton = page.locator('button[aria-label="Menu"]');
    await menuButton.click();
    await page.waitForTimeout(500);

    const menuItems = page.locator('header a[href^="#"]');
    const count = await menuItems.count();
    console.log(`Menu items found: ${count}`);

    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      const box = await item.boundingBox();
      const text = await item.textContent();
      console.log(`${text?.trim()}: ${box?.width.toFixed(1)}x${box?.height.toFixed(1)}px`);
      console.log(`  Touch target pass: ${box!.height >= 44 ? 'YES' : 'NO'}`);
    }
  });

  test('4. Close button visibility and placement', async ({ page }) => {
    console.log('\n=== 4. CLOSE BUTTON VISIBILITY ===');
    const menuButton = page.locator('button[aria-label="Menu"]');
    await menuButton.click();
    await page.waitForTimeout(500);

    // Check if aria-label changes to indicate close
    const ariaLabel = await menuButton.getAttribute('aria-label');
    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    console.log(`Menu button aria-label: ${ariaLabel}`);
    console.log(`Menu button aria-expanded: ${ariaExpanded}`);

    // Check X animation in hamburger
    const hamburgerLines = page.locator('button[aria-label="Menu"] span');
    const lineCount = await hamburgerLines.count();
    console.log(`Hamburger lines count: ${lineCount}`);
  });

  test('5. Hamburger icon animation smoothness', async ({ page }) => {
    console.log('\n=== 5. HAMBURGER ANIMATION ===');
    const menuButton = page.locator('button[aria-label="Menu"]');

    // Get initial state
    const line1Before = await page.locator('button[aria-label="Menu"] span').first().evaluate((el) => ({
      top: window.getComputedStyle(el).top,
      transform: window.getComputedStyle(el).transform,
    }));
    console.log('Line 1 before:', line1Before);

    await menuButton.click();
    await page.waitForTimeout(400);

    const line1After = await page.locator('button[aria-label="Menu"] span').first().evaluate((el) => ({
      top: window.getComputedStyle(el).top,
      transform: window.getComputedStyle(el).transform,
    }));
    console.log('Line 1 after:', line1After);
  });

  test('6. Menu backdrop/blur effect', async ({ page }) => {
    console.log('\n=== 6. BACKDROP/BLUR EFFECT ===');
    const menuButton = page.locator('button[aria-label="Menu"]');

    // Check header styles
    const headerStyles = await page.locator('header').evaluate((el) => ({
      position: window.getComputedStyle(el).position,
      zIndex: window.getComputedStyle(el).zIndex,
    }));
    console.log('Header:', headerStyles);

    await menuButton.click();
    await page.waitForTimeout(500);

    // Look for any overlay/backdrop elements
    const bodyChildren = await page.evaluate(() => {
      const body = document.body;
      const children = Array.from(body.children).map((el) => ({
        tag: el.tagName,
        class: el.className.substring(0, 100),
        zIndex: window.getComputedStyle(el).zIndex,
      }));
      return children;
    });
    console.log('Body children count:', bodyChildren.length);
    bodyChildren.forEach((child, i) => {
      if (child.zIndex !== 'auto' && child.zIndex !== '0') {
        console.log(`  [${i}] ${child.tag}.${child.class} z-index:${child.zIndex}`);
      }
    });
  });

  test('7. Scroll lock when menu is open', async ({ page }) => {
    console.log('\n=== 7. SCROLL LOCK ===');
    const menuButton = page.locator('button[aria-label="Menu"]');

    // Get body overflow before
    const overflowBefore = await page.evaluate(() => document.body.style.overflow);
    console.log(`Body overflow before: "${overflowBefore}"`);

    // Check if page scroll is locked (body overflow hidden)
    const bodyOverflowBefore = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    console.log(`Body computed overflow before: ${bodyOverflowBefore}`);

    await menuButton.click();
    await page.waitForTimeout(500);

    const bodyOverflowAfter = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    console.log(`Body computed overflow after menu open: ${bodyOverflowAfter}`);

    // Try to scroll
    await page.evaluate(() => window.scrollBy(0, 100));
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY after scroll attempt: ${scrollYAfter}`);
    console.log(`Scroll lock pass: ${bodyOverflowAfter === 'hidden' ? 'YES' : 'NO (scrollable)'} `);
  });

  test('8. Z-index layering', async ({ page }) => {
    console.log('\n=== 8. Z-INDEX LAYERING ===');
    const header = page.locator('header');
    const headerZ = await header.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`Header z-index: ${headerZ}`);

    // Open menu
    const menuButton = page.locator('button[aria-label="Menu"]');
    await menuButton.click();
    await page.waitForTimeout(500);

    // Check all z-indices in header area
    const allWithZIndex = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const results: { tag: string; class: string; zIndex: string }[] = [];
      elements.forEach((el) => {
        const z = window.getComputedStyle(el).zIndex;
        if (z && z !== 'auto' && z !== '0') {
          results.push({
            tag: el.tagName,
            class: el.className.substring(0, 80),
            zIndex: z,
          });
        }
      });
      return results;
    });

    console.log('Elements with z-index:');
    allWithZIndex.forEach((el) => {
      console.log(`  ${el.tag}.${el.class} z-index:${el.zIndex}`);
    });
  });
});