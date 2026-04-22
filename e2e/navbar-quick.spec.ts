import { test, expect } from '@playwright/test';

test.describe('Navbar Mobile Audit - 375px', () => {
  test('audit all items', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log('\n========== NAVBAR MOBILE AUDIT ==========\n');

    // 1. Menu button touch target
    const menuButton = page.locator('button[aria-label="Menu"]');
    const btnBox = await menuButton.boundingBox();
    console.log(`[1] MENU BUTTON: ${btnBox?.width}x${btnBox?.height}px`);
    console.log(`    Required: 44x44px - Status: ${btnBox!.width >= 44 && btnBox!.height >= 44 ? 'PASS' : 'FAIL'}\n`);

    // Open menu
    await menuButton.click({ force: true });
    await page.waitForTimeout(600);

    // 2. Scroll lock
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    const bodyComputedOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    console.log(`[2] SCROLL LOCK:`);
    console.log(`    body.style.overflow: "${bodyOverflow}"`);
    console.log(`    body computed overflow: "${bodyComputedOverflow}"`);
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, 200));
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    console.log(`    ScrollY before: ${scrollYBefore}, after: ${scrollYAfter}`);
    console.log(`    Status: ${bodyComputedOverflow === 'hidden' && scrollYBefore === scrollYAfter ? 'PASS' : 'FAIL (scrollable)'}\n`);

    // 3. Menu items touch targets
    const menuLinks = page.locator('header >> a[href^="#"]');
    const linkCount = await menuLinks.count();
    console.log(`[3] MENU ITEMS TOUCH TARGETS: ${linkCount} links found`);

    let minHeight = Infinity;
    let failCount = 0;
    for (let i = 0; i < linkCount; i++) {
      const link = menuLinks.nth(i);
      const linkBox = await link.boundingBox();
      if (linkBox) {
        const text = (await link.textContent())?.trim().substring(0, 20);
        const pass = linkBox.height >= 44 ? 'PASS' : 'FAIL';
        if (linkBox.height < 44) failCount++;
        if (linkBox.height < minHeight) minHeight = linkBox.height;
        console.log(`    "${text}": ${linkBox.width}x${linkBox.height}px - ${pass}`);
      }
    }
    console.log(`    Min height: ${minHeight === Infinity ? 'N/A' : minHeight + 'px'}`);
    console.log(`    Status: ${failCount === 0 ? 'PASS' : `FAIL (${failCount} items < 44px)`}\n`);

    // 4. Close button (X indicator)
    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    const ariaLabel = await menuButton.getAttribute('aria-label');
    console.log(`[4] CLOSE BUTTON:`);
    console.log(`    aria-expanded: "${ariaExpanded}"`);
    console.log(`    aria-label: "${ariaLabel}"`);
    console.log(`    Status: ${ariaExpanded === 'true' ? 'PASS' : 'FAIL'}\n`);

    // 5. Hamburger animation
    const spans = page.locator('button[aria-label="Menu"] span');
    const spanCount = await spans.count();
    console.log(`[5] HAMBURGER ANIMATION:`);
    console.log(`    Span count: ${spanCount}`);
    for (let i = 0; i < spanCount; i++) {
      const span = spans.nth(i);
      const transform = await span.evaluate((el) => window.getComputedStyle(el).transform);
      const top = await span.evaluate((el) => window.getComputedStyle(el).top);
      console.log(`    Span ${i}: top=${top}, transform=${transform}`);
    }
    console.log(`    Status: ${spanCount === 3 ? 'PASS' : 'FAIL'}\n`);

    // 6. Backdrop/blur effect
    const header = page.locator('header');
    const headerZ = await header.evaluate((el) => window.getComputedStyle(el).zIndex);
    console.log(`[6] BACKDROP/BLUR:`);
    console.log(`    Header z-index: ${headerZ}`);

    // Check for any fixed overlay elements
    const overlays = await page.evaluate(() => {
      const fixed = Array.from(document.querySelectorAll('*')).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.position === 'fixed' && style.zIndex !== 'auto' && parseInt(style.zIndex) > 50;
      });
      return fixed.map((el) => ({
        tag: el.tagName,
        z: window.getComputedStyle(el).zIndex,
        class: el.className.substring(0, 50),
      }));
    });
    console.log(`    Fixed overlays: ${overlays.length}`);
    overlays.forEach((o) => console.log(`      - ${o.tag} z-index:${o.z} class:${o.class}`));
    console.log(`    Status: ${overlays.length > 0 ? 'PASS' : 'FAIL (no overlay)'}\n`);

    // 7. Z-index layering
    const allZIndices = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.zIndex !== 'auto' && style.zIndex !== '0' && style.position !== 'static';
      });
      return elements.slice(0, 20).map((el) => ({
        tag: el.tagName,
        z: window.getComputedStyle(el).zIndex,
        pos: window.getComputedStyle(el).position,
        class: el.className.substring(0, 40),
      }));
    });
    console.log(`[7] Z-INDEX LAYERING:`);
    allZIndices.forEach((el) => {
      console.log(`    ${el.tag} z:${el.z} pos:${el.pos} class:${el.class}`);
    });
    console.log('');

    // 8. Menu panel
    const menuPanel = page.locator('header > div > div > div').last();
    const panelVisible = await menuPanel.isVisible();
    const panelBox = await menuPanel.boundingBox();
    console.log(`[8] MENU PANEL:`);
    console.log(`    Visible: ${panelVisible}`);
    console.log(`    Size: ${panelBox?.width}x${panelBox?.height}`);
    const panelBg = await menuPanel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log(`    Background: ${panelBg}`);
    console.log('');

    console.log('========== END AUDIT ==========\n');
  });
});