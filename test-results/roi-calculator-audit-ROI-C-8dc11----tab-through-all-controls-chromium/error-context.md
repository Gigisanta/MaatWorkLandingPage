# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: roi-calculator-audit.spec.ts >> ROI Calculator Audit >> 4. Keyboard accessibility - tab through all controls
- Location: e2e/roi-calculator-audit.spec.ts:231:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Test source

```ts
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
  206 | 
  207 |       for (let i = 0; i < buttonCount; i++) {
  208 |         const button = buttons.nth(i)
  209 |         const box = await button.boundingBox()
  210 |         const isVisible = await button.isVisible()
  211 | 
  212 |         if (isVisible && box) {
  213 |           // Buttons should be at least 44x44
  214 |           if (box.width < 44 || box.height < 44) {
  215 |             issues.push(`Button ${i + 1} size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum`)
  216 |           }
  217 |         }
  218 |       }
  219 | 
  220 |     } catch (error) {
  221 |       issues.push(`Error checking touch targets: ${error}`)
  222 |     }
  223 | 
  224 |     addResult('Touch target sizes (44x44px minimum)', issues.length === 0, issues)
  225 |     if (issues.length > 0) {
  226 |       console.log('Touch target issues:', issues)
  227 |     }
  228 |     expect(issues.length).toBe(0)
  229 |   })
  230 | 
  231 |   test('4. Keyboard accessibility - tab through all controls', async ({ page }) => {
  232 |     const issues: string[] = []
  233 |     const tabbableItems: string[] = []
  234 | 
  235 |     try {
  236 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  237 | 
  238 |       // Find all tabbable elements
  239 |       const sliders = calculatorSection.locator('[role="slider"]')
  240 |       const buttons = calculatorSection.locator('button')
  241 |       const links = calculatorSection.locator('a')
  242 | 
  243 |       // Put focus on page body first
  244 |       await page.keyboard.press('Tab') // Move away from any current focus
  245 | 
  246 |       // Try to tab through the calculator section
  247 |       let tabCount = 0
  248 |       const maxTabs = 20
  249 | 
  250 |       // Tab through sliders
  251 |       const sliderCount = await sliders.count()
  252 |       for (let i = 0; i < sliderCount; i++) {
  253 |         await page.keyboard.press('Tab')
  254 |         tabCount++
  255 |         const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
  256 |         tabbableItems.push(`Slider: ${focused || 'unknown'}`)
  257 |       }
  258 | 
  259 |       // Tab through buttons
  260 |       const buttonCount = await buttons.count()
  261 |       for (let i = 0; i < buttonCount; i++) {
  262 |         await page.keyboard.press('Tab')
  263 |         tabCount++
  264 |         const focused = await page.evaluate(() => document.activeElement?.textContent?.trim().substring(0, 30))
  265 |         tabbableItems.push(`Button: ${focused || 'unknown'}`)
  266 |       }
  267 | 
  268 |       // Check if sliders can be operated with keyboard
  269 |       const firstSlider = sliders.first()
  270 |       await firstSlider.focus()
  271 |       const isFocused = await firstSlider.evaluate(el => el === document.activeElement)
  272 | 
  273 |       if (!isFocused) {
  274 |         issues.push('Could not focus on slider with keyboard')
  275 |       } else {
  276 |         // Try arrow keys
  277 |         const valueBefore = await firstSlider.getAttribute('aria-valuenow')
  278 |         await page.keyboard.press('ArrowRight')
  279 |         const valueAfter = await firstSlider.getAttribute('aria-valuenow')
  280 | 
  281 |         if (valueBefore === valueAfter) {
  282 |           issues.push('Slider value did not change with ArrowRight key')
  283 |         }
  284 |       }
  285 | 
  286 |     } catch (error) {
  287 |       issues.push(`Error checking keyboard accessibility: ${error}`)
  288 |     }
  289 | 
  290 |     addResult('Keyboard accessibility', issues.length === 0, issues)
  291 |     if (issues.length > 0) {
  292 |       console.log('Keyboard accessibility issues:', issues)
  293 |     }
> 294 |     expect(issues.length).toBe(0)
      |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  295 |   })
  296 | 
  297 |   test('5a. Responsive at 375px (mobile)', async ({ page }) => {
  298 |     const issues: string[] = []
  299 | 
  300 |     try {
  301 |       await page.setViewportSize({ width: 375, height: 812 })
  302 |       await page.waitForTimeout(500)
  303 | 
  304 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  305 |       const box = await calculatorSection.boundingBox()
  306 | 
  307 |       if (box) {
  308 |         // Check for horizontal overflow
  309 |         const viewportWidth = 375
  310 |         if (box.x < 0) {
  311 |           issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 375px`)
  312 |         }
  313 |         if (box.x + box.width > viewportWidth) {
  314 |           issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 375px`)
  315 |         }
  316 |       }
  317 | 
  318 |       // Check that buttons are still visible and properly sized
  319 |       const buttons = calculatorSection.locator('button')
  320 |       const buttonCount = await buttons.count()
  321 |       if (buttonCount > 0) {
  322 |         const firstButton = buttons.first()
  323 |         const isVisible = await firstButton.isVisible()
  324 |         if (!isVisible) {
  325 |           issues.push('Buttons not visible at 375px')
  326 |         }
  327 |       }
  328 | 
  329 |     } catch (error) {
  330 |       issues.push(`Error checking 375px responsive: ${error}`)
  331 |     }
  332 | 
  333 |     addResult('Responsive at 375px (mobile)', issues.length === 0, issues)
  334 |     if (issues.length > 0) {
  335 |       console.log('375px responsive issues:', issues)
  336 |     }
  337 |     expect(issues.length).toBe(0)
  338 |   })
  339 | 
  340 |   test('5b. Responsive at 768px (tablet)', async ({ page }) => {
  341 |     const issues: string[] = []
  342 | 
  343 |     try {
  344 |       await page.setViewportSize({ width: 768, height: 1024 })
  345 |       await page.waitForTimeout(500)
  346 | 
  347 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  348 |       const box = await calculatorSection.boundingBox()
  349 | 
  350 |       if (box) {
  351 |         const viewportWidth = 768
  352 |         if (box.x < 0) {
  353 |           issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 768px`)
  354 |         }
  355 |         if (box.x + box.width > viewportWidth) {
  356 |           issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 768px`)
  357 |         }
  358 |       }
  359 | 
  360 |     } catch (error) {
  361 |       issues.push(`Error checking 768px responsive: ${error}`)
  362 |     }
  363 | 
  364 |     addResult('Responsive at 768px (tablet)', issues.length === 0, issues)
  365 |     if (issues.length > 0) {
  366 |       console.log('768px responsive issues:', issues)
  367 |     }
  368 |     expect(issues.length).toBe(0)
  369 |   })
  370 | 
  371 |   test('5c. Responsive at 1024px (desktop)', async ({ page }) => {
  372 |     const issues: string[] = []
  373 | 
  374 |     try {
  375 |       await page.setViewportSize({ width: 1024, height: 768 })
  376 |       await page.waitForTimeout(500)
  377 | 
  378 |       const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
  379 |       const box = await calculatorSection.boundingBox()
  380 | 
  381 |       if (box) {
  382 |         const viewportWidth = 1024
  383 |         if (box.x < 0) {
  384 |           issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 1024px`)
  385 |         }
  386 |         if (box.x + box.width > viewportWidth) {
  387 |           issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 1024px`)
  388 |         }
  389 |       }
  390 | 
  391 |     } catch (error) {
  392 |       issues.push(`Error checking 1024px responsive: ${error}`)
  393 |     }
  394 | 
```