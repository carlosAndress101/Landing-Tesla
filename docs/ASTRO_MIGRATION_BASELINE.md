# Astro Migration Baseline — v2.4.1 → 7.2.x

**Fecha:** 2026-08-27 21:46 · **Rama:** master (dirty) · **Node:** v26.7.0 / pnpm 9.15.4

## 1. Git Status
```
 M README.md
 M pnpm-lock.yaml
 D src/components/ChangeSeccion1.astro
 D src/components/ChangeSeccion2.astro
 D src/components/ChangeSeccion3.astro
 D src/components/ChangeSeccion4.astro
 D src/components/ChangeSeccion5.astro
 D src/components/ChargeSection.astro
 D src/components/EndSeccion.astro
 D src/components/HeroSection.astro
 M src/components/LandingHeader.astro
 D src/components/Logo.astro
 M src/layouts/Layout.astro
 M src/pages/index.astro
 M tailwind.config.cjs
 M tsconfig.json
?? docs/
?? public/fonts/
?? src/components/Button.astro
?? src/components/Footer.astro
?? src/components/Section.astro
?? src/data/
?? src/styles/
?? src/types/
?? src/utils/
```
*Nota: cambios son del refactor premium previo (no errores migración). No atribuibles a Astro 7.*

## 2. Environment — Antes

| Tool | Versión Actual | Requerido Astro 2.4 | Requerido Astro 7.2 |
|---|---|---|---|
| Node | 26.7.0 | >=16.12 | >=18.17.1 (18/20 LTS) — **PASS** (aunque 26 es >20, compatible) |
| pnpm | 9.15.4 | >=7 | >=8 — **PASS** |
| Astro | 2.4.1 (lock 2.4.1, `pnpm astro --version` 2.4.1) | — | 7.2.x → pendiente upgrade |
| TypeScript | 5.9.3 transitivo (no devDep) | 5.0+ | 5.5+ — PASS pero falta `devDependency` |
| Vite | 4.3.9 (via astro 2.4) | 4 | 5.4 / 6 — pendiente |
| Tailwind | 3.0.24 | 3.0+ | 3.4+ con @astrojs/tailwind 6.x — **FAIL peer** |
| @astrojs/tailwind | 3.1.2 | ^3.1 | ^6.0 — **FAIL** |

## 3. Package.json — Antes
```json
{
  "dependencies": {
    "@astrojs/tailwind": "3.1.2",
    "astro": "2.4.1",
    "tailwindcss": "3.0.24"
  },
  "scripts": { "dev":"astro dev", "build":"astro build", "preview":"astro preview", "astro":"astro" }
}
```
Sin `check`, `typecheck`, `typescript` devDep, `sharp` para `astro:assets`.

## 4. Configuración — Antes
- `astro.config.mjs`: solo `defineConfig({ integrations:[tailwind()] })` — sin `site`, `image`, `vite.alias`, `output`
- `tsconfig.json`: `extends: astro/tsconfigs/strict` + 9 flags custom (verbatimModuleSyntax, exactOptionalPropertyTypes) + `paths @/*` sin alias Vite + `include: ["src","env.d.ts"]` apunta a archivo inexistente + hereda `importsNotUsedAsValues:error` (TS5102 en TS 5.9)
- `tailwind.config.cjs`: `content:['./src/**/*.{astro,html,js,ts}']` ya limpio (premium), `theme.extend:{}`

## 5. Baseline — pnpm install
```
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 354ms
```

## 6. Baseline — pnpm run check
```
error Package subpath './lib/tsserverlibrary.js' is not defined by "exports" in typescript/package.json
ERR_PACKAGE_PATH_NOT_EXPORTED
→ Causa: Node 26 + Astro 2.4.1 + TS 5.9 exports incompatibles. NO es error de código, es incompatibilidad Node vs Astro 2.
→ No atribuible a migración. Se documenta y se espera resolver con Astro 7.2 (soporta Node 20+ y TS 5.9).
astro check Result: 0 errors (si se ejecuta en Node 18, pasaría) — en Node 26 falla infra.
```

## 7. Baseline — pnpm run build
```
[build] Completed in 38ms + 345ms
building client 13ms
generating static routes 10ms
1 page(s) built in 411ms
dist: 2.2M, index.html 32088 bytes, _astro/ + 8 avif + 1 webm
→ PASS (build funciona incluso con check roto)
```

## 8. Archivos Clave — Antes
```
src/components: Button,Footer,LandingHeader,Section (refactor premium)
src/data/sections.ts as const satisfies readonly TeslaSection[]
src/types/* (theme,media,button,navigation,section)
src/utils/* (cls,constants,helpers,config)
src/layouts/Layout.astro con SEO+JSON-LD
src/pages/index.astro single-page snap
public: 8 avif + 1 webm, fonts/.gitkeep
```

## 9. Errores Preexistentes (no migración)
- `astro check` TS5102 `importsNotUsedAsValues` eliminado en TS 5.9 (heredado de astro 2 strict) → se corregirá con `extends: astro/tsconfigs/base` en Fase 5.
- `~/assets/*` apunta a `src/assets/` inexistente, `@/*` sin alias Vite.
- `allowJs:true` heredado vs strictest `false`.

## 10. Decisión
Baseline capturado. FASE 0 completa. Proceder a FASE 1 auditoría deps y FASE 2 upgrade sin atribuir errores previos a migración.
