import { test, expect, Page } from '@playwright/test'

test.describe('Pricing Section Audit', () => {
  const breakpoints = [
    { name: '375px', width: 375, height: 812 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '1440px', width: 1440, height: 900 },
  ]

  for (const bp of breakpoints) {
    test(`${bp.name} - pricing section audit`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })

      // Scroll to pricing section
      await page.evaluate(() => {
        const el = document.querySelector('#pricing')
        if (el) el.scrollIntoView({ behavior: 'instant' })
      })
      await page.waitForTimeout(1500)

      const issues: string[] = []

      // Get pricing section element
      const pricingSection = page.locator('#pricing')
      await expect(pricingSection).toBeVisible()

      // 1. Check for CTA button - look for any button in pricing section with "cotizacion"
      const ctaLocator = page.locator('#pricing button:has-text("cotizacion")').first()
      const ctaVisible = await ctaLocator.isVisible().catch(() => false)
      if (ctaVisible) {
        const ctaBox = await ctaLocator.boundingBox()
        console.log(`CTA button at ${bp.name}:`, ctaBox)
        if (ctaBox && ctaBox.height < 44) {
          issues.push(`CTA button height ${ctaBox.height.toFixed(1)}px < 44px minimum`)
        }
      } else {
        // Maybe it's inside a different structure - check all buttons
        const allButtons = await page.locator('#pricing button').all()
        console.log(`Buttons found at ${bp.name}:`, allButtons.length)
        for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
          const box = await allButtons[i].boundingBox()
          const text = await allButtons[i].textContent()
          console.log(`Button ${i}: box=${JSON.stringify(box)}, text="${text?.trim().substring(0, 50)}"`)
        }
      }

      // 2. Check price display
      const priceDisplay = page.locator('#pricing .font-display').first()
      const priceVisible = await priceDisplay.isVisible().catch(() => false)
      if (priceVisible) {
        const priceBox = await priceDisplay.boundingBox()
        const priceColor = await priceDisplay.evaluate(el => window.getComputedStyle(el).color)
        console.log(`Price display at ${bp.name}: box=${JSON.stringify(priceBox)}, color=${priceColor}`)
      }

      // 3. Check toggle buttons (billing period selector)
      const toggleGroup = page.locator('[role="group"]').first()
      const toggleVisible = await toggleGroup.isVisible().catch(() => false)
      if (toggleVisible) {
        const toggles = await page.locator('[role="group"] button').all()
        console.log(`Toggle buttons at ${bp.name}:`, toggles.length)
        for (let i = 0; i < toggles.length; i++) {
          const box = await toggles[i].boundingBox()
          console.log(`Toggle ${i}: box=${JSON.stringify(box)}`)
        }
      }

      // 4. Check feature list
      const featureList = page.locator('#pricing ul').first()
      const featuresVisible = await featureList.isVisible().catch(() => false)
      if (featuresVisible) {
        const featureItems = await page.locator('#pricing ul li').all()
        console.log(`Feature items at ${bp.name}:`, featureItems.length)
      }

      // 5. Take screenshot
      await page.screenshot({
        path: `e2e/screenshots/pricing-${bp.name.replace(' ', '-')}.png`,
        fullPage: false
      })

      // Report issues
      if (issues.length > 0) {
        console.log(`\nISSUES at ${bp.name}:`)
        issues.forEach(i => console.log(`  - ${i}`))
      }

      // Don't fail test, just report
      expect(true).toBe(true)
    })
  }
})
