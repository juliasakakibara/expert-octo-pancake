# Work order — Figma library → Pancake DS (2026-10-01)

**For:** a Figma agent (Claude with the Figma MCP `use_figma`, or the Figma Console MCP) working in the library file `iMysuIxqcsHZ4OpffFKYMp`.
**Why:** the code moved to Pancake DS on `feature/pancake-ds` (prefix `--pds-*`, neutral greys, `#0A5CFF` blue). `npm run validate -- --strict` fails until the library matches. Code is the source; Figma follows.
**Source of the IDs below:** the variable export of 2026-10-01 20:41, diffed against `node scripts/figma/tokens-to-figma.mjs`.

## The one rule: edit in place, never recreate

Every component fill, stroke, text style field and effect is bound to a variable by its **ID**. Deleting a variable and creating a new one with the same name breaks every binding and every alias pointing at it. So:

- **Rename** with `variable.name = …`. Never `variable.remove()` + `createVariable()`.
- **Change values** with `variable.setValueForMode(modeId, …)`. Never detach or rebind component layers.
- **Re-point aliases** with `figma.variables.createVariableAlias(target)` on the existing variable.
- **Do not** use Figma's Variables → Import for this: an import that does not match by ID can create duplicates.
- **Do not** touch components, text styles' bindings, effect styles' bindings, modes, collections, scopes or keys. Their IDs and keys are what `figma/manifest.json` and every consuming file reference.
- Writes are sequential. Re-run is safe: every step is idempotent (it sets a target state).

## Changes, in order

### 1. Rename `color/brand/indigo/*` → `color/brand/blue/*` (Color Primitives, 10)

| Variable ID | From | To |
| --- | --- | --- |
| `VariableID:4:14` | `color/brand/indigo/50` | `color/brand/blue/50` |
| `VariableID:4:15` | `color/brand/indigo/100` | `color/brand/blue/100` |
| `VariableID:4:16` | `color/brand/indigo/200` | `color/brand/blue/200` |
| `VariableID:4:17` | `color/brand/indigo/300` | `color/brand/blue/300` |
| `VariableID:4:18` | `color/brand/indigo/400` | `color/brand/blue/400` |
| `VariableID:4:19` | `color/brand/indigo/500` | `color/brand/blue/500` |
| `VariableID:4:20` | `color/brand/indigo/600` | `color/brand/blue/600` |
| `VariableID:4:21` | `color/brand/indigo/700` | `color/brand/blue/700` |
| `VariableID:4:22` | `color/brand/indigo/800` | `color/brand/blue/800` |
| `VariableID:4:23` | `color/brand/indigo/900` | `color/brand/blue/900` |

### 2. New primitive values (Color Primitives, mode `Value`, 21)

| Variable ID | Name (after step 1) | From | To |
| --- | --- | --- | --- |
| `VariableID:4:3` | `color/neutral/50` | `#f8f9fa` | `#fafafa` |
| `VariableID:4:4` | `color/neutral/100` | `#f1f3f5` | `#f3f3f3` |
| `VariableID:4:5` | `color/neutral/200` | `#e9ecef` | `#ebebeb` |
| `VariableID:4:6` | `color/neutral/300` | `#dee2e6` | `#e1e1e1` |
| `VariableID:4:7` | `color/neutral/400` | `#ced4da` | `#d2d2d2` |
| `VariableID:4:8` | `color/neutral/500` | `#adb5bd` | `#b2b2b2` |
| `VariableID:4:9` | `color/neutral/600` | `#868e96` | `#8c8c8c` |
| `VariableID:4:10` | `color/neutral/700` | `#495057` | `#4f4f4f` |
| `VariableID:4:11` | `color/neutral/800` | `#343a40` | `#393939` |
| `VariableID:4:12` | `color/neutral/900` | `#212529` | `#212121` |
| `VariableID:4:13` | `color/neutral/950` | `#121416` | `#131313` |
| `VariableID:4:14` | `color/brand/blue/50` | `#eef2ff` | `#eef4ff` |
| `VariableID:4:15` | `color/brand/blue/100` | `#e0e7ff` | `#dae6ff` |
| `VariableID:4:16` | `color/brand/blue/200` | `#c7d2fe` | `#bcd2ff` |
| `VariableID:4:17` | `color/brand/blue/300` | `#a5b4fc` | `#8eb4ff` |
| `VariableID:4:18` | `color/brand/blue/400` | `#818cf8` | `#5a8eff` |
| `VariableID:4:19` | `color/brand/blue/500` | `#6366f1` | `#3071ff` |
| `VariableID:4:20` | `color/brand/blue/600` | `#4f46e5` | `#0a5cff` |
| `VariableID:4:21` | `color/brand/blue/700` | `#4338ca` | `#0047d6` |
| `VariableID:4:22` | `color/brand/blue/800` | `#3730a3` | `#003aad` |
| `VariableID:4:23` | `color/brand/blue/900` | `#312e81` | `#002f85` |

`color/neutral/white` stays `#ffffff`. No other primitive changes.

### 3. Re-point dark-mode accent aliases (Color, mode `Dark`, 8)

Light mode is unchanged: its aliases already point at `…/600`, `…/700`, `…/800`, `…/50`, `…/500`, which the rename carries over. Only Dark moves.

| Variable ID | Role | Dark: from | Dark: to |
| --- | --- | --- | --- |
| `VariableID:6:7` | `color/background/accent` | `color/brand/indigo/500` | `color/brand/blue/400` |
| `VariableID:6:8` | `color/background/accent-hover` | `color/brand/indigo/400` | `color/brand/blue/300` |
| `VariableID:6:9` | `color/background/accent-active` | `color/brand/indigo/300` | `color/brand/blue/200` |
| `VariableID:6:21` | `color/content/accent` | `color/brand/indigo/500` | `color/brand/blue/300` |
| `VariableID:6:25` | `color/content/on-accent` | `color/neutral/white` | `color/neutral/950` |
| `VariableID:6:31` | `color/border/focus` | `color/brand/indigo/400` | `color/brand/blue/300` |
| `VariableID:6:32` | `color/border/accent` | `color/brand/indigo/500` | `color/brand/blue/400` |
| `VariableID:6:33` | `color/border/accent-hover` | `color/brand/indigo/400` | `color/brand/blue/300` |

### 4. Code syntax `--sds-` → `--pds-` (all collections, 173)

Every variable's WEB code syntax is `var(--pds-<name with / as ->)`, so Dev Mode points at the real CSS variable. The three `elevation/*/color` variables have no code syntax on purpose (`codeSyntaxExceptions` in the manifest): leave them empty. The 10 blue primitives also change their name part, e.g. `var(--sds-color-brand-indigo-600)` → `var(--pds-color-brand-blue-600)`.

<details><summary>Full list (173)</summary>

| Variable ID | Collection | Name | To |
| --- | --- | --- | --- |
| `VariableID:4:3` | Color Primitives | `color/neutral/50` | `var(--pds-color-neutral-50)` |
| `VariableID:4:4` | Color Primitives | `color/neutral/100` | `var(--pds-color-neutral-100)` |
| `VariableID:4:5` | Color Primitives | `color/neutral/200` | `var(--pds-color-neutral-200)` |
| `VariableID:4:6` | Color Primitives | `color/neutral/300` | `var(--pds-color-neutral-300)` |
| `VariableID:4:7` | Color Primitives | `color/neutral/400` | `var(--pds-color-neutral-400)` |
| `VariableID:4:8` | Color Primitives | `color/neutral/500` | `var(--pds-color-neutral-500)` |
| `VariableID:4:9` | Color Primitives | `color/neutral/600` | `var(--pds-color-neutral-600)` |
| `VariableID:4:10` | Color Primitives | `color/neutral/700` | `var(--pds-color-neutral-700)` |
| `VariableID:4:11` | Color Primitives | `color/neutral/800` | `var(--pds-color-neutral-800)` |
| `VariableID:4:12` | Color Primitives | `color/neutral/900` | `var(--pds-color-neutral-900)` |
| `VariableID:4:13` | Color Primitives | `color/neutral/950` | `var(--pds-color-neutral-950)` |
| `VariableID:4:2` | Color Primitives | `color/neutral/white` | `var(--pds-color-neutral-white)` |
| `VariableID:4:14` | Color Primitives | `color/brand/blue/50` | `var(--pds-color-brand-blue-50)` |
| `VariableID:4:15` | Color Primitives | `color/brand/blue/100` | `var(--pds-color-brand-blue-100)` |
| `VariableID:4:16` | Color Primitives | `color/brand/blue/200` | `var(--pds-color-brand-blue-200)` |
| `VariableID:4:17` | Color Primitives | `color/brand/blue/300` | `var(--pds-color-brand-blue-300)` |
| `VariableID:4:18` | Color Primitives | `color/brand/blue/400` | `var(--pds-color-brand-blue-400)` |
| `VariableID:4:19` | Color Primitives | `color/brand/blue/500` | `var(--pds-color-brand-blue-500)` |
| `VariableID:4:20` | Color Primitives | `color/brand/blue/600` | `var(--pds-color-brand-blue-600)` |
| `VariableID:4:21` | Color Primitives | `color/brand/blue/700` | `var(--pds-color-brand-blue-700)` |
| `VariableID:4:22` | Color Primitives | `color/brand/blue/800` | `var(--pds-color-brand-blue-800)` |
| `VariableID:4:23` | Color Primitives | `color/brand/blue/900` | `var(--pds-color-brand-blue-900)` |
| `VariableID:4:24` | Color Primitives | `color/utility/green/100` | `var(--pds-color-utility-green-100)` |
| `VariableID:4:25` | Color Primitives | `color/utility/green/300` | `var(--pds-color-utility-green-300)` |
| `VariableID:4:26` | Color Primitives | `color/utility/green/500` | `var(--pds-color-utility-green-500)` |
| `VariableID:4:27` | Color Primitives | `color/utility/green/600` | `var(--pds-color-utility-green-600)` |
| `VariableID:4:28` | Color Primitives | `color/utility/green/700` | `var(--pds-color-utility-green-700)` |
| `VariableID:4:29` | Color Primitives | `color/utility/yellow/100` | `var(--pds-color-utility-yellow-100)` |
| `VariableID:4:30` | Color Primitives | `color/utility/yellow/300` | `var(--pds-color-utility-yellow-300)` |
| `VariableID:4:31` | Color Primitives | `color/utility/yellow/500` | `var(--pds-color-utility-yellow-500)` |
| `VariableID:4:32` | Color Primitives | `color/utility/yellow/600` | `var(--pds-color-utility-yellow-600)` |
| `VariableID:4:33` | Color Primitives | `color/utility/yellow/700` | `var(--pds-color-utility-yellow-700)` |
| `VariableID:4:34` | Color Primitives | `color/utility/red/100` | `var(--pds-color-utility-red-100)` |
| `VariableID:4:35` | Color Primitives | `color/utility/red/300` | `var(--pds-color-utility-red-300)` |
| `VariableID:4:36` | Color Primitives | `color/utility/red/500` | `var(--pds-color-utility-red-500)` |
| `VariableID:4:37` | Color Primitives | `color/utility/red/600` | `var(--pds-color-utility-red-600)` |
| `VariableID:4:38` | Color Primitives | `color/utility/red/700` | `var(--pds-color-utility-red-700)` |
| `VariableID:6:2` | Color | `color/background/default` | `var(--pds-color-background-default)` |
| `VariableID:6:3` | Color | `color/background/surface` | `var(--pds-color-background-surface)` |
| `VariableID:6:4` | Color | `color/background/sunken` | `var(--pds-color-background-sunken)` |
| `VariableID:6:5` | Color | `color/background/overlay` | `var(--pds-color-background-overlay)` |
| `VariableID:6:6` | Color | `color/background/on-accent` | `var(--pds-color-background-on-accent)` |
| `VariableID:6:7` | Color | `color/background/accent` | `var(--pds-color-background-accent)` |
| `VariableID:6:8` | Color | `color/background/accent-hover` | `var(--pds-color-background-accent-hover)` |
| `VariableID:6:9` | Color | `color/background/accent-active` | `var(--pds-color-background-accent-active)` |
| `VariableID:6:10` | Color | `color/background/accent-subtle` | `var(--pds-color-background-accent-subtle)` |
| `VariableID:6:11` | Color | `color/background/danger` | `var(--pds-color-background-danger)` |
| `VariableID:6:12` | Color | `color/background/danger-hover` | `var(--pds-color-background-danger-hover)` |
| `VariableID:6:13` | Color | `color/background/danger-subtle` | `var(--pds-color-background-danger-subtle)` |
| `VariableID:6:14` | Color | `color/background/success` | `var(--pds-color-background-success)` |
| `VariableID:6:15` | Color | `color/background/success-subtle` | `var(--pds-color-background-success-subtle)` |
| `VariableID:6:16` | Color | `color/background/warning` | `var(--pds-color-background-warning)` |
| `VariableID:6:17` | Color | `color/background/warning-subtle` | `var(--pds-color-background-warning-subtle)` |
| `VariableID:6:18` | Color | `color/content/default` | `var(--pds-color-content-default)` |
| `VariableID:6:19` | Color | `color/content/muted` | `var(--pds-color-content-muted)` |
| `VariableID:6:20` | Color | `color/content/inverse` | `var(--pds-color-content-inverse)` |
| `VariableID:6:21` | Color | `color/content/accent` | `var(--pds-color-content-accent)` |
| `VariableID:6:22` | Color | `color/content/danger` | `var(--pds-color-content-danger)` |
| `VariableID:6:23` | Color | `color/content/success` | `var(--pds-color-content-success)` |
| `VariableID:6:24` | Color | `color/content/warning` | `var(--pds-color-content-warning)` |
| `VariableID:6:25` | Color | `color/content/on-accent` | `var(--pds-color-content-on-accent)` |
| `VariableID:6:26` | Color | `color/content/on-danger` | `var(--pds-color-content-on-danger)` |
| `VariableID:6:27` | Color | `color/content/on-success` | `var(--pds-color-content-on-success)` |
| `VariableID:6:28` | Color | `color/content/on-warning` | `var(--pds-color-content-on-warning)` |
| `VariableID:6:29` | Color | `color/border/default` | `var(--pds-color-border-default)` |
| `VariableID:6:30` | Color | `color/border/strong` | `var(--pds-color-border-strong)` |
| `VariableID:6:31` | Color | `color/border/focus` | `var(--pds-color-border-focus)` |
| `VariableID:6:32` | Color | `color/border/accent` | `var(--pds-color-border-accent)` |
| `VariableID:6:33` | Color | `color/border/accent-hover` | `var(--pds-color-border-accent-hover)` |
| `VariableID:6:34` | Color | `color/border/danger` | `var(--pds-color-border-danger)` |
| `VariableID:6:35` | Color | `color/border/success` | `var(--pds-color-border-success)` |
| `VariableID:6:36` | Color | `color/border/warning` | `var(--pds-color-border-warning)` |
| `VariableID:5:2` | Size | `space/0` | `var(--pds-space-0)` |
| `VariableID:5:3` | Size | `space/1` | `var(--pds-space-1)` |
| `VariableID:5:4` | Size | `space/2` | `var(--pds-space-2)` |
| `VariableID:5:5` | Size | `space/3` | `var(--pds-space-3)` |
| `VariableID:5:6` | Size | `space/4` | `var(--pds-space-4)` |
| `VariableID:5:7` | Size | `space/5` | `var(--pds-space-5)` |
| `VariableID:5:8` | Size | `space/6` | `var(--pds-space-6)` |
| `VariableID:5:9` | Size | `space/8` | `var(--pds-space-8)` |
| `VariableID:5:10` | Size | `space/10` | `var(--pds-space-10)` |
| `VariableID:5:11` | Size | `space/12` | `var(--pds-space-12)` |
| `VariableID:5:12` | Size | `radius/sm` | `var(--pds-radius-sm)` |
| `VariableID:5:13` | Size | `radius/md` | `var(--pds-radius-md)` |
| `VariableID:5:14` | Size | `radius/lg` | `var(--pds-radius-lg)` |
| `VariableID:5:15` | Size | `radius/full` | `var(--pds-radius-full)` |
| `VariableID:5:16` | Size | `breakpoint/sm` | `var(--pds-breakpoint-sm)` |
| `VariableID:5:17` | Size | `breakpoint/md` | `var(--pds-breakpoint-md)` |
| `VariableID:5:18` | Size | `breakpoint/lg` | `var(--pds-breakpoint-lg)` |
| `VariableID:5:19` | Size | `breakpoint/xl` | `var(--pds-breakpoint-xl)` |
| `VariableID:7:2` | Typography | `font/size/xs` | `var(--pds-font-size-xs)` |
| `VariableID:7:3` | Typography | `font/size/sm` | `var(--pds-font-size-sm)` |
| `VariableID:7:4` | Typography | `font/size/md` | `var(--pds-font-size-md)` |
| `VariableID:7:5` | Typography | `font/size/lg` | `var(--pds-font-size-lg)` |
| `VariableID:7:6` | Typography | `font/size/xl` | `var(--pds-font-size-xl)` |
| `VariableID:7:7` | Typography | `font/weight/regular` | `var(--pds-font-weight-regular)` |
| `VariableID:7:8` | Typography | `font/weight/medium` | `var(--pds-font-weight-medium)` |
| `VariableID:7:9` | Typography | `font/weight/bold` | `var(--pds-font-weight-bold)` |
| `VariableID:10:2` | Typography | `font/sans` | `var(--pds-font-sans)` |
| `VariableID:10:3` | Typography | `font/mono` | `var(--pds-font-mono)` |
| `VariableID:12:2` | Typography | `typography/heading-xl/font-family` | `var(--pds-typography-heading-xl-font-family)` |
| `VariableID:12:3` | Typography | `typography/heading-xl/font-size` | `var(--pds-typography-heading-xl-font-size)` |
| `VariableID:12:4` | Typography | `typography/heading-xl/font-weight` | `var(--pds-typography-heading-xl-font-weight)` |
| `VariableID:12:5` | Typography | `typography/heading-xl/line-height` | `var(--pds-typography-heading-xl-line-height)` |
| `VariableID:12:6` | Typography | `typography/heading-xl/letter-spacing` | `var(--pds-typography-heading-xl-letter-spacing)` |
| `VariableID:12:7` | Typography | `typography/heading-lg/font-family` | `var(--pds-typography-heading-lg-font-family)` |
| `VariableID:12:8` | Typography | `typography/heading-lg/font-size` | `var(--pds-typography-heading-lg-font-size)` |
| `VariableID:12:9` | Typography | `typography/heading-lg/font-weight` | `var(--pds-typography-heading-lg-font-weight)` |
| `VariableID:12:10` | Typography | `typography/heading-lg/line-height` | `var(--pds-typography-heading-lg-line-height)` |
| `VariableID:12:11` | Typography | `typography/heading-lg/letter-spacing` | `var(--pds-typography-heading-lg-letter-spacing)` |
| `VariableID:12:12` | Typography | `typography/heading-md/font-family` | `var(--pds-typography-heading-md-font-family)` |
| `VariableID:12:13` | Typography | `typography/heading-md/font-size` | `var(--pds-typography-heading-md-font-size)` |
| `VariableID:12:14` | Typography | `typography/heading-md/font-weight` | `var(--pds-typography-heading-md-font-weight)` |
| `VariableID:12:15` | Typography | `typography/heading-md/line-height` | `var(--pds-typography-heading-md-line-height)` |
| `VariableID:12:16` | Typography | `typography/heading-md/letter-spacing` | `var(--pds-typography-heading-md-letter-spacing)` |
| `VariableID:31:2` | Typography | `typography/title-md/font-family` | `var(--pds-typography-title-md-font-family)` |
| `VariableID:31:3` | Typography | `typography/title-md/font-size` | `var(--pds-typography-title-md-font-size)` |
| `VariableID:31:4` | Typography | `typography/title-md/font-weight` | `var(--pds-typography-title-md-font-weight)` |
| `VariableID:31:5` | Typography | `typography/title-md/line-height` | `var(--pds-typography-title-md-line-height)` |
| `VariableID:31:6` | Typography | `typography/title-md/letter-spacing` | `var(--pds-typography-title-md-letter-spacing)` |
| `VariableID:31:8` | Typography | `typography/title-sm/font-family` | `var(--pds-typography-title-sm-font-family)` |
| `VariableID:31:9` | Typography | `typography/title-sm/font-size` | `var(--pds-typography-title-sm-font-size)` |
| `VariableID:31:10` | Typography | `typography/title-sm/font-weight` | `var(--pds-typography-title-sm-font-weight)` |
| `VariableID:31:11` | Typography | `typography/title-sm/line-height` | `var(--pds-typography-title-sm-line-height)` |
| `VariableID:31:12` | Typography | `typography/title-sm/letter-spacing` | `var(--pds-typography-title-sm-letter-spacing)` |
| `VariableID:12:17` | Typography | `typography/body-md/font-family` | `var(--pds-typography-body-md-font-family)` |
| `VariableID:12:18` | Typography | `typography/body-md/font-size` | `var(--pds-typography-body-md-font-size)` |
| `VariableID:12:19` | Typography | `typography/body-md/font-weight` | `var(--pds-typography-body-md-font-weight)` |
| `VariableID:12:20` | Typography | `typography/body-md/line-height` | `var(--pds-typography-body-md-line-height)` |
| `VariableID:12:21` | Typography | `typography/body-md/letter-spacing` | `var(--pds-typography-body-md-letter-spacing)` |
| `VariableID:12:22` | Typography | `typography/body-sm/font-family` | `var(--pds-typography-body-sm-font-family)` |
| `VariableID:12:23` | Typography | `typography/body-sm/font-size` | `var(--pds-typography-body-sm-font-size)` |
| `VariableID:12:24` | Typography | `typography/body-sm/font-weight` | `var(--pds-typography-body-sm-font-weight)` |
| `VariableID:12:25` | Typography | `typography/body-sm/line-height` | `var(--pds-typography-body-sm-line-height)` |
| `VariableID:12:26` | Typography | `typography/body-sm/letter-spacing` | `var(--pds-typography-body-sm-letter-spacing)` |
| `VariableID:31:14` | Typography | `typography/label-xl/font-family` | `var(--pds-typography-label-xl-font-family)` |
| `VariableID:31:15` | Typography | `typography/label-xl/font-size` | `var(--pds-typography-label-xl-font-size)` |
| `VariableID:31:16` | Typography | `typography/label-xl/font-weight` | `var(--pds-typography-label-xl-font-weight)` |
| `VariableID:31:17` | Typography | `typography/label-xl/line-height` | `var(--pds-typography-label-xl-line-height)` |
| `VariableID:31:18` | Typography | `typography/label-xl/letter-spacing` | `var(--pds-typography-label-xl-letter-spacing)` |
| `VariableID:31:20` | Typography | `typography/label-lg/font-family` | `var(--pds-typography-label-lg-font-family)` |
| `VariableID:31:21` | Typography | `typography/label-lg/font-size` | `var(--pds-typography-label-lg-font-size)` |
| `VariableID:31:22` | Typography | `typography/label-lg/font-weight` | `var(--pds-typography-label-lg-font-weight)` |
| `VariableID:31:23` | Typography | `typography/label-lg/line-height` | `var(--pds-typography-label-lg-line-height)` |
| `VariableID:31:24` | Typography | `typography/label-lg/letter-spacing` | `var(--pds-typography-label-lg-letter-spacing)` |
| `VariableID:12:27` | Typography | `typography/label-md/font-family` | `var(--pds-typography-label-md-font-family)` |
| `VariableID:12:28` | Typography | `typography/label-md/font-size` | `var(--pds-typography-label-md-font-size)` |
| `VariableID:12:29` | Typography | `typography/label-md/font-weight` | `var(--pds-typography-label-md-font-weight)` |
| `VariableID:12:30` | Typography | `typography/label-md/line-height` | `var(--pds-typography-label-md-line-height)` |
| `VariableID:12:31` | Typography | `typography/label-md/letter-spacing` | `var(--pds-typography-label-md-letter-spacing)` |
| `VariableID:12:32` | Typography | `typography/label-sm/font-family` | `var(--pds-typography-label-sm-font-family)` |
| `VariableID:12:33` | Typography | `typography/label-sm/font-size` | `var(--pds-typography-label-sm-font-size)` |
| `VariableID:12:34` | Typography | `typography/label-sm/font-weight` | `var(--pds-typography-label-sm-font-weight)` |
| `VariableID:12:35` | Typography | `typography/label-sm/line-height` | `var(--pds-typography-label-sm-line-height)` |
| `VariableID:12:36` | Typography | `typography/label-sm/letter-spacing` | `var(--pds-typography-label-sm-letter-spacing)` |
| `VariableID:31:26` | Typography | `typography/overline/font-family` | `var(--pds-typography-overline-font-family)` |
| `VariableID:31:27` | Typography | `typography/overline/font-size` | `var(--pds-typography-overline-font-size)` |
| `VariableID:31:28` | Typography | `typography/overline/font-weight` | `var(--pds-typography-overline-font-weight)` |
| `VariableID:31:29` | Typography | `typography/overline/line-height` | `var(--pds-typography-overline-line-height)` |
| `VariableID:31:30` | Typography | `typography/overline/letter-spacing` | `var(--pds-typography-overline-letter-spacing)` |
| `VariableID:31:32` | Typography | `typography/caption/font-family` | `var(--pds-typography-caption-font-family)` |
| `VariableID:31:33` | Typography | `typography/caption/font-size` | `var(--pds-typography-caption-font-size)` |
| `VariableID:31:34` | Typography | `typography/caption/font-weight` | `var(--pds-typography-caption-font-weight)` |
| `VariableID:31:35` | Typography | `typography/caption/line-height` | `var(--pds-typography-caption-line-height)` |
| `VariableID:31:36` | Typography | `typography/caption/letter-spacing` | `var(--pds-typography-caption-letter-spacing)` |
| `VariableID:12:37` | Typography | `typography/code-sm/font-family` | `var(--pds-typography-code-sm-font-family)` |
| `VariableID:12:38` | Typography | `typography/code-sm/font-size` | `var(--pds-typography-code-sm-font-size)` |
| `VariableID:12:39` | Typography | `typography/code-sm/font-weight` | `var(--pds-typography-code-sm-font-weight)` |
| `VariableID:12:40` | Typography | `typography/code-sm/line-height` | `var(--pds-typography-code-sm-line-height)` |
| `VariableID:12:41` | Typography | `typography/code-sm/letter-spacing` | `var(--pds-typography-code-sm-letter-spacing)` |
| `VariableID:7:17` | Motion | `duration/fast` | `var(--pds-duration-fast)` |
| `VariableID:7:18` | Motion | `duration/normal` | `var(--pds-duration-normal)` |
| `VariableID:7:19` | Motion | `easing/standard` | `var(--pds-easing-standard)` |

</details>

### 5. Style descriptions (14 text styles, 3 effect styles)

Text style descriptions end with `CSS: var(--sds-typography-<style>-*)`; effect styles may name `--sds-elevation-*`. Replace `--sds-` with `--pds-` in each **description only**. Do not touch the styles' variable bindings.

### 6. Layer marks: shared plugin data namespace `sds` → `pds`

The audit and snapshot scripts now read `getSharedPluginData('pds', …)`. Layers marked earlier (e.g. Alert's `raw = paddingTop`, Select's `textStyle`) hold the mark under `sds`. For every node on every page with keys in namespace `sds`, copy each key/value to namespace `pds`. Leave the `sds` copies; they are harmless.

### 7. Component descriptions

The snapshot shows no `--sds-` in any component description. If any appears, replace it with `--pds-`; nothing else.

## Script (Plugin API, for `use_figma`)

Load `figma:figma-use` first. Run once; it reports what it changed.

```js
const RENAME = {"VariableID:4:14": "color/brand/blue/50", "VariableID:4:15": "color/brand/blue/100", "VariableID:4:16": "color/brand/blue/200", "VariableID:4:17": "color/brand/blue/300", "VariableID:4:18": "color/brand/blue/400", "VariableID:4:19": "color/brand/blue/500", "VariableID:4:20": "color/brand/blue/600", "VariableID:4:21": "color/brand/blue/700", "VariableID:4:22": "color/brand/blue/800", "VariableID:4:23": "color/brand/blue/900"};
const VALUES = {"VariableID:4:3": "#fafafa", "VariableID:4:4": "#f3f3f3", "VariableID:4:5": "#ebebeb", "VariableID:4:6": "#e1e1e1", "VariableID:4:7": "#d2d2d2", "VariableID:4:8": "#b2b2b2", "VariableID:4:9": "#8c8c8c", "VariableID:4:10": "#4f4f4f", "VariableID:4:11": "#393939", "VariableID:4:12": "#212121", "VariableID:4:13": "#131313", "VariableID:4:14": "#eef4ff", "VariableID:4:15": "#dae6ff", "VariableID:4:16": "#bcd2ff", "VariableID:4:17": "#8eb4ff", "VariableID:4:18": "#5a8eff", "VariableID:4:19": "#3071ff", "VariableID:4:20": "#0a5cff", "VariableID:4:21": "#0047d6", "VariableID:4:22": "#003aad", "VariableID:4:23": "#002f85"};
const DARK_ALIAS = {"VariableID:6:7": "color/brand/blue/400", "VariableID:6:8": "color/brand/blue/300", "VariableID:6:9": "color/brand/blue/200", "VariableID:6:21": "color/brand/blue/300", "VariableID:6:25": "color/neutral/950", "VariableID:6:31": "color/brand/blue/300", "VariableID:6:32": "color/brand/blue/400", "VariableID:6:33": "color/brand/blue/300"};

const log = [];
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: 1 });
const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const modeId = (v, name) => cols.find((c) => c.id === v.variableCollectionId).modes.find((m) => m.name === name).modeId;

// 1. rename in place
for (const [id, to] of Object.entries(RENAME)) { const v = byId[id]; if (v && v.name !== to) { log.push(`rename ${v.name} -> ${to}`); v.name = to; } }
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));

// 2. primitive values
for (const [id, h] of Object.entries(VALUES)) { const v = byId[id]; v.setValueForMode(modeId(v, 'Value'), hex(h)); log.push(`value ${v.name} = ${h}`); }

// 3. dark aliases
for (const [id, target] of Object.entries(DARK_ALIAS)) { const v = byId[id]; v.setValueForMode(modeId(v, 'Dark'), figma.variables.createVariableAlias(byName[target])); log.push(`dark ${v.name} -> ${target}`); }

// 4. code syntax
const NO_SYNTAX = new Set(['elevation/raised/color', 'elevation/floating/color', 'elevation/overlay/color']);
for (const v of vars) { if (NO_SYNTAX.has(v.name)) continue; const want = `var(--pds-${v.name.replace(/\//g, '-')})`; if (v.codeSyntax.WEB !== want) { v.setVariableCodeSyntax('WEB', want); log.push(`syntax ${v.name}`); } }

// 5. style descriptions
for (const s of [...(await figma.getLocalTextStylesAsync()), ...(await figma.getLocalEffectStylesAsync())]) if (s.description.includes('--sds-')) { s.description = s.description.replaceAll('--sds-', '--pds-'); log.push(`desc ${s.name}`); }

// 6. plugin data namespace
await figma.loadAllPagesAsync();
for (const page of figma.root.children) for (const n of [page, ...page.findAll(() => true)]) for (const k of n.getSharedPluginDataKeys('sds')) { n.setSharedPluginData('pds', k, n.getSharedPluginData('sds', k)); log.push(`mark ${n.name}: ${k}`); }

// 7. component descriptions
for (const page of figma.root.children) for (const c of page.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })) if (c.description.includes('--sds-')) { c.description = c.description.replaceAll('--sds-', '--pds-'); log.push(`component ${c.name}`); }

return { changed: log.length, log };
```

Expected: 10 renames, 21 values, 8 dark aliases, 173 syntax, plus however many descriptions and marks exist.

## Verify, then close

1. **Bindings survived:** open Button (primary) and a Switch in Dark mode: fills show `color/background/accent`, not a hex or a broken link. Variables panel: no `indigo` left, no duplicate `blue` group.
2. **Snapshot:** run `scripts/figma/snapshot.figma.js` in the library and save its output as `figma/manifest.json` (keys must be unchanged: renames keep keys).
3. **In the repo:** `npm run validate -- --strict` → no findings, then `npm run sync-status`. Commit `figma/manifest.json` and `docs/sync-status.*`, push; CI goes green.
4. Re-export the variables and diff again if anything looks off: the diff script is how this list was made.
