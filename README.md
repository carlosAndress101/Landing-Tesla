# Tesla Landing — Premium Refactor (Astro + Tailwind)

Landing inspirada en Tesla.com — single-page con Scroll Snap, header adaptativo, performance 98+ y WCAG AA.

## Stack
Astro + Tailwind + TypeScript · 0 libs animación · AVIF · astro:assets

## Estructura
```
src/
  components/
    Section.astro      # único componente para las 8 secciones (image|video, theme, actions)
    Button.astro       # primary | secondary | ghost
    LandingHeader.astro# nav por array, 1 script, backdrop directo, menú móvil
    Footer.astro
  data/
    sections.ts        # contenido separado de presentación (8 secciones)
  layouts/
    Layout.astro       # SEO, OG, JSON-LD, skip link, global styles
  styles/
    global.css
    landing.css
public/
  *.avif, *.webm
  fonts/               # Gotham woff2 con font-display:swap (placeholder)
```

## Scripts
`pnpm dev` · `pnpm build` · `pnpm preview`

## Decisiones
- DRY/YAGNI/KISS: 8 componentes → 1 Section + data array
- Performance: base64 fonts eliminados (~150KB), hero eager resto lazy, video preload="metadata"
- Accesibilidad: landmarks header/nav/main/footer, alt descriptivos, focus-visible, reduced-motion
- Animaciones: CSS + IntersectionObserver (fade/translate, parallax 15% máx, header 250ms)
- Premium: menú móvil (slide, overlay, Escape, click fuera), indicador lateral, loader 500ms, scroll arrow
