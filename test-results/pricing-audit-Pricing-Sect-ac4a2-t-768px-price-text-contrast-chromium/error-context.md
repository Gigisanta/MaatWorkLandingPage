# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pricing-audit.spec.ts >> Pricing Section at Tablet 768px >> price text contrast
- Location: e2e/pricing-audit.spec.ts:48:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pricing .font-display.text-6xl').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pricing .font-display.text-6xl').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - progressbar "Page scroll progress" [ref=e5]
  - main [ref=e7]:
    - main [ref=e8]:
      - progressbar "Scroll progress":
        - generic:
          - generic:
            - generic: Testimonios
      - generic:
        - generic:
          - img
          - generic: 3 min de lectura
      - generic [ref=e13]:
        - navigation [ref=e14]:
          - link "MaatWork - Volver al inicio" [ref=e15] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e16]: MaatWork
          - generic [ref=e19]:
            - button "Probar gratis" [ref=e20]:
              - generic [ref=e21]: Probar gratis
            - button "Reservar lugar" [ref=e22]:
              - generic [ref=e23]: Reservar lugar
            - button "Menu" [ref=e24] [cursor=pointer]
        - generic [ref=e29]:
          - link "Características" [ref=e30] [cursor=pointer]:
            - /url: "#features"
            - generic [ref=e31]: Características
          - link "Precios" [ref=e33] [cursor=pointer]:
            - /url: "#pricing"
            - generic [ref=e34]: Precios
          - link "Cómo funciona" [ref=e36] [cursor=pointer]:
            - /url: "#how-it-works"
            - generic [ref=e37]: Cómo funciona
          - link "Testimonios" [ref=e39] [cursor=pointer]:
            - /url: "#testimonials"
            - generic [ref=e40]: Testimonios
          - link "Contacto" [ref=e42] [cursor=pointer]:
            - /url: "#contact"
            - generic [ref=e43]: Contacto
          - button "Probar gratis" [ref=e46]:
            - generic [ref=e47]: Probar gratis
      - generic [ref=e58]:
        - generic [ref=e59] [cursor=pointer]:
          - img [ref=e61]
          - generic [ref=e63]:
            - img [ref=e64]
            - text: Beta
        - paragraph [ref=e67]: Primeras 5 apps con precio especial de lanzamiento — cupos limitados
        - generic [ref=e68]:
          - generic [ref=e69]: "Termina en:"
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: "07"
              - generic [ref=e74]: d
            - generic [ref=e75]:
              - generic [ref=e76]: "12"
              - generic [ref=e78]: h
            - generic [ref=e79]:
              - generic [ref=e80]: "31"
              - generic [ref=e82]: m
            - generic [ref=e83]:
              - generic [ref=e84]: "21"
              - generic [ref=e86]: s
        - link "Reservar tu lugar con precio de lanzamiento" [ref=e87] [cursor=pointer]:
          - /url: "#pricing"
          - generic [ref=e89]: Reservar
          - generic [ref=e90]: →
        - button "Cerrar notificación" [ref=e91]:
          - img [ref=e92]
      - generic [ref=e96]:
        - status "Cargando fondo 3D..." [ref=e97]
        - status "Cargando escena 3D..."
        - generic:
          - generic:
            - img
          - generic:
            - img
          - generic:
            - img
          - generic:
            - img
        - generic [ref=e106]:
          - generic [ref=e107]:
            - generic [ref=e109]: Apps para negocios argentinos
            - heading "Deja de perder tiempo automatizando tu local. Hoy." [level=1] [ref=e111]:
              - generic [ref=e112]: Deja de perder tiempo
              - generic [ref=e114]: automatizando tu local.
              - generic [ref=e115]: Hoy.
            - paragraph [ref=e116]: La única plataforma que desarrolla tu app personalizada en 7-14 días. Clientes, cobros, turnos y WhatsApp automático — sin que vos hagas nada.
            - generic [ref=e117]:
              - generic [ref=e120]:
                - img [ref=e121]
                - text: 4.9★ Rating
              - generic [ref=e125]:
                - img [ref=e126]
                - text: 500+ Apps
              - button "Proba gratis 7 dias" [ref=e128] [cursor=pointer]:
                - generic [ref=e129]:
                  - text: Proba gratis 7 dias
                  - img [ref=e130]
              - button "Sin tarjeta · Sin compromiso" [ref=e132] [cursor=pointer]:
                - generic [ref=e133]: Sin tarjeta · Sin compromiso
            - generic [ref=e134]:
              - generic [ref=e135]:
                - generic [ref=e138]: 14-
                - generic [ref=e139]: Dias para tu app
              - generic [ref=e140]:
                - generic [ref=e143]: 3+
                - generic [ref=e144]: Rubros activos
              - generic [ref=e145]:
                - generic [ref=e146]: 24/7
                - generic [ref=e147]: Automatizacion
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e151]: Natatorio
              - generic [ref=e152]: Grupos de Natacion · 42/50 asistentes
            - generic [ref=e153]:
              - generic [ref=e155]: Peluqueria
              - generic [ref=e156]: 15:30 Corte & Barba · 16:15 Color
            - generic [ref=e157]:
              - generic [ref=e159]: Academia
              - generic [ref=e160]: 128 Alumnos Activos
      - generic:
        - img
        - img
      - generic [ref=e168]:
        - generic [ref=e169]:
          - generic [ref=e172]: El problema real
          - heading [level=2] [ref=e174]: ¿Seguir perdendo clientes, dinero y tiempo?
          - paragraph [ref=e175]: El 78% de los negocios en Argentina siguen administrando con papel, WhatsApp y Excel. Perdiendo en promedio $120.000/mes en oportunidades.
        - generic [ref=e176]:
          - generic [ref=e179]:
            - img [ref=e182]
            - img [ref=e185]
            - generic [ref=e187]:
              - img [ref=e190]
              - generic [ref=e193]:
                - generic [ref=e194]:
                  - heading [level=3] [ref=e195]: Sin MaatWork
                  - generic [ref=e196]: Perdidas
                - paragraph [ref=e197]: La realidad de la mayoria
            - list [ref=e198]:
              - listitem [ref=e199]:
                - generic [ref=e202]:
                  - img [ref=e205]
                  - generic [ref=e208]:
                    - generic [ref=e209]: Gestion manual de turnos que consume horas
                    - generic [ref=e210]: "-2hrs/dia"
                  - img [ref=e212]
              - listitem [ref=e216]:
                - generic [ref=e219]:
                  - img [ref=e222]
                  - generic [ref=e227]:
                    - generic [ref=e228]: 30% de clientes olvidan sus turnos
                    - generic [ref=e229]: "-$50K/mes"
                  - img [ref=e231]
              - listitem [ref=e235]:
                - generic [ref=e238]:
                  - img [ref=e241]
                  - generic [ref=e244]:
                    - generic [ref=e245]: Cobros que se vencen y nunca llegan
                    - generic [ref=e246]: "-15% ingresos"
                  - img [ref=e248]
              - listitem [ref=e252]:
                - generic [ref=e255]:
                  - img [ref=e258]
                  - generic [ref=e262]:
                    - generic [ref=e263]: WhatsApp saturado de mensajes repetitivos
                    - generic [ref=e264]: "-3hrs/dia"
                  - img [ref=e266]
            - generic [ref=e271]:
              - generic [ref=e272]: Perdida mensual estimada
              - generic [ref=e273]: $120.000+
          - generic [ref=e285]:
            - img [ref=e288]
            - generic [ref=e291]:
              - img [ref=e294]
              - generic [ref=e298]:
                - generic [ref=e299]:
                  - heading [level=3] [ref=e300]: Con MaatWork
                  - generic [ref=e301]:
                    - img [ref=e302]
                    - text: Ganancias
                - paragraph [ref=e305]: La transformacion que necesitas
            - list [ref=e306]:
              - listitem [ref=e307]:
                - generic [ref=e310]:
                  - img [ref=e313]
                  - generic [ref=e316]:
                    - generic [ref=e317]: Agenda automatica que se llena sola
                    - generic [ref=e318]:
                      - generic [ref=e319]: +40%
                      - generic [ref=e321]: mas clientes
                  - img [ref=e322]
              - listitem [ref=e325]:
                - generic [ref=e328]:
                  - img [ref=e331]
                  - generic [ref=e336]:
                    - generic [ref=e337]: Recordatorios por WhatsApp personalizados
                    - generic [ref=e338]:
                      - generic [ref=e339]: "0"
                      - generic [ref=e341]: cancelaciones
                  - img [ref=e342]
              - listitem [ref=e345]:
                - generic [ref=e348]:
                  - img [ref=e351]
                  - generic [ref=e353]:
                    - generic [ref=e354]: Cobros con un clic y seguimiento automatico
                    - generic [ref=e355]:
                      - generic [ref=e356]: +25%
                      - generic [ref=e358]: cobro efectivo
                  - img [ref=e359]
              - listitem [ref=e362]:
                - generic [ref=e365]:
                  - img [ref=e368]
                  - generic [ref=e371]:
                    - generic [ref=e372]: Respuestas automaticas 24/7
                    - generic [ref=e373]:
                      - generic [ref=e374]: +2hrs
                      - generic [ref=e376]: libres diario
                  - img [ref=e377]
            - generic [ref=e381]:
              - generic [ref=e382]: Recuperacion de ingresos
              - generic [ref=e383]: +40%
        - generic [ref=e384]:
          - generic [ref=e386]: Comparacion visual
          - generic [ref=e389]:
            - generic [ref=e391]:
              - img [ref=e393]
              - generic [ref=e397]: SIN MaatWork
              - generic [ref=e398]: Administracion manual, perdidas, caos
              - generic [ref=e402]: 85% ineficiente
            - generic [ref=e405]:
              - img [ref=e407]
              - generic [ref=e410]: CON MaatWork
              - generic [ref=e411]: Automatizacion inteligente, crecimiento
              - generic [ref=e415]: 95% eficiente
            - generic [ref=e419]:
              - img [ref=e420]
              - img [ref=e422]
            - generic [ref=e424]: ANTES
            - generic [ref=e425]: DESPUES
          - paragraph [ref=e426]: Arrastra el control para comparar
        - generic [ref=e428]:
          - generic [ref=e429]:
            - generic [ref=e430]: SIN
            - generic [ref=e431]: —
            - generic [ref=e432]: Perdidas, caos, stress
          - img [ref=e435]
          - generic [ref=e437]:
            - generic [ref=e438]: CON
            - generic [ref=e439]: —
            - generic [ref=e440]: Crecimiento, orden, libertad
      - generic:
        - img
      - generic:
        - img
        - img
      - generic:
        - img
      - generic:
        - img
      - generic:
        - img
      - generic:
        - img
      - generic [ref=e500]:
        - text: Empezá hoy
        - heading [level=2] [ref=e501]: ¿Listo para que tu local funcione solo?
        - paragraph [ref=e502]: Contanos de qué tipo de local se trata y en qué procesos necesitás ayuda.
      - generic [ref=e512]:
        - generic:
          - img
        - generic [ref=e519]:
          - generic [ref=e520]:
            - generic [ref=e521]:
              - generic [ref=e522]: MaatWork
              - paragraph [ref=e523]:
                - text: Tu local, automatizado.
                - text: Tu app, lista para usar.
              - generic [ref=e524]:
                - link "LinkedIn" [ref=e525] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e527]
                - link "Twitter" [ref=e530] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e532]
                - link "Instagram" [ref=e535] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e537]
            - generic [ref=e540]:
              - heading "Producto" [level=4] [ref=e541]
              - list [ref=e542]:
                - listitem [ref=e543]:
                  - link "Características" [ref=e544] [cursor=pointer]:
                    - /url: "#features"
                    - generic [ref=e546]: Características
                - listitem [ref=e547]:
                  - link "Precios" [ref=e548] [cursor=pointer]:
                    - /url: "#pricing"
                    - generic [ref=e550]: Precios
                - listitem [ref=e551]:
                  - link "Cómo funciona" [ref=e552] [cursor=pointer]:
                    - /url: "#how-it-works"
                    - generic [ref=e554]: Cómo funciona
            - generic [ref=e555]:
              - heading "Empresa" [level=4] [ref=e556]
              - list [ref=e557]:
                - listitem [ref=e558]:
                  - link "Testimonios" [ref=e559] [cursor=pointer]:
                    - /url: "#testimonials"
                    - generic [ref=e561]: Testimonios
                - listitem [ref=e562]:
                  - link "Preguntas Frecuentes" [ref=e563] [cursor=pointer]:
                    - /url: "#faq"
                    - generic [ref=e565]: Preguntas Frecuentes
                - listitem [ref=e566]:
                  - link "Contacto" [ref=e567] [cursor=pointer]:
                    - /url: "#contact"
                    - generic [ref=e569]: Contacto
            - generic [ref=e570]:
              - heading "Contacto" [level=4] [ref=e571]
              - list [ref=e572]:
                - listitem [ref=e573]:
                  - link "+54 299 456-9840" [ref=e574] [cursor=pointer]:
                    - /url: tel:+542994569840
                    - img [ref=e575]
                    - text: +54 299 456-9840
                - listitem [ref=e577]:
                  - link "clientes@maat.work" [ref=e578] [cursor=pointer]:
                    - /url: mailto:clientes@maat.work
                    - img [ref=e579]
                    - text: clientes@maat.work
              - generic [ref=e585]: Argentina, LATAM
          - img [ref=e591]
          - generic [ref=e593]:
            - paragraph [ref=e594]: © 2026 MaatWork. Construido con determinación en Argentina para LATAM.
            - generic [ref=e595]:
              - generic [ref=e596]: Powered by
              - generic [ref=e597]: Neon
              - generic [ref=e598]: ·
              - generic [ref=e599]: Vercel
      - button "Contactar por WhatsApp" [ref=e604] [cursor=pointer]:
        - img [ref=e611]
        - generic:
          - generic: Escribinos por WhatsApp
        - status [ref=e613]: Abre WhatsApp para contactarnos
  - button "Open Next.js Dev Tools" [ref=e619] [cursor=pointer]:
    - img [ref=e620]
  - alert [ref=e623]
  - generic "Social proof notifications"
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
> 50 |       await expect(priceText).toBeVisible()
     |                               ^ Error: expect(locator).toBeVisible() failed
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
  63 |       const items = page.locator('#pricing ul.space-y-4 li').all()
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