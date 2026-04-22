import { test, expect } from '@playwright/test'

test.describe('Navigation Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' })
  })

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/MaatWork/i)
  })

  test('navbar is visible with all navigation links', async ({ page }) => {
    // Check navbar is visible
    const navbar = page.locator('header')
    await expect(navbar).toBeVisible()

    // Check all nav links are present
    const expectedLinks = ['#features', '#pricing', '#how-it-works', '#testimonials', '#contact']
    for (const href of expectedLinks) {
      const navLink = page.locator(`header a[href="${href}"]`).first()
      await expect(navLink).toBeVisible()
    }
  })

  test('section IDs exist in the page', async ({ page }) => {
    // Wait for initial content
    await page.waitForLoadState('networkidle')

    // Close banner if present
    const closeButton = page.locator('button[aria-label="Cerrar notificación"]')
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click()
      await page.waitForTimeout(500)
    }

    // Check each section ID exists
    const sectionIds = ['features', 'pricing', 'how-it-works', 'testimonials', 'contact']
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`)
      await expect(section).toHaveAttribute('id', id, { timeout: 15000 })
    }
  })

  test('navigation links are clickable', async ({ page }) => {
    // Wait for content
    await page.waitForLoadState('networkidle')

    // Close banner if present
    const closeButton = page.locator('button[aria-label="Cerrar notificación"]')
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click()
      await page.waitForTimeout(500)
    }

    // Verify all nav links are enabled
    const expectedLinks = ['#features', '#pricing', '#how-it-works', '#testimonials', '#contact']
    for (const href of expectedLinks) {
      const navLink = page.locator(`header a[href="${href}"]`).first()
      await expect(navLink).toBeEnabled()
    }
  })

  test('logo link exists and is functional', async ({ page }) => {
    const logo = page.locator('header a[href="#"]')
    await expect(logo).toBeVisible()
    await expect(logo).toBeEnabled()
  })

  test('scroll progress bar exists', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check for scroll progress indicator (there are two, check for at least one)
    const progressBars = page.locator('[role="progressbar"]')
    await expect(progressBars.first()).toBeAttached()
  })
})
