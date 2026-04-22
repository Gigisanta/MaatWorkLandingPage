import { test, expect } from '@playwright/test'

test.describe('FAQ Accordion', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', err => {
      console.log(`[Page Error]: ${err.message}`)
    })
  })

  test('should load FAQ section and verify accordion functionality', async ({ page }) => {
    // Navigate to the page and wait for hydration
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    // Wait for the FAQ section to appear
    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible({ timeout: 10000 })

    // Find all accordion trigger buttons
    const accordionButtons = page.locator('#faq button[aria-expanded]')
    const buttonCount = await accordionButtons.count()

    console.log(`Found ${buttonCount} FAQ accordion buttons`)

    // Verify we have the expected number of FAQ items
    expect(buttonCount).toBe(8)

    // Test accordion open/close functionality
    const firstButton = accordionButtons.nth(0)
    const secondButton = accordionButtons.nth(1)

    // Click first - should open
    await firstButton.click()
    await page.waitForTimeout(500)
    expect(await firstButton.getAttribute('aria-expanded')).toBe('true')

    // Click second - first should close, second should open
    await secondButton.click()
    await page.waitForTimeout(500)
    expect(await secondButton.getAttribute('aria-expanded')).toBe('true')
    expect(await firstButton.getAttribute('aria-expanded')).toBe('false')

    // Click second again - should close
    await secondButton.click()
    await page.waitForTimeout(500)
    expect(await secondButton.getAttribute('aria-expanded')).toBe('false')

    console.log('Accordion open/close functionality: WORKING')
  })

  test('should detect duplicate ARIA IDs (BUG)', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible({ timeout: 10000 })

    const accordionButtons = page.locator('#faq button[aria-expanded]')
    const buttonCount = await accordionButtons.count()

    // Collect all IDs
    const ids: string[] = []
    for (let i = 0; i < buttonCount; i++) {
      const id = await accordionButtons.nth(i).getAttribute('id')
      ids.push(id || 'null')
    }

    console.log('Button IDs:', ids)

    // Check for duplicate IDs
    const uniqueIds = new Set(ids)
    if (uniqueIds.size !== ids.length) {
      console.log(`BUG DETECTED: Duplicate IDs found! Unique: ${uniqueIds.size}, Total: ${ids.length}`)
      // This demonstrates the bug - all IDs are the same
      expect(uniqueIds.size).toBe(ids.length) // This will fail, highlighting the bug
    }
  })

  test('should verify all accordion items can be opened', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible({ timeout: 10000 })

    const accordionButtons = page.locator('#faq button[aria-expanded]')
    const buttonCount = await accordionButtons.count()

    // Click each item and verify it opens
    for (let i = 0; i < buttonCount; i++) {
      const button = accordionButtons.nth(i)
      await button.click()
      await page.waitForTimeout(200)

      const expanded = await button.getAttribute('aria-expanded')
      if (expanded !== 'true') {
        console.log(`Item ${i} did not open properly`)
      }
      expect(expanded).toBe('true')
    }

    console.log('All accordion items open correctly')
  })

  test('should not have page errors during FAQ interactions', async ({ page }) => {
    const pageErrors: string[] = []

    page.on('pageerror', err => {
      pageErrors.push(err.message)
    })

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible({ timeout: 10000 })

    const accordionButtons = page.locator('#faq button[aria-expanded]')
    const buttonCount = await accordionButtons.count()

    // Click several FAQ items
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      await accordionButtons.nth(i).click()
      await page.waitForTimeout(300)
    }

    expect(pageErrors.length).toBe(0)
    console.log('No page errors during FAQ interactions')
  })
})
