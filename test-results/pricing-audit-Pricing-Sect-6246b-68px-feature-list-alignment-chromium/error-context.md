# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricing-audit.spec.ts >> Pricing Section at Tablet 768px >> feature list alignment
- Location: e2e/pricing-audit.spec.ts:59:9

# Error details

```
Error: locator.all: Test ended.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const breakpoints = [
  4  |   { name: 'Mobile 375px', width: 375, height: 812 },
  5  |   { name: 'Tablet 768px', width: 768, height: 1024 },
  6  |   { name: 'Desktop 1024px', width: 1024, height: 768 },
  7  |   { name: 'Large 1440px', width: 1440, height: 900 },
  8  | ]
  9  | 
  10 | for (const bp of breakpoints) {
  11 |   test.describe(`Pricing Section at ${bp.name}`, () => {
  12 |     test.beforeEach(async ({ page }) => {
  13 |       await page.setViewportSize({ width: bp.width, height: bp.height })
  14 |       await page.goto('http://localhost:3000')
  15 |       await page.evaluate(() => {
  16 |         document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant' })
  17 |       })
  18 |       await page.waitForTimeout(500)
  19 |     })
  20 | 
  21 |     test('pricing card layout', async ({ page }) => {
  22 |       const card = page.locator('#pricing .relative.group.spotlight-container').first()
  23 |       await expect(card).toBeVisible()
  24 | 
  25 |       const box = await card.boundingBox()
  26 |       console.log(`${bp.name}: Card bounding box:`, box)
  27 | 
  28 |       // Check card is not overflow
  29 |       const section = page.locator('#pricing')
  30 |       const sectionBox = await section.boundingBox()
  31 |       console.log(`${bp.name}: Section bounding box:`, sectionBox)
  32 |     })
  33 | 
  34 |     test('CTA button touch target', async ({ page }) => {
  35 |       const ctaButton = page.locator('#pricing button:has-text("Solicitar")').first()
  36 |       await expect(ctaButton).toBeVisible()
  37 | 
  38 |       const box = await ctaButton.boundingBox()
  39 |       console.log(`${bp.name}: CTA button bounding box:`, box)
  40 | 
  41 |       // Check minimum 44x44px touch target
  42 |       if (box) {
  43 |         expect(box.width).toBeGreaterThanOrEqual(44)
  44 |         expect(box.height).toBeGreaterThanOrEqual(44)
  45 |       }
  46 |     })
  47 | 
  48 |     test('price text contrast', async ({ page }) => {
  49 |       const priceText = page.locator('#pricing .font-display.text-6xl').first()
  50 |       await expect(priceText).toBeVisible()
  51 | 
  52 |       const color = await priceText.evaluate(el => {
  53 |         const style = window.getComputedStyle(el)
  54 |         return style.color
  55 |       })
  56 |       console.log(`${bp.name}: Price text color:`, color)
  57 |     })
  58 | 
  59 |     test('feature list alignment', async ({ page }) => {
  60 |       const featureList = page.locator('#pricing ul.space-y-4').first()
  61 |       await expect(featureList).toBeVisible()
  62 | 
> 63 |       const items = page.locator('#pricing ul.space-y-4 li').all()
     |                                                              ^ Error: locator.all: Test ended.
  64 |       const count = await items.length
  65 |       console.log(`${bp.name}: Feature list items:`, count)
  66 | 
  67 |       for (let i = 0; i < Math.min(count, 3); i++) {
  68 |         const itemBox = await items[i].boundingBox()
  69 |         console.log(`${bp.name}: Feature item ${i} box:`, itemBox)
  70 |       }
  71 |     })
  72 | 
  73 |     test('toggle buttons accessibility', async ({ page }) => {
  74 |       const toggleGroup = page.locator('[role="group"][aria-label*="facturacion"]')
  75 |       await expect(toggleGroup).toBeVisible()
  76 | 
  77 |       const buttons = page.locator('[role="group"][aria-label*="facturacion"] button').all()
  78 |       for (const button of buttons) {
  79 |         const box = await button.boundingBox()
  80 |         console.log(`${bp.name}: Toggle button:`, box)
  81 |         if (box) {
  82 |           expect(box.height).toBeGreaterThanOrEqual(44)
  83 |         }
  84 |       }
  85 |     })
  86 |   })
  87 | }
  88 | 
```