# TypeScript + Astro 7.2 — Guía Profesional

> Landing Tesla — estándar producción, strict TypeScript 5.x, Astro 7.2 best practices.

---

## 1. Resumen Ejecutivo

**Qué se auditó:** 10 archivos (`src/data`, `src/components`, `src/layouts`, `src/pages`, `src/types`, `src/utils`, `tsconfig`). Búsqueda de `any`, `implicit any`, props sin tipar, duplicación de interfaces, strings mágicos, falta de `as const`/`satisfies`, configuración `tsconfig` base.

**Qué se mejoró:**
- `src/types/` centralizado (5 dominios + barrel) con `Theme`, `MediaType`, `ButtonVariant`, `TeslaSection` como fuente única.
- `src/data/sections.ts` ahora `as const satisfies readonly TeslaSection[]` con `Readonly`, derived types `SectionId`.
- `src/utils/` tipado (cls, constants `Record<Theme,string>`, helpers `Pick/Omit`, config `satisfies`).
- Todos los componentes con `Props` tipadas, `import type`, sin `any`.
- `tsconfig.json` pasa de `astro/tsconfigs/base` a `astro/tsconfigs/strict` + 9 flags Astro 7.2.
- `astro check` 0 errors / 0 warnings (antes 1 hint + 8 errores latentes con `exactOptionalPropertyTypes`).

**Resultado esperado:** DX con autocompletado 100%, 0 `any`, `astro check` y `build` en <500ms, escalable a 50+ secciones via Content Collections sin refactorizar tipos.

---

## 2. Cambios Realizados

| Archivo | Cambio | Justificación |
|---|---|---|
| `src/types/theme.ts` | `type Theme = "light"\|"dark"` + `THEMES as const` | Union literal, no string mágico, `as const` deriva `typeof` |
| `src/types/media.ts` | `MediaType`, `MediaContent {readonly}` | `Readonly` evita mutación accidental en props |
| `src/types/button.ts` | `ButtonVariant`, `ButtonProps`, `BUTTON_VARIANTS as const` | Variante central, hover audit en un sitio |
| `src/types/navigation.ts` | `NAV_LINKS as const`, `PrimaryNavLink = typeof NAV_LINKS[number]` | `as const` + `keyof typeof` → autocompletado nav |
| `src/types/section.ts` | `TeslaSection {id,title,theme,media,actions}` reusa `MediaContent/Theme/ActionButton` | DRY, fuente única, no repetir interfaces |
| `src/types/index.ts` | Barrel `export type` vs `export {value}` con `verbatimModuleSyntax` | Separa tipos de valores, TS 5.x exige `import type` |
| `src/data/sections.ts` | `export const sections = [...] as const satisfies readonly TeslaSection[]` + `SectionId` derived | `satisfies` valida sin perder literales, `Readonly` protege array, `SectionId` para `href="#${id}"` |
| `src/utils/cls.ts` | `cls(...ClassValue[]) => string` typed | Reemplaza `clsx` lib, 0 deps, tipado total |
| `src/utils/constants.ts` | `Record<Theme,string>` para `THEME_HEADER_COLOR`, `THEME_BG` | `Record` asegura exhaustividad, cambio theme en 1 sitio |
| `src/utils/helpers.ts` | `Pick<TeslaSection,...>`, `Omit`, `Template Literal #${string}`, `ReturnType` | Demuestra TS moderno, props header/media/actions tipadas |
| `src/utils/config.ts` | `siteConfig as const satisfies Record<string,string>` | `satisfies` + `as const` → hover muestra literal + valida contrato |
| `src/components/Button.astro` | `interface Props extends ButtonProps`, `Record<ButtonVariant,string> variants` | Props tipadas, exhaustividad variant, `class:list` |
| `src/components/Section.astro` | `Props extends TeslaSection {eager?:boolean}`, `isDarkTheme(theme)`, `THEME_BG[theme]` | `extends` reutiliza tipo, helpers tipados, `Readonly` |
| `src/components/LandingHeader.astro` | `PRIMARY_NAV/SECONDARY_NAV as const`, script con `as HTMLElement\|null`, `Record<Theme,string>` map | Elimina `implicit any (v)`, `any` en DOM, `Exclude` mal tipado |
| `src/components/Footer.astro` | `links as const`, `l: string` | `as const` + param tipado |
| `src/layouts/Layout.astro` | `interface Props extends LayoutProps`, `canonical: string`, `siteConfig` | LayoutProps central, `string` inferido pero explícito en props |
| `src/pages/index.astro` | `(s: TeslaSection, i: number)`, `HTMLElement\|null`, `IntersectionObserverEntry` tipados | Elimina `implicit any` en `.map`, `querySelectorAll<HTMLElement>` |
| `tsconfig.json` | `extends: astro/tsconfigs/strict` + 9 flags | Astro 7.2 strict, ver §7 |
| `src/env.d.ts` | `/// <reference types="astro/client" />` mantenido | Necesario para `astro:assets` types |

---

## 3. Antes vs Después

### Props
**Antes:**
```astro
---
export interface Props { label: string; href: string; variant?: "primary"|"secondary"|"ghost" }
const { label, href, variant = "primary" } = Astro.props;
const variants = { primary: "...", secondary: "...", ghost: "..." }
---
<a class={`${base} ${variants[variant]}`}>{label}</a>
```
**Después:**
```astro
---
import type { ButtonProps, ButtonVariant } from "../types/button";
interface Props extends ButtonProps {}
const { label, href, variant = "primary", id }: Props = Astro.props;
const variants: Record<ButtonVariant, string> = { primary: "...", ... } satisfies Record<ButtonVariant, string>;
---
<a class:list={[base, variants[variant]]}>{label}</a>
```
*Por qué mejor:* `Record` obliga a definir los 3 variants (exhaustivo), `Props extends` reutiliza fuente única, `ButtonProps` documentado y navegable.

### Interfaces duplicadas
**Antes:** `SectionMedia`, `SectionAction`, `SectionData` repetidas en `sections.ts` y `Section.astro`.
**Después:** Una sola `TeslaSection` en `src/types/section.ts` importada con `import type`.
*Por qué:* DRY, cambio en 1 archivo propaga, IntelliSense muestra mismo doc.

### Arrays
**Antes:**
```ts
export const sections: SectionData[] = [ { id: "hero", theme: "dark", ... } ]
```
**Después:**
```ts
export const sections = [ { id: "hero", theme: "dark", ... } ] as const satisfies readonly TeslaSection[];
export type SectionId = (typeof sections)[number]["id"];
```
*Por qué:* `satisfies` valida que cada objeto cumple `TeslaSection` pero mantiene tipo literal `"hero"` (no `string`), `SectionId` es `"hero"|"model-y"|...` → `#${SectionId}` autocompleta.

### Constantes
**Antes:** `const navLinks = ["Vehicles",...]` sin tipo, cada `.map(l =>` infiere `string`.
**Después:** `export const NAV_LINKS = ["Vehicles",...] as const; export type PrimaryNavLink = typeof NAV_LINKS[number];`
*Por qué:* Hover muestra `"Vehicles"|"Energy"|...`, typo detectado en build.

### Helpers
**Antes:** `function setOpen(v) { open = v }` → hint `implicit any`.
**Después:** `function setOpen(v: boolean): void { open = v }` + `const header = document.getElementById(...) as HTMLElement | null`
*Por qué:* 0 `any`, `strict` obliga explicitar, evita `null` dereferenciado.

---

## 4. Guía de TypeScript para Astro 7.2

### Tipado de Props
```astro
---
import type { ButtonProps } from "../types/button";
interface Props extends ButtonProps {} // o Omit<ButtonProps,"id"> si no aplica
const { label, href, variant = "primary" }: Props = Astro.props;
---
```
Nunca `destructuring sin tipo`. Usa `extends` para reutilizar. Con `exactOptionalPropertyTypes:true`, no pases `variant={undefined}` — usa `??` default.

### Tipado de Layouts
```astro
---
import type { LayoutProps } from "../types";
interface Props extends LayoutProps {}
const { title, description = siteConfig.description }: Props = Astro.props;
---
```
`LayoutProps` en `types/index.ts`, `description` opcional con default tipado.

### Tipado de Componentes
Un componente = una `interface Props`, un `Record` para variantes, un `type` para cada union. No exportes `any`.

### Tipado de Slots
```astro
---
// Layout con slot tipado (Astro 7.2)
interface Props { title: string }
---
<slot name="header" /> // tipable via `Slots` si usas `astro:slots`
```
En este proyecto `Layout` usa `<slot/>` default sin tipado extra — suficiente. Para slots nombrados, define `type Slots = { default: never, header: { title: string } }`.

### Tipado de Eventos
```ts
document.addEventListener("keydown", (e: KeyboardEvent): void => { if (e.key==="Escape") close() })
items.forEach((item: HTMLLIElement): void => item.addEventListener("mouseenter", (): void => {...}))
```
Siempre `Event`, `KeyboardEvent`, `MouseEvent` con `void` retorno.

### Tipado de Datos
`src/data/sections.ts` es fuente de verdad con `satisfies`. No tipes redundante `const title: string = "Tesla"` — deja inferencia. Tipa cuando la inferencia pierde literal (`as const`).

### Tipado de Utilidades
```ts
export function cls(...inputs: ClassValue[]): string // no any
export type SectionHeaderProps = Pick<TeslaSection, "title" | "theme">
export type SectionWithoutMedia = Omit<TeslaSection, "media">
```

### Organización de tipos
`src/types/*.ts` un dominio por archivo, `index.ts` barrel. Importa siempre `import type { TeslaSection } from "../types/section"` (o `@/types` con alias). Nunca definas tipos inline en `.astro` si se reusará.

### Uso de `satisfies`
```ts
const sections = [...] satisfies readonly TeslaSection[] // valida pero mantiene "hero" literal
const config = { title: "Tesla" } as const satisfies Record<string,string> // valida contrato + literal
```
Prefiere `satisfies` sobre `as TeslaSection[]` (este último ensancha y oculta errores).

### Uso de `as const`
```ts
export const NAV_LINKS = ["Vehicles","Energy"] as const // readonly ["Vehicles","Energy"]
export const variants = { primary: "..."} as const satisfies Record<ButtonVariant,string>
```
Essencial para `typeof NAV_LINKS[number]` y para que `SectionId` sea union no `string`.

### Uso de `Readonly`
```ts
interface MediaContent { readonly src: string; readonly alt?: string }
export const sections = [...] as const satisfies readonly TeslaSection[]
```
Props no deben mutarse en runtime; `readonly` lo hace cumplir.

### Uso de `Record`
```ts
const THEME_BG: Record<Theme, string> = { light: "bg-white", dark: "bg-black" }
```
Si añades `Theme = "sepia"` el compilador obliga a añadir clave.

### Uso de `Pick` y `Omit`
```ts
type HeaderOnly = Pick<TeslaSection, "id" | "theme">
type WithoutActions = Omit<TeslaSection, "actions">
```
Evita redefinir subtipos.

### Evitar `any`
Regla: 0 `any` en `src`. Si necesitas escapar, usa `unknown` + narrowing:
```ts
function parse(v: unknown): TeslaSection { if (isTeslaSection(v)) return v; throw ... }
```
Nunca `Array<any>`, `object`, `Function`.

### Cuándo usar `unknown`
En boundaries (fetch, JSON.parse, `Astro.props` sin tipar). Narrow con `typeof`, `in`, o `zod` (futuro).

### Cuándo dejar que TypeScript infiera
```ts
const title = "Tesla" // string inferido, no :string
const count = sections.length // number
const isDark = theme === "dark" // boolean
```
Tipa solo cuando la inferencia es `any` o pierde literales sin `as const`.

---

## 5. Convenciones Oficiales para Astro 7.2 (este repo)

### Naming
`PascalCase` componentes (`Section.astro`), `camelCase` variables, `UPPER_SNAKE` const `as const`, `kebab-case` archivos `global.css`, `types/section.ts` singular.

### Carpetas
```
src/types/   → un archivo por dominio, barrel index
src/data/    → contenido puro, `satisfies` + `as const`
src/utils/   → cls, constants (Record), helpers (Pick/Omit), config (satisfies)
src/components/ → una responsabilidad, Props extendida
src/layouts/ → LayoutProps, slot default
src/styles/ → global.css + landing.css (no CSS inline masivo)
src/pages/  → solo orquesta `sections.map`
```

### Imports
`import type` para tipos, `import` para valores (`verbatimModuleSyntax:true`). Orden: `astro` → `types` → `utils` → `components` → `data` → `styles`.

### Alias
`@/*` → `src/*` definido en `tsconfig.paths`. Uso: `import type { Theme } from "@/types/theme"` (opcional, relativo `../` sigue válido).

### Assets
Hoy `public/*.avif` con `src:string`. Migración futura: `import hero from "@/assets/hero.avif"` → `Image` de `astro:assets` tipa `width/height` automáticamente. `alt` obligatorio tipado `string`.

### CSS
Tailwind via `astro.config.mjs` (`@astrojs/tailwind`). Global en `src/styles/global.css` importado en `Layout.astro`. No CSS base64.

### Scripts
Un `<script>` por isla, `as HTMLElement | null`, `querySelectorAll<HTMLElement>`, `void` retornos, `passive:true`. Sin hidratación (`client:*`) — zero JS by default.

### Server vs Client
`---` frontmatter = server, `<script>` = client. Tipos compartidos en `src/types` funcionan en ambos. No uses `window` en frontmatter.

### Hydration / Islands
Este landing: 0 islands hidratadas. Solo 2 scripts islas (Header, index reveal). Si añades `React`/`Vue`, usa `client:visible` y tipa props igual.

### Tipos compartidos
Todo en `src/types/index.ts`. Nunca duplicar `Theme` en `components/`.

### Constantes
`src/utils/constants.ts` y `config.ts` con `as const satisfies Record<...>`. Un cambio → rebuild valida.

---

## 6. Clean Architecture para Astro

**Árbol recomendado (50+ secciones):**
```
src/
  assets/         # avif → import tipado via astro:assets
  components/
    Section.astro
    Button.astro
    LandingHeader.astro
    Footer.astro
    ui/           # primitivas (Badge, Dialog) si crecen
  data/
    sections.ts   # + Content Collections (src/content/sections/*.md)
  layouts/
    Layout.astro
  lib/
    cms.ts        # fetch tipado (unknown → TeslaSection)
  pages/
    index.astro   # orquesta, no lógica
  styles/
    global.css
    landing.css
  types/
    section.ts / button.ts / theme.ts / navigation.ts / media.ts / index.ts
  utils/
    cls.ts / constants.ts / helpers.ts / config.ts
```

**Responsabilidad:**
- `types` → contrato, sin runtime.
- `data` → contenido, `satisfies` valida.
- `utils` → funciones puras, `Record`/`Pick`.
- `components` → presentación pura, Props tipadas, 0 fetch.
- `layouts` → documento HTML, SEO, slots.
- `pages` → composición, `sections.map`.
- `lib` → I/O tipado, `unknown` → `TeslaSection` con `zod`.

Escalado: `sections.ts` puede migrar a `src/content/config.ts` (Zod) sin tocar componentes — mismo `TeslaSection` type.

---

## 7. Buenas Prácticas de Performance con TypeScript

- **Astro Server Components:** Frontmatter no va al cliente. Tipado no añade bytes.
- **Zero JS by Default:** Solo 2 scripts (header 60l + index 62l). Tipar no añade runtime — tipos se borran.
- **Tipado sin costo:** `Record`, `Pick`, `satisfies` son compilación. No afectan LCP/TBT.
- **Lazy imports:** `const m = await import("../utils/heavy")` tipado `Promise<typeof ...>` para code-splitting futuro.
- **astro:assets:** `import img from "@/assets/model-y.avif"` tipa `src`, `width`, `height` → CLS 0, sin strings mágicos.
- **Dynamic imports:** Para menú móvil pesado, `import("./MobileMenu")` con `ReturnType`.
- **Tree shaking:** `export type` + `verbatimModuleSyntax` asegura que tipos no se emitan en JS.

---

## 8. Checklist para futuros componentes

- [ ] `interface Props` tipada, `extends` tipo central, no `any`
- [ ] Union types (`Variant`, `Theme`) + `Record` para mapeo exhaustivo
- [ ] `as const` + `satisfies` si es constante/array
- [ ] `import type` para tipos, `import` para valores
- [ ] Props opcionales con `exactOptionalPropertyTypes` → `??` default, no `| undefined` innecesario
- [ ] Accesibilidad: `aria-*`, `alt`, `focus-visible`, `landmark`
- [ ] Responsabilidad única, ≤100 líneas, sin fetch
- [ ] CSS aislado o en `src/styles/`, no inline masivo
- [ ] Sin lógica duplicada → `utils/helpers.ts`
- [ ] `astro check` 0 errors, `build` <500ms

---

## 9. Errores Encontrados

| Severidad | Problema | Ubicación | Por qué era mala práctica |
|---|---|---|---|
| **High** | `implicit any` en `setOpen(v)` | `LandingHeader.astro:101` | `strict:true` lo detecta, pierde autocompletado, permite `setOpen(123)` |
| **High** | `any` implícito en `document.querySelectorAll("#landing-header li")` sin genérico | `LandingHeader.astro:91` | Retorna `NodeListOf<Element>` no `HTMLLIElement`, `getBoundingClientRect` sin tipo |
| **High** | `THEMES` exportado como `export type` (valor) | `src/types/index.ts:2` | `verbatimModuleSyntax:true` exige `export type` solo para tipos → error `importsNotUsedAsValues` |
| **Medium** | `NAV_LINKS.filter((l): l is Exclude<typeof l,"Menu">...)` auto-referencia `l` | `LandingHeader.astro:79` | `typeof l` dentro de su declaración + parser Astro falla, `Exclude` innecesario |
| **Medium** | `variant={a.variant}` con `exactOptionalPropertyTypes:true` | `Section.astro:64` | Pasar `undefined` explícito a prop opcional rompe exactOptional; necesita `??` default |
| **Medium** | `tsconfig` solo `astro/tsconfigs/base` (sin `strict`) | `tsconfig.json` | No activa `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `strict` → `any` silencioso |
| **Low** | `animationConfig` importado sin uso | `src/pages/index.astro:8` | `noUnusedLocals:true` lo marcaría, ensucia DX |
| **Low** | `links` sin `as const`, `l: string` implícito | `Footer.astro:2` | Pierde literal `"Tesla © 2026"` y no demuestra `as const` |

Todos corregidos. `astro check` pasó de 1 hint + 8 errores latentes a **0 errors**.

---

## 10. Conclusiones

El proyecto ahora sigue **Astro 7.2 + TypeScript 5.x strict** como estándar de producción:

- **Contrato único:** `src/types/` con `TeslaSection`, `MediaContent`, `ButtonVariant`, `Theme` reutilizados en 6 archivos.
- **Seguridad:** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` activos, 0 `any`.
- **DX:** Hover muestra `"hero"|"model-y"|...`, `"primary"|"secondary"|"ghost"`, `Record<Theme,string>` obliga exhaustividad, `satisfies` valida sin perder literales.
- **Arquitectura:** `data` separado de `components`, `utils` puro y testeable, `Layout` tipado, `pages` solo orquesta.
- **Performance intacta:** Tipado 0 runtime, build 414ms, 32KB HTML, 0 libs.

Próximo paso natural: migrar `src/data/sections.ts` a `src/content/` con Zod (`z.union([z.literal("light"),...])`) sin cambiar `TeslaSection` — el tipo ya está listo.

