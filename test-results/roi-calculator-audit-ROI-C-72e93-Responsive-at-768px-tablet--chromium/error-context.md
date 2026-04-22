# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roi-calculator-audit.spec.ts >> ROI Calculator Audit >> 5b. Responsive at 768px (tablet)
- Location: e2e/roi-calculator-audit.spec.ts:333:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
    - locator resolved to visible <section class="relative py-24 px-6 lg:px-12 overflow-hidden">…</section>

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test'
  2   | 
  3   | /**
  4   |  * ROI Calculator Audit Tests
  5   |  *
  6   |  * Checks:
  7   |  * 1. Calculator inputs are properly labeled
  8   |  * 2. Results display correctly
  9   |  * 3. Touch target sizes on sliders and buttons (44x44px minimum)
  10  |  * 4. Keyboard accessibility - tab through all controls
  11  |  * 5. Responsive at 375px, 768px, 1024px
  12  |  * 6. No layout overflow or scrolling issues
  13  |  */
  14  | 
  15  | const ROI_CALCULATORSelectors = {
  16  |   section: 'section',
  17  |   sliders: '[role="slider"]',
  18  |   buttons: 'button',
  19  |   labels: 'label',
  20  |   results: '.font-display',
  21  | }
  22  | 
  23  | interface AuditResult {
  24  |   test: string
  25  |   passed: boolean
  26  |   issues: string[]
  27  | }
  28  | 
  29  | // Track all audit results
  30  | const auditResults: AuditResult[] = []
  31  | 
  32  | function addResult(test: string, passed: boolean, issues: string[]) {
  33  |   auditResults.push({ test, passed, issues })
  34  | }
  35  | 
  36  | test.describe('ROI Calculator Audit', () => {
  37  |   test.beforeEach(async ({ page }) => {
  38  |     // Navigate to the page with ROI calculator
  39  |     await page.goto('/', { waitUntil: 'networkidle' })
  40  | 
  41  |     // Scroll to the ROI calculator section
  42  |     const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
> 43  |     await calculatorSection.scrollIntoViewIfNeeded()
      |                             ^ Error: locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exceeded.
  44  |     await page.waitForTimeout(1000) // Wait for animations
  45  |   })
  46  | 
  47  |   test('1. Calculator inputs are properly labeled', async ({ page }) => {
  48  |     const issues: string[] = []
  49  | 
  50  |     try {
  51  |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  52  | 
  53  |       // Check for sliders with proper aria-label
  54  |       const sliders = calculatorSection.locator('[role="slider"]')
  55  |       const sliderCount = await sliders.count()
  56  | 
  57  |       if (sliderCount === 0) {
  58  |         issues.push('No sliders found with role="slider"')
  59  |       } else {
  60  |         for (let i = 0; i < sliderCount; i++) {
  61  |           const slider = sliders.nth(i)
  62  |           const ariaLabel = await slider.getAttribute('aria-label')
  63  |           const ariaValueNow = await slider.getAttribute('aria-valuenow')
  64  |           const ariaValueMin = await slider.getAttribute('aria-valuemin')
  65  |           const ariaValueMax = await slider.getAttribute('aria-valuemax')
  66  | 
  67  |           if (!ariaLabel) {
  68  |             issues.push(`Slider ${i + 1} is missing aria-label`)
  69  |           }
  70  |           if (!ariaValueNow) {
  71  |             issues.push(`Slider ${i + 1} is missing aria-valuenow`)
  72  |           }
  73  |           if (!ariaValueMin) {
  74  |             issues.push(`Slider ${i + 1} is missing aria-valuemin`)
  75  |           }
  76  |           if (!ariaValueMax) {
  77  |             issues.push(`Slider ${i + 1} is missing aria-valuemax`)
  78  |           }
  79  |         }
  80  |       }
  81  | 
  82  |       // Check for labeled text inputs
  83  |       const labels = calculatorSection.locator('label')
  84  |       const labelCount = await labels.count()
  85  | 
  86  |       if (labelCount === 0) {
  87  |         issues.push('No labels found for inputs')
  88  |       }
  89  | 
  90  |       // Check that the main value display is present
  91  |       const valueDisplay = calculatorSection.locator('.font-display').filter({ hasText: /\$/ }).first()
  92  |       const valueDisplayCount = await valueDisplay.count()
  93  |       if (valueDisplayCount === 0) {
  94  |         issues.push('No monetary value display found')
  95  |       }
  96  | 
  97  |     } catch (error) {
  98  |       issues.push(`Error checking labels: ${error}`)
  99  |     }
  100 | 
  101 |     addResult('Calculator inputs properly labeled', issues.length === 0, issues)
  102 |     if (issues.length > 0) {
  103 |       console.log('Label issues:', issues)
  104 |     }
  105 |     expect(issues.length).toBe(0)
  106 |   })
  107 | 
  108 |   test('2. Results display correctly', async ({ page }) => {
  109 |     const issues: string[] = []
  110 | 
  111 |     try {
  112 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  113 | 
  114 |       // Find the main result display
  115 |       const resultDisplays = calculatorSection.locator('.font-display')
  116 |       const count = await resultDisplays.count()
  117 | 
  118 |       if (count < 2) {
  119 |         issues.push(`Expected at least 2 result displays (monthly and yearly), found ${count}`)
  120 |       }
  121 | 
  122 |       // Check that the main savings value is visible
  123 |       const mainValue = calculatorSection.getByText(/\$[0-9,]+/).first()
  124 |       await expect(mainValue).toBeVisible()
  125 | 
  126 |       // Check for percentage efficiency indicator
  127 |       const efficiencyIndicator = calculatorSection.getByText(/\+85%/).first()
  128 |       const efficiencyVisible = await efficiencyIndicator.isVisible().catch(() => false)
  129 | 
  130 |       if (!efficiencyVisible) {
  131 |         // Try alternative text
  132 |         const altEfficiency = calculatorSection.getByText(/\+[0-9]+%/).first()
  133 |         const altVisible = await altEfficiency.isVisible().catch(() => false)
  134 |         if (!altVisible) {
  135 |           issues.push('Efficiency percentage indicator not found')
  136 |         }
  137 |       }
  138 | 
  139 |       // Check for before/after comparison
  140 |       const beforeAfter = calculatorSection.getByText(/Antes|Despues/).first()
  141 |       const beforeAfterVisible = await beforeAfter.isVisible().catch(() => false)
  142 |       if (!beforeAfterVisible) {
  143 |         issues.push('Before/After comparison not found')
```