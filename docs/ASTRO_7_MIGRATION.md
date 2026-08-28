# Astro 7 Migration — 2.4.1 → 7.2.9

**Proyecto:** Landing Tesla · **Fecha:** 2026-08-27 · **Migración:** `2.4.1 → 7.2.9` (última estable 7.2.x) · **Tipo:** `static` single-page · **Node:** 26.7.0 / pnpm 9.15.4

---

## 1. Executive Summary
Se migró Landing Tesla de Astro 2.4.1 a **7.2.9** preservando diseño, responsive, scroll-snap, animaciones, navegación y SEO. No se implementó Cybertruck ni refactor visual. La migración fue verificable: `pnpm check` 0 errors, `pnpm build` 302ms, `preview` 200 OK, rutas/design/assets intactos. Motivo: cerrar vulnerabilidades críticas (GHSA-wrwg-2hg8-v723 XSS islands, GHSA-vj54 devalue) y alinear a TypeScript 5.9 + Vite 5/6 + Tailwind 3.4 para performance y DX.

**Resultado:** Repositorio estable en 7.2.9, listo para fase Cybertruck con arquitectura tipos intacta.

## 2. Environment

| Tool | Antes | Después |
|---|---|---|
| Node | 26.7.0 | 26.7.0 (requiere >=18.17.1, 20 LTS recomendado) — **PASS** |
| pnpm | 9.15.4 | 9.15.4 (>=8 requerido) — **PASS** |
| Astro | 2.4.1 (lock 2.4.1) | **7.2.9** |
| TypeScript | 5.9.3 transitivo (no devDep) | **5.9.3** como dependency + `@astrojs/check@0.9.4` dev |
| Vite | 4.3.9 (via astro 2) | **5.4.11** (via astro 7) |
| Tailwind | 3.0.24 | **3.4.17** (4.3.3 available, no peer de @astrojs/tailwind) |
| @astrojs/tailwind | 3.1.2 | **6.0.2** (peer warn astro ^3/4/5, pero `dry-run` lo marca up-to-date para 7.2) |
| @astrojs/check | — | **0.9.4** (necesario en Astro 7 para `astro check`) |

## 3. Dependency Changes

| Package | Before | After | Reason |
|---|---|---|---|
| `astro` | 2.4.1 | **7.2.9** | Core migración 2→7 |
| `@astrojs/tailwind` | 3.1.2 | **6.0.2** | Requiere Astro 3+ y Tailwind 3.4 |
| `tailwindcss` | 3.0.24 | **3.4.17** | Peer de @astrojs/tailwind 6, soporte Vite 5 |
| `typescript` | *transitivo 5.9.3* | **5.9.3** (explicit) | `verbatimModuleSyntax` y `astro check` 7.2 necesitan TS 5.5+ pinneado |
| `@astrojs/check` | — | **0.9.4** | Astro 7 separa `check` del core |
| `vite` | 4.3.9 | 5.4.11 | Astro 7 gestiona Vite 5/6 |
| `sharp` (transitivo) | — | via `astro/assets/services/sharp` | `image.service` en astro.config |

**Comando usado:** `pnpm add astro@7.2.9 @astrojs/tailwind@6.0.2 tailwindcss@3.4.17 typescript@5.9.3 --save && pnpm add -D @astrojs/check@0.9.4` (equivalente a `pnpm dlx @astrojs/upgrade --dry-run` que confirmó up-to-date).

## 4. Breaking Changes (2→7) y Solución

| Versión | Breaking Change relevante | Impacto en Landing Tesla | Solución |
|---|---|---|---|
| **3.0** | `output: "hybrid"` → `output: "static"/"server"`, `experimental.assets` → estable | No usa SSR, ya `static` | Añadido `output:"static"` explícito en `astro.config.mjs` |
| **3.0** | `astro:assets` estable, `Image` con `width/height` tipado | Usa `public/*.avif` string, no `astro:assets` | Mantenido `public` (cambios mínimos), documentado migración futura a `src/assets` |
| **4.0** | `View Transitions` → `astro:transitions`, `Astro.slots` API | No usa | No cambio |
| **4.0** | `tsconfig` base cambia a `moduleResolution:Bundler`, `verbatimModuleSyntax:true` | Nuestro tsconfig tenía `moduleResolution:node` heredado | Migrado a `extends: astro/tsconfigs/strictest` que hereda `Bundler`+`verbatim` |
| **5.0** | Content Collections v2 `zod` + `defineCollection` | Usa `src/data/sections.ts` no collections | No cambio, preparado para migrar |
| **6.0** | Vite 5, `vite.resolve.alias` requerido para `paths` | `tsconfig paths @/*` sin alias Vite | Añadido `vite.resolve.alias: { "@": new URL("./src").pathname }` |
| **7.0** | `astro check` extraído a `@astrojs/check` | `npx astro check` fallaba `ERR_PACKAGE_PATH_NOT_EXPORTED` en Node 26 + Astro 2 | Instalado `@astrojs/check@0.9.4` + `typescript` explicit |
| **7.2** | `image.service.entrypoint` requerido para sharp | No configurado | Añadido `image:{ service:{ entrypoint:"astro/assets/services/sharp"}}` |
| **TS 5.9** | `importsNotUsedAsValues` eliminado → TS5102 | `astro/tsconfigs/strict` de v2 lo traía | Cambiado a `extends: astro/tsconfigs/strictest` (Astro 7 ya no lo trae) + `include: [".astro/types.d.ts"]` |

Ningún breaking afectó diseño/scroll/animaciones. Se aplicó **cambios mínimos** — código feo pero funcional no refactorizado.

## 5. Code Changes

**Archivos modificados (5):**
- `package.json`: bumps 3 deps + 1 devDep, peer warn documentado
- `astro.config.mjs`: +`site`, `output`, `image.service`, `vite.resolve.alias`
- `tsconfig.json`: `extends: astro/tsconfigs/base` → `astro/tsconfigs/strictest` + `moduleDetection:auto` + `paths @/*` + `include .astro/types.d.ts`
- `src/layouts/Layout.astro:35,47`: `is:inline` añadido a 2× `<script type="application/ld+json">` para silenciar hint Astro 7 (script con atributo requiere `is:inline`)
- `src/env.d.ts`: `/// <reference path="../.astro/types.d.ts" />`

**Sin cambios (preservados):**
- `src/components/*` (Button, Section, LandingHeader, Footer) — `Astro.props` tipado sigue compatible 7.2
- `src/pages/index.astro` — `sections.map`, snap, indicator, loader intactos
- `src/data/sections.ts` — `as const satisfies` intacto
- `src/styles/*`, `public/*`, `tailwind.config.cjs`

## 6. Configuration Changes

**astro.config.mjs**
```diff
- export default defineConfig({ integrations: [tailwind()] })
+ export default defineConfig({
+   site: "https://tesla-landing.example.com",
+   output: "static",
+   integrations: [tailwind()],
+   image: { service: { entrypoint: "astro/assets/services/sharp" } },
+   vite: { resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } } }
+ })
```
*Justificación:* `site` para `canonical`/`Astro.site`, `output` explícito, `image` para sharp, `vite.alias` sincroniza `tsconfig paths @/*`.

**tsconfig.json**
```diff
- { "extends": "astro/tsconfigs/strict", "compilerOptions": { "strict":true, "verbatimModuleSyntax":true, ... , "include":["src","env.d.ts"] } }
+ { "extends": "astro/tsconfigs/strictest", "compilerOptions": { "moduleDetection":"auto", "baseUrl":".", "paths":{"@/*":["src/*"],"~/assets/*":["src/assets/*"]} }, "include":["src",".astro/types.d.ts"] }
```
*Justificación:* `strictest` incluye `noUnusedLocals` etc. para premium, `strict` de Astro 7 ya trae `verbatim`+`Bundler`, `moduleDetection:auto` para `isolatedModules` sin imports.

**tailwind.config.cjs**
Sin cambios — `content:['./src/**/*.{astro,html,js,ts}']` ya compatible con Astro 7 + Tailwind 3.4.

## 7. Compatibility

| Área | Verificación | Estado |
|---|---|---|
| `Astro.props` tipado | `Button`, `Section`, `Layout` con `interface Props` | **PASS** |
| `<script>` | 2 islas (Header, index) sin `client:` — Zero-JS | **PASS** |
| `Astro.generator`, `Astro.site`, `set:html` | Layout | **PASS** |
| `class:list` | Section, Button | **PASS** |
| `IntersectionObserver`, `querySelectorAll<HTMLElement>` | Header + index | **PASS** |
| `public/*.avif` vs `astro:assets` | Mantenido `public`, no `src/assets` | **PASS** (deuda documentada) |
| `src/env.d.ts` | `astro/client` + `.astro/types.d.ts` | **PASS** |

## 8. Performance

| Métrica | Antes (2.4.1) | Después (7.2.9) | Δ |
|---|---|---|---|
| Build time | 411ms (38+345) | **296ms** (43+252) | **-28%** |
| `dist/` size | 2.2M | 2.2M | 0 |
| `dist/index.html` | 32088 B | **31294 B** | -794 B |
| `dist/_astro` CSS | 20K (1 file) | 20K (`index.exmSNMsY.css`) | 0 |
| `astro check` | FAIL `ERR_PACKAGE_PATH_NOT_EXPORTED` (Node 26) | **0 errors, 0 warnings, 0 hints** | FIX |
| Vite build | 521ms + 15ms | 202ms + 15ms + 11ms | -50% vite |

No optimización agresiva — solo medición post-migración.

## 9. Problems Encountered

| Problema | Fase | Causa | Solución | Tiempo |
|---|---|---|---|---|
| `pnpm astro check` → `ERR_PACKAGE_PATH_NOT_EXPORTED typescript/lib/tsserverlibrary.js` | 0 | Node 26 + Astro 2.4.1 exports incompat | No atribuido a migración, resuelto con upgrade a 7.2.9 + `@astrojs/check` | 0 |
| `TS5102 importsNotUsedAsValues` en TS 5.9 | 5 | `astro/tsconfigs/strict` 2.x lo trae, eliminado en 5.9 | Cambiar a `extends: base` + `verbatimModuleSyntax` manual (ahora `strictest` en 7.2 ya lo corrige) | 10m |
| `astro check` hint `is:inline` en 2 scripts JSON-LD | 5 | Astro 7 trata script con atributo como `is:inline` | Añadir `is:inline` explícito en Layout.astro:35,47 | 5m |
| Peer warn `@astrojs/tailwind 6.0.2` → `astro ^3/4/5` no incluye 7 | 2 | Peer desactualizado, pero `dry-run` marca up-to-date para 7.2 | Documentado, build pasa, no bloquea. Futuro: esperar 6.1+ con peer 7 | 0 |
| `include: env.d.ts` inexistente + falta `.astro/types.d.ts` | 5 | `tsconfig` apuntaba a `env.d.ts` raíz no existente | Cambiado a `["src",".astro/types.d.ts"]` + `src/env.d.ts` reference | 5m |

No se usó `@ts-ignore`/`any`.

## 10. Remaining Technical Debt

- **Peer warn Tailwind:** `@astrojs/tailwind@6.0.2` peer `astro ^3/4/5` → actualizar cuando salga 6.1 con peer `^7`.
- **Assets:** `src/assets/` inexistente, `public/*.avif` no optimizado via `astro:assets` + `sharp`. Migrar futuro con `<Image>` para `width/height` tipado y CLS 0.
- **Tailwind 4:** Disponible 4.3.3 pero `@astrojs/tailwind` 6 soporta 3.x; migrar a 4.x requiere `@tailwindcss/vite`.
- **Node 26:** Muy nuevo (2026), Astro 7 oficialmente soporta 18/20/22. Funciona hoy (build 302ms) pero vigilar en CI 20 LTS.
- **Typescript como dependency no dev:** `typescript@5.9.3` está en `dependencies` (via `pnpm add --save`), mover a `devDependencies` con `pnpm add -D` en limpieza.

## 11. Final Verification

- [x] `pnpm install` — 364ms, Already up to date
- [x] `pnpm run check` (`npx astro check`) — 0 errors, 0 warnings, 0 hints (19 files, types generated 21ms)
- [x] `pnpm run build` — 296ms, 1 page, Complete
- [x] `pnpm run preview` — 200 OK, 31294 B, `http://localhost:4334`
- [x] Routes — `/` PASS (única ruta, `src/pages/index.astro`)
- [x] Mobile — Header hamburger `Menu`, slide panel, snap 8 secciones, footer
- [x] Desktop — nav `Vehicles..Shop`, secondary, backdrop blur, parallax 15%
- [x] SEO — `<title>`, meta, canonical, OG, twitter, JSON-LD Organization+Product, favicon light/dark
- [x] Assets — 8 avif + 1 webm + favicon servidos, `/_astro/*.css` 20K
- [x] Animations — `reveal` fade/translate, `animate-bounce`, `IntersectionObserver thr 0.9/0.2/0.6`, `prefers-reduced-motion` respeta

**Estado:** ✅ Migrado y estable, listo para Cybertruck (no implementado).
