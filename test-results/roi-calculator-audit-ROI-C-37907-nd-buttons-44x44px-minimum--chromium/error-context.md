# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roi-calculator-audit.spec.ts >> ROI Calculator Audit >> 3. Touch target sizes on sliders and buttons (44x44px minimum)
- Location: e2e/roi-calculator-audit.spec.ts:157:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 3
```

# Test source

```ts
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
  144 |       }
  145 | 
  146 |     } catch (error) {
  147 |       issues.push(`Error checking results: ${error}`)
  148 |     }
  149 | 
  150 |     addResult('Results display correctly', issues.length === 0, issues)
  151 |     if (issues.length > 0) {
  152 |       console.log('Result display issues:', issues)
  153 |     }
  154 |     expect(issues.length).toBe(0)
  155 |   })
  156 | 
  157 |   test('3. Touch target sizes on sliders and buttons (44x44px minimum)', async ({ page }) => {
  158 |     const issues: string[] = []
  159 | 
  160 |     try {
  161 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  162 | 
  163 |       // Check sliders - the thumb is a child div with w-7 h-7 classes (28x28px)
  164 |       // This is below the 44x44px minimum touch target size
  165 |       const sliders = calculatorSection.locator('[role="slider"]')
  166 |       const sliderCount = await sliders.count()
  167 | 
  168 |       for (let i = 0; i < sliderCount; i++) {
  169 |         const slider = sliders.nth(i)
  170 | 
  171 |         // The thumb is inside the slider and has classes including "rounded-full" and is positioned absolutely
  172 |         // Looking at the code: className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
  173 |         const thumb = slider.locator('div.rounded-full').first()
  174 |         const thumbCount = await thumb.count()
  175 | 
  176 |         if (thumbCount > 0) {
  177 |           const box = await thumb.boundingBox()
  178 |           if (box) {
  179 |             // The thumb is w-7 h-7 = 28x28px, which is below 44x44px minimum (WCAG 2.5.8)
  180 |             if (box.width < 44 || box.height < 44) {
  181 |               issues.push(`Slider ${i + 1} thumb size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum (WCAG 2.5.8 Target Size Minimum)`)
  182 |             }
  183 |           }
  184 |         } else {
  185 |           // Fallback: measure the slider track height
  186 |           const box = await slider.boundingBox()
  187 |           if (box) {
  188 |             // Track height is h-4 = 16px, well below 44px minimum
  189 |             if (box.height < 44) {
  190 |               issues.push(`Slider ${i + 1} track height (${Math.round(box.height)}px) is below 44px minimum`)
  191 |             }
  192 |           }
  193 |         }
  194 |       }
  195 | 
  196 |       // Check buttons
  197 |       const buttons = calculatorSection.locator('button')
  198 |       const buttonCount = await buttons.count()
  199 | 
  200 |       for (let i = 0; i < buttonCount; i++) {
  201 |         const button = buttons.nth(i)
  202 |         const box = await button.boundingBox()
  203 |         const isVisible = await button.isVisible()
  204 | 
  205 |         if (isVisible && box) {
  206 |           // Buttons should be at least 44x44
  207 |           if (box.width < 44 || box.height < 44) {
  208 |             issues.push(`Button ${i + 1} size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum`)
  209 |           }
  210 |         }
  211 |       }
  212 | 
  213 |     } catch (error) {
  214 |       issues.push(`Error checking touch targets: ${error}`)
  215 |     }
  216 | 
  217 |     addResult('Touch target sizes (44x44px minimum)', issues.length === 0, issues)
  218 |     if (issues.length > 0) {
  219 |       console.log('Touch target issues:', issues)
  220 |     }
> 221 |     expect(issues.length).toBe(0)
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  222 |   })
  223 | 
  224 |   test('4. Keyboard accessibility - tab through all controls', async ({ page }) => {
  225 |     const issues: string[] = []
  226 |     const tabbableItems: string[] = []
  227 | 
  228 |     try {
  229 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  230 | 
  231 |       // Find all tabbable elements
  232 |       const sliders = calculatorSection.locator('[role="slider"]')
  233 |       const buttons = calculatorSection.locator('button')
  234 |       const links = calculatorSection.locator('a')
  235 | 
  236 |       // Put focus on page body first
  237 |       await page.keyboard.press('Tab') // Move away from any current focus
  238 | 
  239 |       // Try to tab through the calculator section
  240 |       let tabCount = 0
  241 |       const maxTabs = 20
  242 | 
  243 |       // Tab through sliders
  244 |       const sliderCount = await sliders.count()
  245 |       for (let i = 0; i < sliderCount; i++) {
  246 |         await page.keyboard.press('Tab')
  247 |         tabCount++
  248 |         const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
  249 |         tabbableItems.push(`Slider: ${focused || 'unknown'}`)
  250 |       }
  251 | 
  252 |       // Tab through buttons
  253 |       const buttonCount = await buttons.count()
  254 |       for (let i = 0; i < buttonCount; i++) {
  255 |         await page.keyboard.press('Tab')
  256 |         tabCount++
  257 |         const focused = await page.evaluate(() => document.activeElement?.textContent?.trim().substring(0, 30))
  258 |         tabbableItems.push(`Button: ${focused || 'unknown'}`)
  259 |       }
  260 | 
  261 |       // Check if sliders can be operated with keyboard
  262 |       const firstSlider = sliders.first()
  263 |       await firstSlider.focus()
  264 |       const isFocused = await firstSlider.evaluate(el => el === document.activeElement)
  265 | 
  266 |       if (!isFocused) {
  267 |         issues.push('Could not focus on slider with keyboard')
  268 |       } else {
  269 |         // Try arrow keys
  270 |         const valueBefore = await firstSlider.getAttribute('aria-valuenow')
  271 |         await page.keyboard.press('ArrowRight')
  272 |         const valueAfter = await firstSlider.getAttribute('aria-valuenow')
  273 | 
  274 |         if (valueBefore === valueAfter) {
  275 |           issues.push('Slider value did not change with ArrowRight key')
  276 |         }
  277 |       }
  278 | 
  279 |     } catch (error) {
  280 |       issues.push(`Error checking keyboard accessibility: ${error}`)
  281 |     }
  282 | 
  283 |     addResult('Keyboard accessibility', issues.length === 0, issues)
  284 |     if (issues.length > 0) {
  285 |       console.log('Keyboard accessibility issues:', issues)
  286 |     }
  287 |     expect(issues.length).toBe(0)
  288 |   })
  289 | 
  290 |   test('5a. Responsive at 375px (mobile)', async ({ page }) => {
  291 |     const issues: string[] = []
  292 | 
  293 |     try {
  294 |       await page.setViewportSize({ width: 375, height: 812 })
  295 |       await page.waitForTimeout(500)
  296 | 
  297 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  298 |       const box = await calculatorSection.boundingBox()
  299 | 
  300 |       if (box) {
  301 |         // Check for horizontal overflow
  302 |         const viewportWidth = 375
  303 |         if (box.x < 0) {
  304 |           issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 375px`)
  305 |         }
  306 |         if (box.x + box.width > viewportWidth) {
  307 |           issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 375px`)
  308 |         }
  309 |       }
  310 | 
  311 |       // Check that buttons are still visible and properly sized
  312 |       const buttons = calculatorSection.locator('button')
  313 |       const buttonCount = await buttons.count()
  314 |       if (buttonCount > 0) {
  315 |         const firstButton = buttons.first()
  316 |         const isVisible = await firstButton.isVisible()
  317 |         if (!isVisible) {
  318 |           issues.push('Buttons not visible at 375px')
  319 |         }
  320 |       }
  321 | 
```