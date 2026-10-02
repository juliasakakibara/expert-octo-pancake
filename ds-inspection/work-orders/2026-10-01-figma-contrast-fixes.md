# Work order — Figma library: contrast fixes (2026-10-01)

**For:** a Figma agent (Claude with the Figma MCP `use_figma`) working in the library file `iMysuIxqcsHZ4OpffFKYMp` (Pancake DS).
**Why:** branch `feature/contrast-fixes` fixes the 14 colour pairs that failed WCAG upstream. `npm run validate -- --strict` reports 4 missing variables until the library matches. Code is the source; Figma follows.
**Source of the IDs:** the variable export of 2026-10-01 20:41. Names below are after the Pancake DS sync (`brand/blue`, `--pds-`).

## The rules

- **Create** only the 4 new variables below. Every other change is **in place**: `setValueForMode`, never `remove()` + `createVariable()`. Bindings follow the variable ID.
- Do not use Variables → Import.
- In step 4, rebind only the **outer edge** of the six form controls. Inner dividers (NumberField's lines between its buttons) stay on `color/border/default`.
- Run step 4 as a dry run first and check the list it returns.

## 1. New primitives (Color Primitives, mode `Value`, scopes none)

| Name | Value | Code syntax |
| --- | --- | --- |
| `color/utility/green/950` | `#052e16` | `var(--pds-color-utility-green-950)` |
| `color/utility/yellow/950` | `#451a03` | `var(--pds-color-utility-yellow-950)` |
| `color/utility/red/950` | `#450a0a` | `var(--pds-color-utility-red-950)` |

## 2. New role (Color collection)

| Name | Light | Dark | Scopes | Code syntax |
| --- | --- | --- | --- | --- |
| `color/border/control` | → `color/neutral/600` | → `color/neutral/600` | `STROKE_COLOR`, `SHAPE_FILL` | `var(--pds-color-border-control)` |

Description: *The resting edge of a form control (input, select, number field). At least 3:1 against the surface (WCAG 1.4.11); border.default stays for decorative dividers.*

## 3. Re-point aliases (in place)

| Variable ID | Role | Mode | From | To |
| --- | --- | --- | --- | --- |
| `VariableID:6:23` | `color/content/success` | Light | green/600 | **green/700** |
| `VariableID:6:24` | `color/content/warning` | Light | yellow/600 | **yellow/700** |
| `VariableID:6:22` | `color/content/danger` | Light | red/600 | **red/700** |
| `VariableID:6:30` | `color/border/strong` | Light | neutral/400 | **neutral/700** |
| `VariableID:6:15` | `color/background/success-subtle` | Dark | green/700 | **green/950** |
| `VariableID:6:17` | `color/background/warning-subtle` | Dark | yellow/700 | **yellow/950** |
| `VariableID:6:13` | `color/background/danger-subtle` | Dark | red/700 | **red/950** |
| `VariableID:6:22` | `color/content/danger` | Dark | red/500 | **red/300** |
| `VariableID:6:26` | `color/content/on-danger` | Dark | neutral/white | **neutral/950** |
| `VariableID:6:30` | `color/border/strong` | Dark | neutral/600 | **neutral/500** |

`border/strong` is the hover edge of controls and the resting edge of Checkbox and Switch; it moves one step stronger so hover stays visible above `border/control`.

## 4. Rebind the resting edge of six controls

Component sets: `TextField`, `Textarea`, `Select.Trigger`, `Autocomplete.Control`, `Combobox.Control`, `NumberField`. In every variant, the node whose stroke is bound to `color/border/default` (`VariableID:6:29`) **on all four sides** is the control's edge: rebind that stroke to `color/border/control`. Leave nodes with one- or two-sided strokes alone.

## Script (Plugin API, for `use_figma`)

Load `figma:figma-use` first. Set `DRY_RUN = true`, read the `edges` list, then run again with `false`.

```js
const DRY_RUN = true;
const PRIMS = { 'color/utility/green/950': '#052e16', 'color/utility/yellow/950': '#451a03', 'color/utility/red/950': '#450a0a' };
const ALIASES = [
  ['VariableID:6:23', 'Light', 'color/utility/green/700'],
  ['VariableID:6:24', 'Light', 'color/utility/yellow/700'],
  ['VariableID:6:22', 'Light', 'color/utility/red/700'],
  ['VariableID:6:30', 'Light', 'color/neutral/700'],
  ['VariableID:6:15', 'Dark', 'color/utility/green/950'],
  ['VariableID:6:17', 'Dark', 'color/utility/yellow/950'],
  ['VariableID:6:13', 'Dark', 'color/utility/red/950'],
  ['VariableID:6:22', 'Dark', 'color/utility/red/300'],
  ['VariableID:6:26', 'Dark', 'color/neutral/950'],
  ['VariableID:6:30', 'Dark', 'color/neutral/500'],
];
const CONTROLS = ['TextField', 'Textarea', 'Select.Trigger', 'Autocomplete.Control', 'Combobox.Control', 'NumberField'];
const DEFAULT_ID = 'VariableID:6:29';
const log = [];
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: 1 });
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const col = (name) => cols.find((c) => c.name === name);
const modeId = (c, name) => c.modes.find((m) => m.name === name).modeId;
let vars = await figma.variables.getLocalVariablesAsync();
let byName = Object.fromEntries(vars.map((v) => [v.name, v]));

// Find the control edges first, so a dry run changes nothing.
const edges = [];
for (const page of figma.root.children) {
  await page.loadAsync();
  for (const set of page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
    if (!CONTROLS.includes(set.name) || (set.type === 'COMPONENT' && set.parent.type === 'COMPONENT_SET')) continue;
    for (const n of [set, ...set.findAll(() => true)]) {
      if (!('strokes' in n) || !n.strokes.length) continue;
      const bound = n.strokes[0].boundVariables?.color?.id;
      const sides = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'].map((k) => (k in n ? n[k] : n.strokeWeight));
      if (bound === DEFAULT_ID && sides.every((w) => w > 0)) edges.push({ id: n.id, component: set.name, variant: n.parent?.name, name: n.name });
    }
  }
}
if (DRY_RUN) return { dryRun: true, edges };

// 1. primitives
const prim = col('Color Primitives');
for (const [name, h] of Object.entries(PRIMS)) {
  if (byName[name]) continue;
  const v = figma.variables.createVariable(name, prim, 'COLOR');
  v.scopes = [];
  v.setValueForMode(modeId(prim, 'Value'), hex(h));
  v.setVariableCodeSyntax('WEB', `var(--pds-${name.replace(/\//g, '-')})`);
  log.push(`created ${name}`);
}
vars = await figma.variables.getLocalVariablesAsync();
byName = Object.fromEntries(vars.map((v) => [v.name, v]));

// 2. border/control
const color = col('Color');
let control = byName['color/border/control'];
if (!control) {
  control = figma.variables.createVariable('color/border/control', color, 'COLOR');
  control.scopes = ['STROKE_COLOR', 'SHAPE_FILL'];
  control.description = 'The resting edge of a form control (input, select, number field). At least 3:1 against the surface (WCAG 1.4.11); border.default stays for decorative dividers.';
  control.setVariableCodeSyntax('WEB', 'var(--pds-color-border-control)');
  log.push('created color/border/control');
}
for (const m of ['Light', 'Dark']) control.setValueForMode(modeId(color, m), figma.variables.createVariableAlias(byName['color/neutral/600']));

// 3. aliases
for (const [id, mode, target] of ALIASES) {
  const v = await figma.variables.getVariableByIdAsync(id);
  v.setValueForMode(modeId(color, mode), figma.variables.createVariableAlias(byName[target]));
  log.push(`${v.name} ${mode} -> ${target}`);
}

// 4. control edges
for (const e of edges) {
  const n = await figma.getNodeByIdAsync(e.id);
  n.strokes = [figma.variables.setBoundVariableForPaint(n.strokes[0], 'color', control), ...n.strokes.slice(1)];
  log.push(`edge ${e.component} / ${e.variant}`);
}
return { changed: log.length, log, edges: edges.length };
```

Expected: 3 primitives and 1 role created, 10 aliases re-pointed, and one edge per variant of the six controls (TextField 4, Textarea 4, Select.Trigger 8, Autocomplete.Control 8, Combobox.Control 8, NumberField 2 = 34).

## Verify, then close

1. Dark mode: a danger Button shows dark text on red; Alert success, warning and danger sit on deep green, amber and red.
2. A TextField's edge shows `color/border/control`; its hover is not mirrored, as before.
3. No duplicate `950` or `control` variables.
4. In the repo: take a snapshot into `figma/manifest.json` (in parts, with checksums), then `npm run validate -- --strict` → no findings, and `npm run sync-status`.
