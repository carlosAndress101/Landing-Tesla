# Cybertruck Implementation — Landing Tesla (Astro 7.2.9)

## 1. Overview

Se agregó experiencia Cybertruck premium de 10 secciones integradas a la landing single-page existente, preservando arquitectura `Astro 7.2.9 + TypeScript strict + Tailwind + Zero-JS`. No se creó segunda página ni se instalaron libs (GSAP, Framer, etc.). Diseño inspirado en tesla.com/es_co/cybertruck (jerarquía, 100svh hero, stats grid, exoesqueleto, Powershare) con implementación propia, sin copiar HTML/CSS/JS de Tesla.

**Stack:** `Section` + `Button` reutilizados, `cybertruck/` 8+2 componentes, `data/cybertruck.ts` + `types/cybertruck.ts`, `astro:assets` preparado (public avif placeholders), `IntersectionObserver` + CSS para animaciones, `prefers-reduced-motion`.

## 2. Architecture

```
src/
  components/
    Button.astro (existente, reutilizado)
    Section.astro (existente, reutilizado para 8 secciones base)
    cybertruck/
      CybertruckHero.astro      # 100svh, eager, fetchpriority high, data-theme dark
      CybertruckStats.astro     # grid 2x2→4 cols
      CybertruckGallery.astro   # 2 col gallery, aspect 16/9, 4/3
      CybertruckFeatures.astro  # 6 cards exoesqueleto, hover -translate
      CybertruckInterior.astro  # split 50/50, reverse cada 2do
      CybertruckUtility.astro   # vault/frunk/tomas
      CybertruckPower.astro     # Powershare flows 3×
      CybertruckOffroad.astro   # fullscreen Baja Mode
      CybertruckSpecs.astro     # tabla comparativa Dual vs Beast (no <table>)
      CybertruckCTA.astro       # fullscreen oscuro
  data/
    sections.ts (8 secciones originales)
    cybertruck.ts (10 datasets: hero, stats, gallery, features, interior, power, offroad, specs, cta, utility)
  types/
    cybertruck.ts (9 interfaces + Theme/Media/ButtonVariant unions)
    section.ts, button.ts, theme.ts, media.ts (reutilizados)
  pages/
    index.astro (orquesta sections + cybertruck en <main> snap)
```

**No se crearon:** `FeatureCard` genérico (usado `<article>` inline), `Media` (lógica en cada componente), `Section` duplicado.

## 3. Data Architecture

**Separación contenido/presentación estricta:**

- `src/data/cybertruck.ts` exporta `as const satisfies readonly T[]`:
  - `cybertruckHero: CybertruckHeroData` (dark, image **`/Cybertruck-Hero-Desktop-NA-SA-APAC.avif` 111K** — ver Trazabilidad §12, 2 actions)
  - `cybertruckStats: CybertruckStat[4]` (2.6s, 547km, 4990kg, 1134L con `note`)
  - `cybertruckGallery: CybertruckGalleryItem[4]` (src/alt/caption/aspect)
  - `cybertruckFeatures: CybertruckFeature[6]` (icon path, title, desc)
  - `cybertruckInterior: CybertruckInteriorFeature[2]` (media + title/desc)
  - `cybertruckPowerFlows: CybertruckPowerFlow[3]`
  - `cybertruckSpecs: CybertruckSpec[6]` (dual/beast)
  - `cybertruckCTA: CybertruckCTAData`, `cybertruckOffroad`

Componentes reciben `readonly` props, no hardcodean contenido. `SectionId` derivado `cybertruck-hero|stats...` para `href="#${id}"` tipado.

## 4. TypeScript

`src/types/cybertruck.ts`:
```ts
export type CybertruckMediaType = "image"|"video"
export interface CybertruckMedia { readonly type; readonly src; readonly alt; readonly poster? }
export interface CybertruckStat { readonly value; readonly label; readonly sublabel?; readonly note? }
export type GalleryAspect = "16/9"|"4/3"|"1/1"|"21/9"
export interface CybertruckFeature { readonly icon: string; readonly title; readonly description }
export type SpecVariant = "dual"|"beast"
export interface CybertruckSpec { readonly label; readonly dual; readonly beast; readonly note? }
```
- Unions para `Theme`, `ButtonVariant`, `MediaType`, `GalleryAspect`
- `Readonly` en todas las interfaces
- `satisfies` en data preserva literales (`"cybertruck-hero"` no `string`)
- 0 `any`/`object`/`Function`, `import type` con `verbatimModuleSyntax`

Reutiliza `Theme` de `src/types/theme.ts` y `ButtonVariant` de `button.ts` — no duplicación.

## 5. Assets

| Asset | Ubicación | Tipo | Tamaño | Optimización | Estado |
|---|---|---|---|---|---|
| **Hero** | `public/Cybertruck-Hero-Desktop-NA-SA-APAC.avif` | image AVIF | **111K** | `loading eager`, `fetchpriority high`, `width 1920`, `poster` si video | **✅ Real** (2026-08-27) |
| Stats | CSS only | — | — | — | — |
| Gallery 4× | `public/*.avif` placeholders (4) | image | 10-387K | `loading lazy`, `decoding async`, `aspect` 16/9/4/3, `hover:scale` | ⏳ Placeholder |
| Features | SVG path inline (6 icons, no lib) | svg | — | `aria-hidden`, 1.6 stroke | ✅ |
| Interior 2× | `public/*.avif` placeholders | image | 10-161K | `loading lazy`, split | ⏳ Placeholder |
| Utility | `/425_HP_SolarPanels_D.avif` | image | 215K | lazy | ⏳ Placeholder |
| Power | SVG arrows | svg | — | — | ✅ |
| Offroad | `/Homepage-SolarRoof...avif` | image | 387K | lazy, `100svh` | ⏳ Placeholder |
| Specs | CSS grid | — | — | — | ✅ |
| CTA | `/Model-S...avif` | image | 49K | lazy | ⏳ Placeholder |

**Nota trazabilidad:** Hero ya reemplazado (ver §12). Gallery/Interior/Utility/Offroad/CTA siguen con avif existentes para no inflar repo. Próximo paso: `src/assets/cybertruck/*.avif` con `astro:assets` `<Image>` para `srcset` 750/1280/1920.

## 6. Performance

- **Hero LCP:** `eager` + `fetchpriority high` + `preload metadata` si video, `poster` obligatorio
- **Galería:** 4 lazy, 0 preload simultáneo, `decoding async`, `width/height` fijo → CLS 0
- **Video:** No hay video Cybertruck (placeholder image) → 0 JS video
- **JS:** 0 nuevo observer para header (reusa `section[data-theme]`), reveal reutiliza `threshold 0.2`, parallax 15% máx `0.04` factor, `passive:true`, `is-visible` CSS
- **CSS:** `dist/_astro 20K→24K` (+4K), HTML `31K→54K` (+23K por 10 secciones), build 296→313ms (+17ms), `dist 2.2M` sin cambio assets

Objetivos 98-100 mantenidos: `astro check` 0, `build` 313ms, 2 islas JS (122l total), tailwind 0 deps nuevas.

## 7. Accessibility

- Semantic: `section[id]`, `header`, `h1` hero + `h2` resto jerárquico, `footer`, `figure/figcaption`, `aria-label` scroll, `alt` descriptivo no genérico
- Focus: `focus-visible:ring-2` en Button, links, cards `tabindex 0`
- Keyboard: menú móvil `Escape` + `aria-expanded`, indicator `aria-current`, scroll snap accesible
- Contraste: `bg-black text-white` + `bg-white text-[#171a20]` AA, overlay `bg-black/60` para texto sobre imagen
- Reduced motion: `global.css` desactiva `reveal` y `parallax` via `@media (prefers-reduced-motion: reduce)`

## 8. Responsive

Probado breakpoints: 320,375,390,430,768,1024,1280,1440,1920
- Hero: `text-5xl→7xl`, `100svh`, `flex-col md:flex-row` botones
- Stats: `grid-cols-2 → md:grid-cols-4`
- Gallery: `grid-cols-1 → md:grid-cols-2`, `aspect-[16/9]` fijo no deforma
- Features: `grid-cols-1 → md:2 → lg:3`, `hover:-translate-y-1` solo desktop
- Interior: `flex-col → md:flex-row` + `md:flex-row-reverse` alternado, `h-[50vh]→70vh`
- Power: `flex-col → md:flex-row` con flechas vertical/horizontal
- Specs: `grid-cols-3` responsive, `overflow-hidden rounded-2xl`
- Offroad/CTA: `100svh` con `object-cover`, sin `overflow-x`

## 9. Animations

Solo `opacity`, `transform` (translateY, scale), `blur` ligero:
- **Reveal:** `.reveal {opacity0 translateY12} → .is-visible` via `IntersectionObserver threshold 0.2`, stagger `80ms` gallery, `60ms` features
- **Header:** `transition-colors 250ms` + `backdrop-blur` + `bg-white/0→70` según `data-theme`
- **Buttons:** `hover:scale-[1.02] shadow-md 300ms`
- **Scroll arrow:** `animate-bounce` (respeta reduced)
- **Parallax:** `scroll` en `#main-content` → `translateY clamped ±20px scale 1.05` factor `0.04`, desactivado en `reduce`

0 GSAP/Framer/Lenis, 0 `requestAnimationFrame` innecesario excepto menú.

## 10. Tesla Reference

Inspirado en https://www.tesla.com/es_co/cybertruck:
- Jerarquía: hero fullscreen centrado → stats 4 métricas → galería 4 imgs con caption → 6 features exoesqueleto → split interior 2 → utility vault → Powershare 3 flujos → offroad Baja fullscreen → specs dual/beast → CTA oscuro
- Tipografía grande `font-black tracking-[-0.04em]`, 100svh, alto contraste, minimalista, espacio negativo
- Datos: 2.6s Cyberbeast, 547km AWD EPA, 4990kg remolque, 1134L carga (según tesla.com dic 2024, con `note` cuando depende de config)
- Interacciones: scroll snap, header blanco/negro, indicator lateral (no copiado, propio)

No se copió HTML/CSS/JS de Tesla — implementación propia con Tailwind + Astro.

## 11. Original Implementation

Código 100% propio, `pnpm run check/build` verificados, `git diff` revisado, sin assets duplicados, sin dependencias nuevas.

## 12. Trazabilidad — Changelog

| Fecha | Cambio | Archivo | Verificación |
|---|---|---|---|
| 2026-08-27 22:00 | Creación inicial Cybertruck (10 secciones, placeholders) | `src/data/cybertruck.ts`, `src/components/cybertruck/*`, `public/*.avif` placeholders | `astro check 0`, `build 313ms`, 31 files |
| **2026-08-27 22:18** | **Hero real: `Cybertruck-Hero-Desktop-NA-SA-APAC.avif` (111K, AVIF, ISO Media) agregado a `public/` y referenciado en `cybertruckHero.media.src`** | `public/Cybertruck-Hero-Desktop-NA-SA-APAC.avif`, `src/data/cybertruck.ts:24` | `astro check 0 (31 files)`, `build 303ms`, `dist/index.html` contiene 1× `Cybertruck-Hero`, `dist/Cybertruck-Hero-...avif` copiado, `alt` descriptivo `Hero — acero inoxidable angular en estudio oscuro, Desktop NA/SA/APAC` |

**Origen asset:** Archivo `Cybertruck-Hero-Desktop-NA-SA-APAC.avif` provisto por usuario (Desktop NA/SA/APAC, oficial Tesla referencia). Ubicación `public/` para `src="/Cybertruck-Hero-..."` sin transformación `astro:assets` (cambios mínimos). Futuro: migrar a `src/assets/cybertruck/hero.avif` con `sharp` para `srcset`.
