# MaatWork Landing Page — Auditoría Exhaustiva + Super Plan de Mejoras

**Fecha**: 2026-05-27
**Repo**: MaatWorkLandingPage
**Stack**: Next.js 16.2.4, React 19.2.4, Tailwind v4, Three.js (R3F), Neon DB, Zod

---

## RESUMEN EJECUTIVO

Audité 32 archivos fuente (6,409 líneas de código). Encontré **47 problemas** agrupados en 8 categorías. La landing page funciona pero tiene deuda técnica significativa: dependencias sin usar, código muerto, bugs de validación en formularios, problemas de accesibilidad, y una arquitectura que necesita consolidación.

**Severidad**: 🔴 Crítico (6) | 🟠 Alto (12) | 🟡 Medio (17) | 🟢 Bajo (12)

---

## CATEGORÍA 1: DEPENDENCIAS (6 problemas)

### 🔴 1.1 — Zod no está en package.json (solo transitive)
- **Archivo**: `src/lib/schemas/lead.schema.ts`
- **Problema**: `import { z } from 'zod'` funciona porque es transitive dep de `@neondatabase/serverless`, pero debería ser explícita
- **Fix**: `npm install zod`

### 🟠 1.2 — framer-motion solo se usa en 1 componente
- **Archivo**: `src/components/ui/ScrollAnimation.tsx`
- **Problema**: framer-motion (~60KB) solo se usa en ScrollAnimation, que a su vez NO se usa en ningún componente
- **Fix**: Eliminar ScrollAnimation.tsx y framer-motion de dependencies

### 🟠 1.3 — lenis no se usa (dependencia muerta)
- **Archivo**: `package.json` tiene `"lenis": "^1.3.23"`
- **Problema**: SmoothScrollProvider.tsx dice explícitamente: "Lenis removed - using native CSS smooth-scroll"
- **Fix**: `npm uninstall lenis`

### 🟠 1.4 — @react-three/postprocessing y postprocessing no se usan
- **Archivo**: `package.json`
- **Problema**: Ambas dependencias están en package.json pero no hay ningún import en el código fuente
- **Fix**: `npm uninstall @react-three/postprocessing postprocessing`

### 🟡 1.5 — @playwright/test como devDependency sin tests funcionales
- **Archivo**: `package.json`, `e2e/`, `tests/`
- **Problema**: Hay 15 archivos de tests E2E pero el build falla (`next: command not found`). Los tests son letra muerta
- **Fix**: Instalar deps correctamente o mover tests a carpeta de docs

### 🟡 1.6 — bun.lock y package-lock.json coexisten
- **Archivo**: raíz del proyecto
- **Problema**: Dos lockfiles = confusión sobre qué package manager usar
- **Fix**: Elegir uno (npm o bun) y eliminar el otro del .gitignore

---

## CATEGORÍA 2: ARCHIVOS HUÉRFANOS / CÓDIGO MUERTO (8 problemas)

### 🔴 2.1 — 12 screenshots PNG en la raíz del repo
- **Archivos**: `debug-screenshot.png`, `galaxy-*.png`, `maatwork-homepage.png`, etc.
- **Fix**: Mover a `.gitignore` o eliminar. Nunca deberían estar en el repo

### 🟠 2.2 — ScrollAnimation.tsx no se usa
- **Archivo**: `src/components/ui/ScrollAnimation.tsx`
- **Problema**: Componente completo (52 líneas) que nadie importa
- **Fix**: Eliminar

### 🟠 2.3 — ThreeErrorBoundary no se usa
- **Archivo**: `src/components/three/ErrorBoundary.tsx`
- **Problema**: 48 líneas, cero imports. GalaxyBackground3D no tiene error boundary propio
- **Fix**: Envolver el Canvas de GalaxyBackground3D con este ErrorBoundary, o eliminarlo

### 🟠 2.4 — useInView hook no se usa
- **Archivo**: `src/hooks/use-in-view.ts`
- **Problema**: 23 líneas, nadie lo importa. Los componentes usan IntersectionObserver directamente
- **Fix**: Eliminar

### 🟠 2.5 — useUtm hook no se usa
- **Archivo**: `src/hooks/use-utm.ts`
- **Problema**: 67 líneas, nadie lo importa. ContactFAQ tiene su propia `getUtmSource()` inline
- **Fix**: O integrar useUtm en los componentes que necesitan UTM, o eliminar

### 🟡 2.6 — cn() utility no se usa
- **Archivo**: `src/lib/utils/cn.ts`
- **Problema**: clsx + tailwind-merge utility exportada pero nadie la importa
- **Fix**: Usar en componentes para class merging o eliminar

### 🟡 2.7 — lib/utils/index.ts tiene tipos sin usar
- **Archivo**: `src/lib/utils/index.ts`
- **Problema**: Exporta `PaginationParams`, `PaginatedResult`, `ApiResponse`, `Optional` — nadie los importa
- **Fix**: Eliminar tipos muertos

### 🟡 2.8 — getLeads() exportada pero sin endpoint
- **Archivo**: `src/lib/services/neon.ts`
- **Problema**: Función completa (40 líneas) que nadie llama. No hay GET endpoint en la API
- **Fix**: Crear endpoint GET protegido para admin, o eliminar la función

---

## CATEGORÍA 3: BUGS DE FORMULARIOS / VALIDACIÓN (7 problemas)

### 🔴 3.1 — Formularios no verifican response.ok
- **Archivos**: `ContactFAQ.tsx`, `ROIPricing.tsx`, `ExitIntentPopup.tsx`
- **Problema**: `await fetch(...)` sin verificar si la respuesta es 2xx. Si el API devuelve 400/500, el formulario muestra "éxito" igual
- **Fix**: Agregar verificación de `response.ok` antes de mostrar éxito

### 🔴 3.2 — ROI Calculator envía `procesos: []` (vacio)
- **Archivo**: `src/components/sections/ROIPricing.tsx:102`
- **Problema**: El schema Zod requiere `procesos` con `.min(1)`, pero el mini-formulario envía array vacío
- **Fix**: O hacer procesos opcional en el schema para source `roi_calculator`, o agregar campo hidden

### 🔴 3.3 — ExitIntentPopup envía `procesos: []` (vacío)
- **Archivo**: `src/components/sections/ExitIntentPopup.tsx:42`
- **Mismo bug que 3.2**

### 🟠 3.4 — Validación duplicada: frontend + schema Zod
- **Archivos**: `ContactFAQ.tsx` tiene `validateForm()` manual, `lead.schema.ts` tiene Zod
- **Problema**: Dos fuentes de verdad para validación. Si cambia un regex en un lado, el otro queda desync
- **Fix**: Usar el schema Zod en el frontend también (importar y usar `.safeParse()`)

### 🟠 3.5 — useReducedMotion tiene handler vacío
- **Archivo**: `src/hooks/use-scroll-reveal.ts:21-23`
- **Problema**: El event listener de `prefers-reduced-motion` change tiene un handler vacío que no actualiza el estado
- **Fix**: Actualizar estado cuando cambia la preferencia del usuario

### 🟡 3.6 — Rate limit map no se limpia (memory leak)
- **Archivo**: `src/app/api/leads/route.ts:8`
- **Problema**: `rateLimitMap` es un Map global que nunca se purga. En serverless se reinicia, pero en dev puede crecer
- **Fix**: Agregar cleanup periódico o usar un TTL-based store

### 🟡 3.7 — ROI Calculator precio hardcodeado en USD pero calcula en ARS
- **Archivo**: `src/components/sections/ROIPricing.tsx`
- **Problema**: El ROI se calcula en ARS (formatNumber usa Intl 'es-AR' con ARS), pero el precio del producto es $59 USD. La comparación no es directa
- **Fix**: Aclarar que el ahorro es en ARS y el precio en USD, o agregar conversión

---

## CATEGORÍA 4: ARQUITECTURA / ESTRUCTURA (6 problemas)

### 🟠 4.1 — page.tsx es 'use client' innecesariamente
- **Archivo**: `src/app/page.tsx`
- **Problema**: Todo el componente es client cuando solo GalaxyBackground3D necesita ser client. Los demás componentes podrían ser server-rendered
- **Fix**: Mover 'use client' a los componentes que lo necesitan. page.tsx puede ser server component

### 🟠 4.2 — SmoothScrollProvider es un wrapper vacío
- **Archivo**: `src/components/providers/SmoothScrollProvider.tsx`
- **Problema**: 8 líneas, solo devuelve `<>{children}</>`. Lenis fue removido
- **Fix**: Eliminar el componente y el wrapper en layout.tsx

### 🟠 4.3 — WHATSAPP_LINK duplicado en 5 archivos
- **Archivos**: `HeroSection.tsx`, `Navbar.tsx`, `FloatingWhatsApp.tsx`, `AllInOne.tsx`, `ContactFAQ.tsx`
- **Problema**: El mismo link de WhatsApp está hardcodeado con diferentes mensajes en cada archivo
- **Fix**: Crear `src/lib/constants.ts` con WHATSAPP_BASE_URL y helpers para generar links

### 🟡 4.4 — WhatsApp SVG path duplicado 8 veces
- **Archivos**: Todos los componentes de secciones
- **Problema**: El mismo path SVG de WhatsApp (~1KB) se repite 8 veces
- **Fix**: Crear componente `WhatsAppIcon` o extraer a un archivo SVG

### 🟡 4.5 — .env.local.example referencia Supabase (stale)
- **Archivo**: `.env.local.example`
- **Problema**: Menciona `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` pero el proyecto usa Neon DB
- **Fix**: Actualizar para reflejar las variables reales (DATABASE_URL)

### 🟡 4.6 — barrel exports en hooks/index.ts exportan hooks sin usar
- **Archivo**: `src/hooks/index.ts`
- **Problema**: Exporta `useScrollReveal`, `useStaggerReveal`, `useParallax`, `useCounter` etc que nadie usa
- **Fix**: Limpiar exports a solo los hooks realmente utilizados

---

## CATEGORÍA 5: ACCESIBILIDAD (5 problemas)

### 🟠 5.1 — Sliders sin aria-valuemin/max/now
- **Archivo**: `src/components/sections/ROIPricing.tsx`
- **Problema**: Los 3 range inputs no tienen atributos ARIA para lectores de pantalla
- **Fix**: Agregar `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label`

### 🟠 5.2 — HeroSection sin aria-labels
- **Archivo**: `src/components/sections/HeroSection.tsx`
- **Problema**: CTA buttons no tienen aria-labels descriptivos
- **Fix**: Agregar `aria-label` a los CTAs principales

### 🟡 5.3 — Navbar mobile menu sin aria-expanded
- **Archivo**: `src/components/sections/Navbar.tsx`
- **Problema**: El botón hamburger tiene `aria-label="Menú"` pero no `aria-expanded`
- **Fix**: Agregar `aria-expanded={isMobileMenuOpen}`

### 🟡 5.4 — FAQ items sin aria-expanded/controls
- **Archivo**: `src/components/sections/ContactFAQ.tsx`
- **Problema**: Los FAQ accordion items no tienen `aria-expanded` ni `aria-controls`
- **Fix**: Agregar atributos ARIA al accordion

### 🟢 5.5 — Formularios sin aria-describedby para errores
- **Archivos**: `ContactFAQ.tsx`, `ExitIntentPopup.tsx`
- **Problema**: Los mensajes de error no están vinculados a los inputs via `aria-describedby`
- **Fix**: Vincular errores a inputs

---

## CATEGORÍA 6: PERFORMANCE (5 problemas)

### 🟠 6.1 — GalaxyBackground3D es 1,826 líneas en un solo archivo
- **Archivo**: `src/components/three/GalaxyBackground3D.tsx`
- **Problema**: Monolito con ~15 componentes internos (StarField, Planet, NebulaCloud, GalacticCore, ShootingStars, SpaceShip, CameraController, etc.)
- **Fix**: Extraer cada componente a su propio archivo en `src/components/three/`

### 🟡 6.2 — globals.css es 919 líneas
- **Archivo**: `src/app/globals.css`
- **Problema**: CSS monolítico con utilidades que podrían ser Tailwind classes o componentes CSS modules
- **Fix**: Consolidar utilidades, eliminar clases no usadas, considerar CSS modules para componentes

### 🟡 6.3 — WhatsApp SVG path de ~1KB se carga 8 veces
- **Problema**: Cada componente carga el mismo SVG inline
- **Fix**: Componente `<WhatsAppIcon />` compartido (ya mencionado en 4.4)

### 🟢 6.4 — useFrameLimiter(30) en todos los sub-componentes 3D
- **Archivo**: `GalaxyBackground3D.tsx`
- **Problema**: Cada componente 3D tiene su propio frame limiter, lo que puede causar desincronización
- **Fix**: Centralizar el frame limiting en un solo nivel

### 🟢 6.5 — `frameloop="always"` en el Canvas
- **Archivo**: `GalaxyBackground3D.tsx:1816`
- **Problema**: El canvas siempre renderiza, incluso cuando no hay cambios visibles
- **Fix**: Cambiar a `frameloop="demand"` y usar `invalidate()` cuando sea necesario

---

## CATEGORÍA 7: SEO / METADATA (3 problemas)

### 🟡 7.1 — og-image.png no existe
- **Archivo**: `public/`
- **Problema**: `layout.tsx` referencia `/og-image.png` pero el archivo no existe en `public/`
- **Fix**: Crear og-image.png (1200x630) con branding MaatWork

### 🟡 7.2 — favicon.ico no existe
- **Archivo**: `public/`
- **Problema**: `layout.tsx` referencia `/favicon.ico` pero no existe (solo favicon.svg)
- **Fix**: Generar favicon.ico desde favicon.svg o eliminar la referencia

### 🟢 7.3 — Schema.org ratingCount dice 500 (posiblemente inflado)
- **Archivo**: `src/app/layout.tsx:111`
- **Problema**: `aggregateRating.ratingCount: "500"` pero HeroSection dice "+500 usuarios en espera"
- **Fix**: Usar números reales o eliminar aggregateRating si no hay reviews reales

---

## CATEGORÍA 8: CONFIGURACIÓN / DX (7 problemas)

### 🟠 8.1 — reactStrictMode: false
- **Archivo**: `next.config.ts:4`
- **Problema**: Strict mode ayuda a detectar bugs en desarrollo
- **Fix**: Habilitar (o documentar por qué está deshabilitado — probablemente por R3F)

### 🟠 8.2 — build falla: `next: command not found`
- **Problema**: `npm run build` falla porque next no está en PATH
- **Fix**: `npm install` primero, o usar npx

### 🟡 8.3 — .kilo/ directory presente (residuo de otro AI tool)
- **Archivo**: `.kilo/`
- **Problema**: Directorio con node_modules de otro tool de AI
- **Fix**: Agregar `.kilo/` a .gitignore y eliminar del repo

### 🟡 8.4 — docs/ tiene specs que no se usan
- **Archivo**: `docs/`
- **Problema**: 17 archivos .md con specs de componentes que ya están implementados diferente
- **Fix**: Actualizar docs o mover a `docs/archive/`

### 🟡 8.5 — tests/ vs e2e/ duplicación
- **Archivos**: `tests/responsive.spec.ts` y `e2e/` con 15 archivos
- **Problema**: Dos carpetas de tests con Playwright, sin claridad sobre cuál es la oficial
- **Fix**: Consolidar en `e2e/` y eliminar `tests/`

### 🟢 8.6 — vercel.json redundante
- **Archivo**: `vercel.json`
- **Problema**: `framework: "nextjs"` es detectado automáticamente por Vercel
- **Fix**: Simplificar o eliminar vercel.json

### 🟢 8.7 — schema.sql comment typo
- **Archivo**: `schema.sql:42`
- **Problema**: `'Timeline/timeline selected'` — repetición
- **Fix**: Corregir a `'Timeline/urgency selection'`

---

## SUPER PLAN DE EJECUCIÓN

### Fase 1: Limpieza Crítica (1-2h)
> Eliminar todo lo que sobra y rompe

1. ✅ `npm install zod` (dependencia explícita)
2. ✅ `npm uninstall lenis framer-motion @react-three/postprocessing postprocessing`
3. ✅ Eliminar archivos muertos: `ScrollAnimation.tsx`, `use-in-view.ts`
4. ✅ Eliminar screenshots PNG de la raíz
5. ✅ Limpiar `.env.local.example` (actualizar a Neon DB)
6. ✅ Eliminar `.kilo/` del repo, agregar a `.gitignore`
7. ✅ Elegir un lockfile (npm o bun), eliminar el otro

### Fase 2: Bug Fixes Críticos (2-3h)
> Los que rompen funcionalidad

8. ✅ Fix fetch responses: verificar `response.ok` en los 3 formularios
9. ✅ Fix `procesos: []` en ROI Calculator y ExitIntentPopup (hacer opcional en schema o agregar default)
10. ✅ Fix `useReducedMotion` handler vacío
11. ✅ Consolidar WHATSAPP_LINK en `src/lib/constants.ts`
12. ✅ Crear componente `<WhatsAppIcon />` compartido

### Fase 3: Arquitectura (3-4h)
> Restructurar para mantenibilidad

13. ✅ Eliminar `SmoothScrollProvider` vacío y su wrapper en layout.tsx
14. ✅ Convertir `page.tsx` a server component (mover 'use client' a componentes hijos)
15. ✅ Extraer componentes de GalaxyBackground3D a archivos separados
16. ✅ Consolidar validación: usar schema Zod en frontend
17. ✅ Limpiar hooks/index.ts a solo hooks usados
18. ✅ Eliminar tipos muertos de lib/utils/index.ts

### Fase 4: Accesibilidad (1-2h)
> WCAG 2.1 AA compliance

19. ✅ Agregar ARIA attributes a sliders del ROI calculator
20. ✅ Agregar `aria-expanded` al Navbar mobile menu
21. ✅ Agregar `aria-expanded/controls` a FAQ accordion
22. ✅ Agregar `aria-label` a HeroSection CTAs
23. ✅ Vincular errores de formulario con `aria-describedby`

### Fase 5: Assets y SEO (1h)
> Lo que falta para producción

24. ✅ Crear `og-image.png` (1200x630)
25. ✅ Generar `favicon.ico` o eliminar referencia
26. ✅ Corregir Schema.org ratingCount
27. ✅ Actualizar copyright footer a 2026

### Fase 6: Performance (2h)
> Optimización final

28. ✅ CSS: eliminar clases no usadas de globals.css
29. ✅ Evaluar `frameloop="demand"` para Canvas 3D
30. ✅ Consolidar useFrameLimiter a nivel de Scene
31. ✅ Evaluar CSS modules vs globals.css para componentes

### Fase 7: DX y Testing (1h)
> Developer experience

32. ✅ Habilitar reactStrictMode (con workaround para R3F si es necesario)
33. ✅ Consolidar tests en `e2e/`
34. ✅ Actualizar docs/ o mover specs stale a archive
35. ✅ Simplificar vercel.json
36. ✅ Fix schema.sql typo

---

## ESTADÍSTICAS

| Métrica | Valor |
|---------|-------|
| Archivos fuente | 32 |
| Líneas de código | 6,409 |
| Dependencias en package.json | 17 (11 prod + 6 dev) |
| Dependencias sin usar | 3 (lenis, framer-motion, postprocessing) |
| Hooks creados | 9 |
| Hooks sin usar | 4 (useInView, useUtm, useScrollProgress, useMagnetic) |
| Componentes creados | 14 |
| Componentes sin usar | 2 (ScrollAnimation, ThreeErrorBoundary) |
| WhatsApp SVG duplicados | 8 |
| Problemas encontrados | 47 |
| Tiempo estimado total | 10-14h |

---

## PRIORIDAD DE EJECUCIÓN

```
Fase 1 (Limpieza)     → Sin riesgo, inmediato
Fase 2 (Bug Fixes)    → Alto impacto, bajo riesgo
Fase 3 (Arquitectura) → Alto impacto, medio riesgo
Fase 4 (Accesibilidad)→ Medio impacto, bajo riesgo
Fase 5 (SEO/Assets)   → Medio impacto, bajo riesgo
Fase 6 (Performance)  → Bajo impacto, medio riesgo
Fase 7 (DX)           → Bajo impacto, bajo riesgo
```

**Recomendación**: Ejecutar Fase 1 + 2 primero. Son quick wins con alto impacto. Luego Fase 3 para tener una base sólida antes de iterar.
