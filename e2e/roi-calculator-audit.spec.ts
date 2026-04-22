import { test, expect, Page } from '@playwright/test'

/**
 * ROI Calculator Audit Tests
 *
 * Checks:
 * 1. Calculator inputs are properly labeled
 * 2. Results display correctly
 * 3. Touch target sizes on sliders and buttons (44x44px minimum)
 * 4. Keyboard accessibility - tab through all controls
 * 5. Responsive at 375px, 768px, 1024px
 * 6. No layout overflow or scrolling issues
 */

const ROI_CALCULATORSelectors = {
  section: 'section',
  sliders: '[role="slider"]',
  buttons: 'button',
  labels: 'label',
  results: '.font-display',
}

interface AuditResult {
  test: string
  passed: boolean
  issues: string[]
}

// Track all audit results
const auditResults: AuditResult[] = []

function addResult(test: string, passed: boolean, issues: string[]) {
  auditResults.push({ test, passed, issues })
}

test.describe('ROI Calculator Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page with ROI calculator
    await page.goto('/', { waitUntil: 'networkidle' })

    // Scroll to the ROI calculator section
    const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
    await calculatorSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000) // Wait for animations
  })

  test('1. Calculator inputs are properly labeled', async ({ page }) => {
    const issues: string[] = []

    try {
      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()

      // Check for sliders with proper aria-label
      const sliders = calculatorSection.locator('[role="slider"]')
      const sliderCount = await sliders.count()

      if (sliderCount === 0) {
        issues.push('No sliders found with role="slider"')
      } else {
        for (let i = 0; i < sliderCount; i++) {
          const slider = sliders.nth(i)
          const ariaLabel = await slider.getAttribute('aria-label')
          const ariaValueNow = await slider.getAttribute('aria-valuenow')
          const ariaValueMin = await slider.getAttribute('aria-valuemin')
          const ariaValueMax = await slider.getAttribute('aria-valuemax')

          if (!ariaLabel) {
            issues.push(`Slider ${i + 1} is missing aria-label`)
          }
          if (!ariaValueNow) {
            issues.push(`Slider ${i + 1} is missing aria-valuenow`)
          }
          if (!ariaValueMin) {
            issues.push(`Slider ${i + 1} is missing aria-valuemin`)
          }
          if (!ariaValueMax) {
            issues.push(`Slider ${i + 1} is missing aria-valuemax`)
          }
        }
      }

      // Check for labeled text inputs
      const labels = calculatorSection.locator('label')
      const labelCount = await labels.count()

      if (labelCount === 0) {
        issues.push('No labels found for inputs')
      }

      // Check that the main value display is present
      const valueDisplay = calculatorSection.locator('.font-display').filter({ hasText: /\$/ }).first()
      const valueDisplayCount = await valueDisplay.count()
      if (valueDisplayCount === 0) {
        issues.push('No monetary value display found')
      }

    } catch (error) {
      issues.push(`Error checking labels: ${error}`)
    }

    addResult('Calculator inputs properly labeled', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('Label issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('2. Results display correctly', async ({ page }) => {
    const issues: string[] = []

    try {
      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()

      // Find the main result display
      const resultDisplays = calculatorSection.locator('.font-display')
      const count = await resultDisplays.count()

      if (count < 2) {
        issues.push(`Expected at least 2 result displays (monthly and yearly), found ${count}`)
      }

      // Check that the main savings value is visible
      const mainValue = calculatorSection.getByText(/\$[0-9,]+/).first()
      await expect(mainValue).toBeVisible()

      // Check for percentage efficiency indicator
      const efficiencyIndicator = calculatorSection.getByText(/\+85%/).first()
      const efficiencyVisible = await efficiencyIndicator.isVisible().catch(() => false)

      if (!efficiencyVisible) {
        // Try alternative text
        const altEfficiency = calculatorSection.getByText(/\+[0-9]+%/).first()
        const altVisible = await altEfficiency.isVisible().catch(() => false)
        if (!altVisible) {
          issues.push('Efficiency percentage indicator not found')
        }
      }

      // Check for before/after comparison
      const beforeAfter = calculatorSection.getByText(/Antes|Despues/).first()
      const beforeAfterVisible = await beforeAfter.isVisible().catch(() => false)
      if (!beforeAfterVisible) {
        issues.push('Before/After comparison not found')
      }

    } catch (error) {
      issues.push(`Error checking results: ${error}`)
    }

    addResult('Results display correctly', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('Result display issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('3. Touch target sizes on sliders and buttons (44x44px minimum)', async ({ page }) => {
    const issues: string[] = []

    try {
      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()

      // Check sliders - the thumb is a child div with w-7 h-7 classes (28x28px)
      // This is below the 44x44px minimum touch target size
      const sliders = calculatorSection.locator('[role="slider"]')
      const sliderCount = await sliders.count()

      for (let i = 0; i < sliderCount; i++) {
        const slider = sliders.nth(i)

        // The thumb is inside the slider and has classes including "rounded-full" and is positioned absolutely
        // Looking at the code: className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full"
        const thumb = slider.locator('div.rounded-full').first()
        const thumbCount = await thumb.count()

        if (thumbCount > 0) {
          const box = await thumb.boundingBox()
          if (box) {
            // The thumb is w-7 h-7 = 28x28px, which is below 44x44px minimum (WCAG 2.5.8)
            if (box.width < 44 || box.height < 44) {
              issues.push(`Slider ${i + 1} thumb size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum (WCAG 2.5.8 Target Size Minimum)`)
            }
          }
        } else {
          // Fallback: measure the slider track height
          const box = await slider.boundingBox()
          if (box) {
            // Track height is h-4 = 16px, well below 44px minimum
            if (box.height < 44) {
              issues.push(`Slider ${i + 1} track height (${Math.round(box.height)}px) is below 44px minimum`)
            }
          }
        }
      }

      // Check buttons
      const buttons = calculatorSection.locator('button')
      const buttonCount = await buttons.count()

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        const box = await button.boundingBox()
        const isVisible = await button.isVisible()

        if (isVisible && box) {
          // Buttons should be at least 44x44
          if (box.width < 44 || box.height < 44) {
            issues.push(`Button ${i + 1} size (${Math.round(box.width)}x${Math.round(box.height)}) is below 44x44px minimum`)
          }
        }
      }

    } catch (error) {
      issues.push(`Error checking touch targets: ${error}`)
    }

    addResult('Touch target sizes (44x44px minimum)', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('Touch target issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('4. Keyboard accessibility - tab through all controls', async ({ page }) => {
    const issues: string[] = []
    const tabbableItems: string[] = []

    try {
      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()

      // Find all tabbable elements
      const sliders = calculatorSection.locator('[role="slider"]')
      const buttons = calculatorSection.locator('button')
      const links = calculatorSection.locator('a')

      // Put focus on page body first
      await page.keyboard.press('Tab') // Move away from any current focus

      // Try to tab through the calculator section
      let tabCount = 0
      const maxTabs = 20

      // Tab through sliders
      const sliderCount = await sliders.count()
      for (let i = 0; i < sliderCount; i++) {
        await page.keyboard.press('Tab')
        tabCount++
        const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
        tabbableItems.push(`Slider: ${focused || 'unknown'}`)
      }

      // Tab through buttons
      const buttonCount = await buttons.count()
      for (let i = 0; i < buttonCount; i++) {
        await page.keyboard.press('Tab')
        tabCount++
        const focused = await page.evaluate(() => document.activeElement?.textContent?.trim().substring(0, 30))
        tabbableItems.push(`Button: ${focused || 'unknown'}`)
      }

      // Check if sliders can be operated with keyboard
      const firstSlider = sliders.first()
      await firstSlider.focus()
      const isFocused = await firstSlider.evaluate(el => el === document.activeElement)

      if (!isFocused) {
        issues.push('Could not focus on slider with keyboard')
      } else {
        // Try arrow keys
        const valueBefore = await firstSlider.getAttribute('aria-valuenow')
        await page.keyboard.press('ArrowRight')
        const valueAfter = await firstSlider.getAttribute('aria-valuenow')

        if (valueBefore === valueAfter) {
          issues.push('Slider value did not change with ArrowRight key')
        }
      }

    } catch (error) {
      issues.push(`Error checking keyboard accessibility: ${error}`)
    }

    addResult('Keyboard accessibility', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('Keyboard accessibility issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('5a. Responsive at 375px (mobile)', async ({ page }) => {
    const issues: string[] = []

    try {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.waitForTimeout(500)

      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
      const box = await calculatorSection.boundingBox()

      if (box) {
        // Check for horizontal overflow
        const viewportWidth = 375
        if (box.x < 0) {
          issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 375px`)
        }
        if (box.x + box.width > viewportWidth) {
          issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 375px`)
        }
      }

      // Check that buttons are still visible and properly sized
      const buttons = calculatorSection.locator('button')
      const buttonCount = await buttons.count()
      if (buttonCount > 0) {
        const firstButton = buttons.first()
        const isVisible = await firstButton.isVisible()
        if (!isVisible) {
          issues.push('Buttons not visible at 375px')
        }
      }

    } catch (error) {
      issues.push(`Error checking 375px responsive: ${error}`)
    }

    addResult('Responsive at 375px (mobile)', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('375px responsive issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('5b. Responsive at 768px (tablet)', async ({ page }) => {
    const issues: string[] = []

    try {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(500)

      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
      const box = await calculatorSection.boundingBox()

      if (box) {
        const viewportWidth = 768
        if (box.x < 0) {
          issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 768px`)
        }
        if (box.x + box.width > viewportWidth) {
          issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 768px`)
        }
      }

    } catch (error) {
      issues.push(`Error checking 768px responsive: ${error}`)
    }

    addResult('Responsive at 768px (tablet)', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('768px responsive issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('5c. Responsive at 1024px (desktop)', async ({ page }) => {
    const issues: string[] = []

    try {
      await page.setViewportSize({ width: 1024, height: 768 })
      await page.waitForTimeout(500)

      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()
      const box = await calculatorSection.boundingBox()

      if (box) {
        const viewportWidth = 1024
        if (box.x < 0) {
          issues.push(`Section extends ${Math.abs(box.x)}px beyond left viewport at 1024px`)
        }
        if (box.x + box.width > viewportWidth) {
          issues.push(`Section extends ${(box.x + box.width) - viewportWidth}px beyond right viewport at 1024px`)
        }
      }

    } catch (error) {
      issues.push(`Error checking 1024px responsive: ${error}`)
    }

    addResult('Responsive at 1024px (desktop)', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('1024px responsive issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  test('6. No layout overflow or scrolling issues', async ({ page }) => {
    const issues: string[] = []

    try {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.waitForTimeout(500)

      const calculatorSection = page.locator('section').filter({ hasText: /Calculadora de ROI|ahorraras/ }).first()

      // Check if section causes horizontal scroll
      const bodyOverflow = await page.evaluate(() => {
        return {
          scrollWidth: document.body.scrollWidth,
          innerWidth: window.innerWidth,
          scrollLeft: window.scrollX
        }
      })

      if (bodyOverflow.scrollWidth > bodyOverflow.innerWidth) {
        const overflow = bodyOverflow.scrollWidth - bodyOverflow.innerWidth
        issues.push(`Body has horizontal overflow of ${overflow}px`)
      }

      // Check for element overflow within the calculator
      const hasOverflow = await calculatorSection.evaluate((el) => {
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        return {
          hasHorizontalOverflow: el.scrollWidth > el.clientWidth,
          hasVerticalOverflow: el.scrollHeight > el.clientHeight,
          computedOverflowX: style.overflowX,
          computedOverflowY: style.overflowY
        }
      })

      if (hasOverflow.hasHorizontalOverflow) {
        issues.push('Calculator section has horizontal overflow')
      }
      if (hasOverflow.hasVerticalOverflow) {
        issues.push('Calculator section has vertical overflow')
      }

    } catch (error) {
      issues.push(`Error checking overflow: ${error}`)
    }

    addResult('No layout overflow or scrolling issues', issues.length === 0, issues)
    if (issues.length > 0) {
      console.log('Overflow issues:', issues)
    }
    expect(issues.length).toBe(0)
  })

  // Print summary after all tests
  test.afterAll(async () => {
    console.log('\n========== ROI CALCULATOR AUDIT SUMMARY ==========')
    console.log(`Total tests: ${auditResults.length}`)
    console.log(`Passed: ${auditResults.filter(r => r.passed).length}`)
    console.log(`Failed: ${auditResults.filter(r => !r.passed).length}`)
    console.log('\nDetailed results:')
    auditResults.forEach(result => {
      const status = result.passed ? 'PASS' : 'FAIL'
      console.log(`  [${status}] ${result.test}`)
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          console.log(`    - ${issue}`)
        })
      }
    })
    console.log('=================================================\n')
  })
})