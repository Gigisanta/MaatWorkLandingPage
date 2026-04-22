const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Opening page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Take initial screenshot
  await page.screenshot({ path: '/Users/prueba/Desktop/maatwork-web/testimonials-audit-initial.png', fullPage: false });

  // Scroll to testimonials section
  console.log('Scrolling to testimonials section...');
  await page.evaluate(() => {
    const testimonials = document.getElementById('testimonials');
    if (testimonials) {
      testimonials.scrollIntoView({ behavior: 'smooth' });
    }
  });
  await page.waitForTimeout(1500);

  // Take screenshot of testimonials section
  await page.screenshot({ path: '/Users/prueba/Desktop/maatwork-web/testimonials-audit-section.png', fullPage: false });

  // Test 1: Check testimonial card layout at different breakpoints
  console.log('\n=== Testing Responsive Breakpoints ===');

  const breakpoints = [
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 812 },
  ];

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const testimonials = document.getElementById('testimonials');
      if (testimonials) testimonials.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `/Users/prueba/Desktop/maatwork-web/testimonials-audit-${bp.name.toLowerCase()}.png`,
      fullPage: false
    });
    console.log(`  ${bp.name} (${bp.width}x${bp.height}): Screenshot captured`);
  }

  // Test 2: Check avatar image sizing
  console.log('\n=== Checking Avatar Elements ===');
  const avatars = await page.$$eval('[class*="rounded-full"][class*="bg-gradient-to-br"]', els =>
    els.map(el => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height,
        text: el.textContent.trim()
      };
    })
  );
  avatars.forEach((avatar, i) => {
    console.log(`  Avatar ${i + 1}: ${avatar.width}x${avatar.height} (ratio: ${avatar.aspectRatio.toFixed(2)}) - "${avatar.text}"`);
    if (Math.abs(avatar.aspectRatio - 1) > 0.1) {
      console.log(`    WARNING: Avatar ${i + 1} is not circular (aspect ratio should be ~1)`);
    }
  });

  // Test 3: Check star rating display
  console.log('\n=== Checking Star Ratings ===');
  const stars = await page.$$eval('.fill-amber-400', els =>
    els.map(el => ({
      visible: el.getBoundingClientRect().width > 0,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height
    }))
  );
  console.log(`  Found ${stars.length} star elements`);
  const inconsistentStars = stars.filter(s => s.width !== stars[0]?.width || s.height !== stars[0]?.height);
  if (inconsistentStars.length > 0) {
    console.log('  WARNING: Inconsistent star sizes detected');
  }

  // Test 4: Check navigation dots
  console.log('\n=== Checking Navigation Dots ===');
  const dots = await page.$$eval('button[aria-label="Ir al testimonio"]', els =>
    els.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        index: i,
        width: rect.width,
        height: rect.height,
        opacity: style.opacity,
        isVisible: rect.width > 0 && rect.height > 0
      };
    })
  );
  console.log(`  Found ${dots.length} navigation dots`);
  dots.forEach(dot => {
    console.log(`  Dot ${dot.index + 1}: ${dot.width}x${dot.height}, opacity: ${dot.opacity}, visible: ${dot.isVisible}`);
    if (!dot.isVisible) {
      console.log(`    WARNING: Dot ${dot.index + 1} is not visible or has zero dimensions`);
    }
  });

  // Test 5: Check navigation arrows
  console.log('\n=== Checking Navigation Arrows ===');
  const arrows = await page.$$eval('button[aria-label="Anterior"], button[aria-label="Siguiente"]', els =>
    els.map(el => ({
      ariaLabel: el.getAttribute('aria-label'),
      visible: el.getBoundingClientRect().width > 0,
      disabled: el.disabled
    }))
  );
  arrows.forEach(arrow => {
    console.log(`  Arrow "${arrow.ariaLabel}": visible=${arrow.visible}, disabled=${arrow.disabled}`);
  });

  // Test 6: Check quote text contrast
  console.log('\n=== Checking Quote Text Contrast ===');
  const quoteElements = await page.$$eval('blockquote', els =>
    els.map(el => {
      const style = window.getComputedStyle(el);
      return {
        text: el.textContent.substring(0, 50) + '...',
        color: style.color,
        backgroundColor: style.backgroundColor
      };
    })
  );
  quoteElements.forEach((quote, i) => {
    console.log(`  Quote ${i + 1}: color=${quote.color}`);
  });

  // Test 7: Test card hover effects - check if transform styles are applied
  console.log('\n=== Checking Card Transform Styles ===');
  const cards3D = await page.$$eval('[class*="absolute"][class*="left-1/2"]', els =>
    els.map((el, i) => {
      const style = window.getComputedStyle(el);
      return {
        index: i,
        transform: style.transform,
        opacity: style.opacity,
        zIndex: style.zIndex
      };
    })
  );
  console.log(`  Found ${cards3D.length} 3D carousel cards`);
  cards3D.slice(0, 3).forEach(card => {
    console.log(`  Card ${card.index + 1}: transform="${card.transform.substring(0, 50)}...", opacity=${card.opacity}, zIndex=${card.zIndex}`);
  });

  // Test 8: Check for scroll issues within section
  console.log('\n=== Checking Scroll Behavior ===');
  const sectionOverflow = await page.$eval('#testimonials', el => {
    const style = window.getComputedStyle(el);
    return {
      overflow: style.overflow,
      overflowX: style.overflowX,
      overflowY: style.overflowY
    };
  });
  console.log(`  Section overflow: ${JSON.stringify(sectionOverflow)}`);

  // Test 9: Check for text overflow issues in testimonials
  console.log('\n=== Checking Text Overflow ===');
  const textOverflows = await page.$$eval('#testimonials', () => {
    const issues = [];
    const blockquotes = document.querySelectorAll('blockquote');
    blockquotes.forEach((bq, i) => {
      if (bq.scrollWidth > bq.clientWidth) {
        issues.push(`Quote ${i + 1}: text is truncated horizontally`);
      }
    });
    return issues;
  });
  if (textOverflows.length > 0) {
    console.log('  WARNINGS:');
    textOverflows.forEach(w => console.log(`    ${w}`));
  } else {
    console.log('  No horizontal text overflow detected');
  }

  // Test 10: Check glass-premium class availability
  console.log('\n=== Checking CSS Classes ===');
  const glassPremiumExists = await page.evaluate(() => {
    const testEl = document.createElement('div');
    testEl.className = 'glass-premium';
    document.body.appendChild(testEl);
    const style = window.getComputedStyle(testEl);
    const exists = style.background !== 'rgba(0, 0, 0, 0)' || style.backdropFilter !== 'none';
    document.body.removeChild(testEl);
    return exists;
  });
  console.log(`  glass-premium class: ${glassPremiumExists ? 'Applied correctly' : 'NOT APPLIED (no effect)'}`);

  console.log('\n=== Audit Complete ===');
  console.log('Screenshots saved to: /Users/prueba/Desktop/maatwork-web/testimonials-audit-*.png');

  await browser.close();
})();
