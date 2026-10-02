/**
 * Random, accessible colour themes, drawn with randoma11y.
 *
 * randoma11y gives one background/foreground pair that meets a contrast
 * threshold. This module grows that pair into the semantic colour layer
 * (background, content, border) and checks every pair a component paints, so
 * a shuffled theme is as legible as the authored one.
 *
 * Only the semantic layer is overridden, as inline custom properties. The
 * primitives and every component stay untouched: that is the point of tier 2.
 * Status colours (danger, success, warning) keep their authored values, since
 * their hue carries meaning a random draw cannot.
 */
import { randoma11y, contrast, type Randoma11yOptions } from 'randoma11y';

const ALGORITHM = 'WCAG21' as const;
/** Body text gets AAA; everything else is held to the same floors as
 *  ds-inspection/checks/contrast-pairs.mjs. */
const MIN_BODY = 7;
const MIN_TEXT = 4.5;
const MIN_UI = 3;

export type ThemeVars = Record<string, string>;

/** The semantic roles a random theme replaces. Status roles are left out on purpose. */
export const THEMED_ROLES = [
  '--pds-color-background-default',
  '--pds-color-background-surface',
  '--pds-color-background-sunken',
  '--pds-color-background-on-accent',
  '--pds-color-background-accent',
  '--pds-color-background-accent-hover',
  '--pds-color-background-accent-active',
  '--pds-color-background-accent-subtle',
  '--pds-color-content-default',
  '--pds-color-content-muted',
  '--pds-color-content-inverse',
  '--pds-color-content-accent',
  '--pds-color-content-on-accent',
  '--pds-color-border-default',
  '--pds-color-border-control',
  '--pds-color-border-strong',
  '--pds-color-border-focus',
  '--pds-color-border-accent',
  '--pds-color-border-accent-hover',
] as const;

export interface RandomThemeOptions {
  /** Lock the page background; the rest is drawn around it. */
  background?: string;
  /** Lock the accent instead of drawing one. It must reach 4.5:1 on the background. */
  accent?: string;
}

export interface ContrastCheck {
  pair: string;
  ratio: number;
  min: number;
  pass: boolean;
}

export interface RandomTheme {
  /** `--pds-color-*` overrides, ready for `applyTheme`. */
  vars: ThemeVars;
  /** The pairs components actually paint, with their WCAG 2.1 ratios. */
  checks: ContrastCheck[];
}

const toRgb = (hex: string) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const toHex = (rgb: number[]) =>
  `#${rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`;

/** `t` of `b` mixed into `a`, in sRGB. */
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [toRgb(a), toRgb(b)];
  return toHex(x.map((c, i) => c + (y[i] - c) * t));
};

const ratio = (bg: string, fg: string) => contrast(bg, fg, ALGORITHM);

/** The least `toward` mixed into `from` that reaches `min` on every background. */
const weakestPassing = (from: string, toward: string, min: number, on: string[]) => {
  for (let t = 0; t <= 1; t += 0.02) {
    const c = mix(from, toward, t);
    if (on.every((bg) => ratio(bg, c) >= min)) return c;
  }
  return toward;
};

/** randoma11y gives up after its search budget and says so in `meetsThreshold`;
 *  draw again rather than accept a pair below the floor. */
const draw = (options: Omit<Randoma11yOptions, 'algorithm'>) => {
  for (let i = 0; i < 20; i++) {
    const result = randoma11y({ ...options, algorithm: ALGORITHM });
    if (result.meetsThreshold) return result.colors;
  }
  throw new Error(`randoma11y found no pair at ${options.threshold}:1`);
};

/** Black or white, whichever reads better on `hex`. */
const extremeFor = (hex: string) => (ratio(hex, '#000000') >= ratio(hex, '#ffffff') ? '#000000' : '#ffffff');

const drawAccent = (bg: string, fg: string) => {
  // Redraw until the accent is visibly different from body text, so links and
  // primary buttons do not read as plain copy.
  let accent = fg;
  for (let i = 0; i < 20; i++) {
    accent = draw({ color: bg, role: 'background', threshold: MIN_TEXT })[1];
    if (ratio(accent, fg) >= 1.6) break;
  }
  return accent;
};

export function createRandomTheme(options: RandomThemeOptions = {}): RandomTheme {
  const [bg, fg] = draw({
    threshold: MIN_BODY,
    ...(options.background ? { color: options.background, role: 'background' as const } : {}),
  });

  const surface = bg;
  const page = mix(bg, fg, 0.03);
  const sunken = mix(bg, fg, 0.07);

  const accent = options.accent ?? drawAccent(bg, fg);
  // Prefer the theme's own two colours on the accent; draw a third only if neither reads.
  const onAccent =
    [bg, fg].find((c) => ratio(accent, c) >= MIN_TEXT) ??
    draw({ color: accent, role: 'background', threshold: MIN_TEXT })[1];
  // Hover and active move the fill away from its content, so contrast only grows.
  const away = extremeFor(onAccent);
  const accentHover = mix(accent, away, 0.14);
  const accentActive = mix(accent, away, 0.26);
  const accentSubtle = [0.12, 0.08, 0.04, 0].map((t) => mix(bg, accent, t)).find((c) => ratio(c, accent) >= MIN_TEXT) ?? bg;

  const muted = weakestPassing(bg, fg, MIN_TEXT, [surface, page, sunken]);
  const borderDefault = mix(bg, fg, 0.18);
  // Controls' resting edge reaches 3:1; hover (border.strong) goes further so it stays visible.
  const borderControl = weakestPassing(bg, fg, MIN_UI, [surface, page]);
  const borderStrong = weakestPassing(bg, fg, MIN_TEXT, [surface, page]);

  const vars: ThemeVars = {
    '--pds-color-background-default': page,
    '--pds-color-background-surface': surface,
    '--pds-color-background-sunken': sunken,
    '--pds-color-background-on-accent': onAccent,
    '--pds-color-background-accent': accent,
    '--pds-color-background-accent-hover': accentHover,
    '--pds-color-background-accent-active': accentActive,
    '--pds-color-background-accent-subtle': accentSubtle,
    '--pds-color-content-default': fg,
    '--pds-color-content-muted': muted,
    '--pds-color-content-inverse': bg,
    '--pds-color-content-accent': accent,
    '--pds-color-content-on-accent': onAccent,
    '--pds-color-border-default': borderDefault,
    '--pds-color-border-control': borderControl,
    '--pds-color-border-strong': borderStrong,
    '--pds-color-border-focus': accent,
    '--pds-color-border-accent': accent,
    '--pds-color-border-accent-hover': accentHover,
  };

  const check = (pair: string, back: string, fore: string, min: number): ContrastCheck => {
    const r = ratio(back, fore);
    return { pair, ratio: Math.round(r * 100) / 100, min, pass: r >= min };
  };
  const checks = [
    check('content.default on background.default', page, fg, MIN_TEXT),
    check('content.default on background.surface', surface, fg, MIN_TEXT),
    check('content.muted on background.sunken', sunken, muted, MIN_TEXT),
    check('content.accent on background.surface', surface, accent, MIN_TEXT),
    check('content.accent on background.accent-subtle', accentSubtle, accent, MIN_TEXT),
    check('content.on-accent on background.accent', accent, onAccent, MIN_TEXT),
    check('content.on-accent on background.accent-hover', accentHover, onAccent, MIN_TEXT),
    check('border.control on background.surface', surface, borderControl, MIN_UI),
    check('border.strong on background.surface', surface, borderStrong, MIN_UI),
    check('border.focus on background.surface', surface, accent, MIN_UI),
  ];

  return { vars, checks };
}

type StyleTarget = { style: CSSStyleDeclaration };

/** Writes a theme as inline custom properties. Inline wins over the
 *  `[data-theme]` blocks in semantic.css, so it overrides Light and Dark alike. */
export function applyTheme(vars: ThemeVars, target: StyleTarget = document.documentElement) {
  for (const [name, value] of Object.entries(vars)) target.style.setProperty(name, value);
}

/** Removes every role a random theme overrides, returning to the authored theme. */
export function clearTheme(target: StyleTarget = document.documentElement) {
  for (const name of THEMED_ROLES) target.style.removeProperty(name);
}
