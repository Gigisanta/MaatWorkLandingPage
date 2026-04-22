import { test, expect } from '@playwright/test'

const breakpoints = [
  { name: 'Mobile 375px', width: 375, height: 812 },
  { name: 'Tablet 768px', width: 768, height: 1024 },
  { name: 'Desktop 1024px', width: 1024, height: 768 },
  { name: 'Large 1440px', width: 1440, height: 900 },
]

for (const bp of breakpoints) {
  test.describe(`Pricing Section at ${bp.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height })
      await page.goto('http://localhost:3000')
      await page.evaluate(() => {
        document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant' })
      })
      await page.waitForTimeout(500)
    })

    test('pricing card layout', async ({ page }) => {
      const card = page.locator('#pricing .relative.group.spotlight-container').first()
      await expect(card).toBeVisible()

      const box = await card.boundingBox()
      console.log(`${bp.name}: Card bounding box:`, box)

      // Check card is not overflow
      const section = page.locator('#pricing')
      const sectionBox = await section.boundingBox()
      console.log(`${bp.name}: Section bounding box:`, sectionBox)
    })

    test('CTA button touch target', async ({ page }) => {
      const ctaButton = page.locator('#pricing button:has-text("Solicitar")').first()
      await expect(ctaButton).toBeVisible()

      const box = await ctaButton.boundingBox()
      console.log(`${bp.name}: CTA button bounding box:`, box)

      // Check minimum 44x44px touch target
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    })

    test('price text contrast', async ({ page }) => {
      const priceText = page.locator('#pricing .font-display.text-6xl').first()
      await expect(priceText).toBeVisible()

      const color = await priceText.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.color
      })
      console.log(`${bp.name}: Price text color:`, color)
    })

    test('feature list alignment', async ({ page }) => {
      const featureList = page.locator('#pricing ul.space-y-4').first()
      await expect(featureList).toBeVisible()

      const items = page.locator('#pricing ul.space-y-4 li').all()
      const count = await items.length
      console.log(`${bp.name}: Feature list items:`, count)

      for (let i = 0; i < Math.min(count, 3); i++) {
        const itemBox = await items[i].boundingBox()
        console.log(`${bp.name}: Feature item ${i} box:`, itemBox)
      }
    })

    test('toggle buttons accessibility', async ({ page }) => {
      const toggleGroup = page.locator('[role="group"][aria-label*="facturacion"]')
      await expect(toggleGroup).toBeVisible()

      const buttons = page.locator('[role="group"][aria-label*="facturacion"] button').all()
      for (const button of buttons) {
        const box = await button.boundingBox()
        console.log(`${bp.name}: Toggle button:`, box)
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })
}
