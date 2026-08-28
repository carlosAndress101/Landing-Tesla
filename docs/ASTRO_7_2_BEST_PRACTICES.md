# Astro 7.2 Best Practices — Guía para Futuros Proyectos

> Filosofía y convenciones extraídas de la migración Landing Tesla 2→7.2.9

## 1. Filosofía de Astro

**Content-first, Server-first, Zero JS by default, Islands Architecture.**
- Contenido en `src/data` o `src/content` (no en componentes).
- Frontmatter (`---`) corre en server, 0 bytes al cliente.
- Solo hidrata islas con `client:*`. Este landing usa 0 islands hidratadas — 2 `<script>` islas estáticas.
- Cada byte JS debe justificarse (loader, reveal, parallax). Sin React/Vue si Astro + CSS resuelven.

## 2. Componentes Astro

```
Component.astro
├── frontmatter: import type, interface Props, const {props}=Astro.props
├── template: <section> con class:list, slots
├── style: <style> aislado o src/styles/
└── script: <script> tipado, querySelectorAll<HTMLElement>
```

Reglas:
- Una responsabilidad, ≤120l, `Props extends TipoCentral`
- No fetch en componente — datos via `props` de `data/` o `content/`
- `---` solo lógica server, `<script>` solo client, tipos compartidos en `src/types/`

## 3. TypeScript

**Props:** `interface Props extends TeslaSection { eager?: boolean }` + `const {id,theme}: Props = Astro.props`
**Data:** `export const sections = [...] as const satisfies readonly TeslaSection[]`
**Utilities:** `Record<Theme,string>`, `Pick<T, "id">`, `ReturnType<typeof fn>`, `Template Literal #${string}`
**Config:** `as const satisfies Record<string,string>`

Ver `docs/TYPESCRIPT_ASTRO72_GUIDE.md` §4 para 14 patrones (Props/Layouts/Slots/Eventos/`satisfies`/`Readonly`/evitar `any`).

## 4. Assets — `src/assets` vs `public`

| Caso | Ubicación | Uso | Optimizado |
|---|---|---|---|
| Imágenes contenido (hero, model-y) | `src/assets/*.avif` | `import img from "@/assets/model-y.avif"` → `<Image src={img} />` de `astro:assets` | Sí (sharp, width/height tipado, CLS 0) |
| Assets estáticos (favicon, fonts, video) | `public/*` | `src="/favicon.svg"` string | No, servido tal cual |
| Video hero | `public/*.webm` | `<video><source src="/public_video.webm" type="video/webm">` | No |

Este proyecto mantiene `public` por cambios mínimos; migrar a `src/assets` cuando necesites `Image` con `srcset` 750/1280/1920.

## 5. Client Directives

```
client:load   → hidrata inmediato (nunca para landing estático)
client:idle   → hidrata cuando main thread idle (para chat widget)
client:visible→ hidrata al entrar en viewport (para footer interactivo)
client:media="(max-width: 768px)" → solo móvil
client:only="react" → solo client, sin SSR (para mapa)
```

**Cuándo NO usar ninguno:** Contenido estático, animaciones CSS, IntersectionObserver vanilla — como este landing (0 directives). Zero JS > Islands.

## 6. Performance

**LCP:** Hero `eager`, `width/height` 1920×1080, `preload metadata` video con `poster`, CSS 20K único.
**CLS:** `width/height` en `<img>`, `aspect-ratio` via Tailwind, no layout shift.
**INP:** Scripts `passive:true`, `requestAnimationFrame`, sin `client:load`.
**TBT:** 2 scripts islas (Header 60l + index 62l), `threshold 0.9` sin `root`.
**Imágenes:** AVIF, `loading lazy` excepto hero, `decoding async`.
**Fuentes:** System stack, `public/fonts/` con `font-display:swap` preparado, 0 base64.
**JS:** `dist/_astro/*.js` 0 para este landing (solo CSS), JS inline 2× `<script>` → 5KB.

## 7. Routing — `src/pages/`

- `index.astro` → `/`, `about.astro` → `/about`, `[id].astro` → dinámico con `getStaticPaths()`
- `trailingSlash: "ignore"` (default Astro 7) — no configurar sin necesidad
- `404.astro` para custom 404
- `src/pages/api/*.ts` para endpoints

Este proyecto single-page: solo `index.astro` + `404` opcional.

## 8. Layouts

```astro
---
import type { LayoutProps } from "@/types";
interface Props extends LayoutProps {}
const { title, description }: Props = Astro.props;
---
<html><head><title>{title}</title><slot name="head" /></head><body><slot /></body></html>
```
- Un `Layout.astro` por site, `site` + `canonical` via `Astro.site`, SEO + JSON-LD con `is:inline`, `skip link` para a11y.

## 9. Content Collections — Cuándo usar

Cuando `src/data/sections.ts` supera 15 items o necesitas CMS:
```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";
export const collections = {
  sections: defineCollection({
    type: "content",
    schema: z.object({ title: z.string(), theme: z.enum(["light","dark"]), media: z.object({ src: z.string() }) })
  })
}
```
Beneficio: `getCollection("sections")` tipado, valida `src` existe, markdown para contenido largo.

## 10. TypeScript Strict — Config recomendada (Astro 7.2)

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "moduleDetection": "auto",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src", ".astro/types.d.ts"]
}
```
`strictest` ya incluye `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, etc. Añade `moduleDetection:auto` para `isolatedModules`. Sincroniza `paths` con `vite.resolve.alias`.

## 11. SEO

- `site` en `astro.config.mjs` + `Astro.site` para `canonical`
- `<meta name="description">`, `og:*`, `twitter:*`, `JSON-LD` con `is:inline` + `set:html={JSON.stringify()}`
- `sitemap` via `@astrojs/sitemap` si multi-página, `robots.txt` en `public/`

## 12. Accesibilidad

- Landmarks `header/nav/main/footer`, `aria-label`, `aria-expanded`, `aria-current` en indicator
- `alt` descriptivo no genérico, `focus-visible:ring`, `prefers-reduced-motion` respeta
- `Skip to content` sr-only, `role="dialog" aria-modal` en menú móvil

## 13. Seguridad

- No `set:html` con user input (solo JSON-LD estático), `is:inline` para JSON-LD no TS
- `Content-Security-Policy` via headers en adapter si SSR, no necesario en static
- No exponer `SECRET` env — usar `import.meta.env` tipado via `env.d.ts`

## 14. Deployment

- `output:"static"` → `dist/` listo para `Netlify/Vercel/Cloudflare`
- `astro check && astro build` en CI, Node 20 LTS, pnpm 9+, `typescript` devDep pinneado
- `pnpm preview` antes de deploy para verificar 200 + assets
- Cache `node_modules/.astro` y `dist/_astro` para Vite

> Checklist nuevo componente en `docs/TYPESCRIPT_ASTRO72_GUIDE.md` §8.
