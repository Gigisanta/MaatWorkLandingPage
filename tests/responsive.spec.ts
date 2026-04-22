import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

interface ViewportConfig {
  name: string
  width: number
  height: number
}

const viewports: ViewportConfig[] = [
  { name: 'mobile (375x812)', width: 375, height: 812 },
  { name: 'tablet (768x1024)', width: 768, height: 1024 },
  { name: 'desktop (1024x1440)', width: 1024, height: 1440 },
]

for (const viewport of viewports) {
  test.describe(`Viewport: ${viewport.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
    })

    test('no horizontal overflow', async ({ page }) => {
      const body = page.locator('body')
      const bodyWidth = await body.evaluate(el => el.scrollWidth)
      const windowWidth = viewport.width

      const hasHorizontalOverflow = bodyWidth > windowWidth

      if (hasHorizontalOverflow) {
        const overflow = bodyWidth - windowWidth
        console.log(`[${viewport.name}] Horizontal overflow: ${overflow}px`)
      }

      expect(hasHorizontalOverflow, `Horizontal overflow detected: ${bodyWidth}px > ${windowWidth}px`).toBe(false)
    })

    test('touch targets are at least 44x44px', async ({ page }) => {
      const MIN_TOUCH_SIZE = 44

      // Find interactive elements that should be touch targets
      const touchTargets = page.locator('button, a, [role="button"], input, select, textarea')

      const smallTargets: string[] = []

      const count = await touchTargets.count()
      for (let i = 0; i < count; i++) {
        const element = touchTargets.nth(i)
        const isVisible = await element.isVisible().catch(() => false)

        if (!isVisible) continue

        const box = await element.boundingBox().catch(() => null)
        if (!box) continue

        // Skip hidden or transparent elements
        const opacity = await element.evaluate(el => window.getComputedStyle(el).opacity)
        if (opacity === '0') continue

        if (box.width < MIN_TOUCH_SIZE || box.height < MIN_TOUCH_SIZE) {
          const tag = await element.evaluate(el => el.tagName.toLowerCase())
          const classes = await element.evaluate(el => el.className.substring(0, 50))
          smallTargets.push(`${tag}.${classes} (${box.width.toFixed(0)}x${box.height.toFixed(0)})`)
        }
      }

      if (smallTargets.length > 0) {
        console.log(`[${viewport.name}] Small touch targets found:`)
        smallTargets.forEach(t => console.log(`  - ${t}`))
      }

      expect(smallTargets, `Found ${smallTargets.length} touch targets smaller than ${MIN_TOUCH_SIZE}x${MIN_TOUCH_SIZE}px`).toHaveLength(0)
    })

    test('navbar visibility and structure', async ({ page }) => {
      const navbar = page.locator('nav, header, [role="banner"]').first()

      const navbarExists = await navbar.count() > 0

      if (navbarExists) {
        const isVisible = await navbar.isVisible()
        console.log(`[${viewport.name}] Navbar visible: ${isVisible}`)

        if (isVisible) {
          const box = await navbar.boundingBox()
          console.log(`[${viewport.name}] Navbar dimensions: ${box?.width.toFixed(0)}x${box?.height.toFixed(0)}`)
        }
      } else {
        console.log(`[${viewport.name}] No navbar/header found`)
      }

      expect(navbarExists).toBe(true)
    })
  })
}

test('page loads without console errors', async ({ page }) => {
  const errors: string[] = []

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  page.on('pageerror', err => {
    errors.push(err.message)
  })

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  if (errors.length > 0) {
    console.log('Console errors found:')
    errors.forEach(e => console.log(`  - ${e}`))
  }

  expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
})
