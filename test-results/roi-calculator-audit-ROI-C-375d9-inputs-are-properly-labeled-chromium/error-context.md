# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roi-calculator-audit.spec.ts >> ROI Calculator Audit >> 1. Calculator inputs are properly labeled
- Location: e2e/roi-calculator-audit.spec.ts:43:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Test source

```ts
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
  39  |     await page.goto('/', { waitUntil: 'domcontentloaded' })
  40  |     await page.waitForTimeout(2000) // Wait for page to load and render
  41  |   })
  42  | 
  43  |   test('1. Calculator inputs are properly labeled', async ({ page }) => {
  44  |     const issues: string[] = []
  45  | 
  46  |     try {
  47  |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  48  | 
  49  |       // Wait for the section to be visible and stable
  50  |       await calculatorSection.waitFor({ state: 'visible', timeout: 10000 })
  51  |       await page.waitForTimeout(1000) // Additional wait for animations
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
> 105 |     expect(issues.length).toBe(0)
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  106 |   })
  107 | 
  108 |   test('2. Results display correctly', async ({ page }) => {
  109 |     const issues: string[] = []
  110 | 
  111 |     try {
  112 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  113 | 
  114 |       // Wait for the section to be visible and stable
  115 |       await calculatorSection.waitFor({ state: 'visible', timeout: 10000 })
  116 |       await page.waitForTimeout(1000) // Additional wait for animations
  117 | 
  118 |       // Find the main result display
  119 |       const resultDisplays = calculatorSection.locator('.font-display')
  120 |       const count = await resultDisplays.count()
  121 | 
  122 |       if (count < 2) {
  123 |         issues.push(`Expected at least 2 result displays (monthly and yearly), found ${count}`)
  124 |       }
  125 | 
  126 |       // Check that the main savings value is visible
  127 |       const mainValue = calculatorSection.getByText(/\$[0-9,]+/).first()
  128 |       const mainValueVisible = await mainValue.isVisible().catch(() => false)
  129 |       if (!mainValueVisible) {
  130 |         issues.push('Main savings value not visible')
  131 |       }
  132 | 
  133 |       // Check for percentage efficiency indicator
  134 |       const efficiencyIndicator = calculatorSection.getByText(/\+85%/).first()
  135 |       const efficiencyVisible = await efficiencyIndicator.isVisible().catch(() => false)
  136 | 
  137 |       if (!efficiencyVisible) {
  138 |         // Try alternative text
  139 |         const altEfficiency = calculatorSection.getByText(/\+[0-9]+%/).first()
  140 |         const altVisible = await altEfficiency.isVisible().catch(() => false)
  141 |         if (!altVisible) {
  142 |           issues.push('Efficiency percentage indicator not found')
  143 |         }
  144 |       }
  145 | 
  146 |       // Check for before/after comparison
  147 |       const beforeAfter = calculatorSection.getByText(/Antes|Despues/).first()
  148 |       const beforeAfterVisible = await beforeAfter.isVisible().catch(() => false)
  149 |       if (!beforeAfterVisible) {
  150 |         issues.push('Before/After comparison not found')
  151 |       }
  152 | 
  153 |     } catch (error) {
  154 |       issues.push(`Error checking results: ${error}`)
  155 |     }
  156 | 
  157 |     addResult('Results display correctly', issues.length === 0, issues)
  158 |     if (issues.length > 0) {
  159 |       console.log('Result display issues:', issues)
  160 |     }
  161 |     expect(issues.length).toBe(0)
  162 |   })
  163 | 
  164 |   test('3. Touch target sizes on sliders and buttons (44x44px minimum)', async ({ page }) => {
  165 |     const issues: string[] = []
  166 | 
  167 |     try {
  168 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  169 | 
  170 |       // Check sliders - the thumb is a child div with w-7 h-7 classes (28x28px)
  171 |       // This is below the 44x44px minimum touch target size
  172 |       const sliders = calculatorSection.locator('[role="slider"]')
  173 |       const sliderCount = await sliders.count()
  174 | 
  175 |       for (let i = 0; i < sliderCount; i++) {
  176 |         const slider = sliders.nth(i)
  177 | 
  178 |         // The thumb is inside the slider and has classes including "rounded-full" and is positioned absolutely
  179 |         // Looking at the code: className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
  180 |         const thumb = slider.locator('div.rounded-full').first()
  181 |         const thumbCount = await thumb.count()
  182 | 
  183 |         if (thumbCount > 0) {
  184 |           const box = await thumb.boundingBox()
  185 |           if (box) {
  186 |             // The thumb is w-7 h-7 = 28x28px, which is below 44x44px minimum (WCAG 2.5.8)
  187 |             if (box.width < 44 || box.height < 44) {
  188 |               issues.push(`Slider ${i + 1} thumb size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum (WCAG 2.5.8 Target Size Minimum)`)
  189 |             }
  190 |           }
  191 |         } else {
  192 |           // Fallback: measure the slider track height
  193 |           const box = await slider.boundingBox()
  194 |           if (box) {
  195 |             // Track height is h-4 = 16px, well below 44px minimum
  196 |             if (box.height < 44) {
  197 |               issues.push(`Slider ${i + 1} track height (${Math.round(box.height)}px) is below 44px minimum`)
  198 |             }
  199 |           }
  200 |         }
  201 |       }
  202 | 
  203 |       // Check buttons
  204 |       const buttons = calculatorSection.locator('button')
  205 |       const buttonCount = await buttons.count()
```