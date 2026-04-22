import { test, expect, Page } from '@playwright/test'

async function auditPricingSection(page: Page, breakpoint: string, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  // Scroll to pricing section
  await page.evaluate(() => {
    document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant' })
  })
  await page.waitForTimeout(1000)

  const issues: string[] = []

  // Check 1: Pricing card layout
  const card = page.locator('#pricing .relative.group.spotlight-container').first()
  const cardBox = await card.boundingBox()
  const sectionBox = await page.locator('#pricing').boundingBox()

  console.log(`\n=== ${breakpoint} (${width}x${height}) ===`)
  console.log(`Card box:`, cardBox)
  console.log(`Section box:`, sectionBox)

  if (cardBox && sectionBox) {
    // Check if card overflows
    if (cardBox.x + cardBox.width > sectionBox.x + sectionBox.width) {
      issues.push(`[${breakpoint}] Card overflows section width`)
    }

    // Card should be centered
    const cardCenter = cardBox.x + cardBox.width / 2
    const sectionCenter = sectionBox.x + sectionBox.width / 2
    const offset = Math.abs(cardCenter - sectionCenter)
    if (offset > 10) {
      issues.push(`[${breakpoint}] Card not centered (offset: ${offset.toFixed(1)}px)`)
    }

    // Card max-width check
    if (cardBox.width > width - 32) {
      issues.push(`[${breakpoint}] Card takes full width minus padding (OK for mobile)`)
    }
  }

  // Check 2: CTA button touch target
  const ctaButton = page.locator('#pricing .spotlight-container button').filter({ hasText: /Solicitar cotizacion/i }).first()
  const ctaBox = await ctaButton.boundingBox()
  console.log(`CTA button:`, ctaBox)

  if (ctaBox) {
    if (ctaBox.height < 44) {
      issues.push(`[${breakpoint}] CTA button height (${ctaBox.height.toFixed(1)}px) below 44px minimum`)
    }
    if (ctaBox.width < 44) {
      issues.push(`[${breakpoint}] CTA button width (${ctaBox.width.toFixed(1)}px) below 44px minimum`)
    }
  } else {
    issues.push(`[${breakpoint}] CTA button not found`)
  }

  // Check 3: Price text color
  const priceText = page.locator('#pricing .font-display.text-6xl, #pricing .font-display.text-7xl').first()
  const priceColor = await priceText.evaluate(el => window.getComputedStyle(el).color)
  const priceBg = await page.locator('#pricing').evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.backgroundColor
  })
  console.log(`Price color: ${priceColor}, Background: ${priceBg}`)

  // Check contrast - white on dark should be fine
  if (priceColor === 'rgb(255, 255, 255)') {
    console.log(`[${breakpoint}] Price text is white - good contrast on dark background`)
  }

  // Check 4: Toggle buttons
  const toggleButtons = page.locator('#pricing [role="group"] button')
  const toggleCount = await toggleButtons.count()
  console.log(`Toggle buttons: ${toggleCount}`)

  for (let i = 0; i < toggleCount; i++) {
    const btn = toggleButtons.nth(i)
    const btnBox = await btn.boundingBox()
    if (btnBox && btnBox.height < 44) {
      issues.push(`[${breakpoint}] Toggle button ${i} height (${btnBox.height.toFixed(1)}px) below 44px`)
    }
  }

  // Check 5: Feature list items
  const features = page.locator('#pricing ul li').all()
  const featureCount = await page.locator('#pricing ul li').count()
  console.log(`Feature items: ${featureCount}`)

  // Check 6: Trust indicators
  const trustBadges = page.locator('#pricing .trust-badge').all()
  const trustCount = await trustBadges.count()
  console.log(`Trust badges: ${trustCount}`)

  // Check 7: Popular badge
  const popularBadge = page.locator('#pricing .group\\/badge').first()
  const badgeVisible = await popularBadge.isVisible()
  console.log(`Popular badge visible: ${badgeVisible}`)

  // Check 8: Guarantee badge
  const guaranteeBadge = page.locator('#pricing').filter({ hasText: /Garant/i }).first()
  const guaranteeVisible = await guaranteeBadge.isVisible()
  console.log(`Guarantee badge visible: ${guaranteeVisible}`)

  // Screenshot for visual reference
  await page.screenshot({ path: `e2e/screenshots/pricing-${breakpoint.replace(' ', '-')}.png`, fullPage: false })

  return issues
}

test('pricing audit at all breakpoints', async ({ page }) => {
  const allIssues: string[] = []

  // Create screenshots directory
  await page.goto('http://localhost:3000')
  await page.evaluate(() => {
    const dir = document.createElement('div')
    dir.id = 'screenshot-trigger'
    dir.style.display = 'none'
    document.body.appendChild(dir)
  })

  const breakpoints = [
    { name: '375px mobile', width: 375, height: 812 },
    { name: '768px tablet', width: 768, height: 1024 },
    { name: '1024px desktop', width: 1024, height: 768 },
    { name: '1440px large', width: 1440, height: 900 },
  ]

  for (const bp of breakpoints) {
    const issues = await auditPricingSection(page, bp.name, bp.width, bp.height)
    allIssues.push(...issues)
  }

  console.log('\n=== AUDIT SUMMARY ===')
  if (allIssues.length === 0) {
    console.log('No critical issues found')
  } else {
    allIssues.forEach(issue => console.log(`ISSUE: ${issue}`))
  }
})
