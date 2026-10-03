/**
 * Figma → tokens/*.json: applies the changes the Syrup widget copies ("Update GitHub").
 *
 * The reverse of tokens-to-figma.mjs. Each change names a Figma variable
 * (collection, name, mode) and its new value; this finds the token it came
 * from and rewrites that one "$value" in place, so the hand-aligned files keep
 * their formatting. Every edit is checked by re-parsing the file: if anything
 * other than that value changed, the file is left untouched.
 *
 *   pbpaste | npm run tokens:from-figma          changes copied from the Syrup widget
 *   npm run tokens:from-figma -- changes.json    or from a file
 *   … -- --dry-run                               show what would change
 *
 * Values Figma derives (line height and letter spacing in px, font stacks,
 * shadows, motion) are reported, not written: change those in code.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG } from './config.mjs';

const ROOT = process.cwd();
const TOKENS = join(ROOT, CONFIG.tokens.dir);
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const fileArg = args.find((a) => !a.startsWith('--'));

const raw = fileArg ? readFileSync(fileArg, 'utf8') : readFileSync(0, 'utf8');
let input;
try {
  input = JSON.parse(raw);
} catch {
  console.error("This isn't the changes from the Syrup widget (it starts with: " + JSON.stringify(raw.trim().slice(0, 40)) + ').');
  console.error('In Figma: Syrup widget → Sync… → Update GitHub → Copy changes. Then run this again.');
  process.exit(1);
}
const changes = Array.isArray(input) ? input : input.changes;
if (!Array.isArray(changes)) throw new Error('Expected the JSON the Syrup widget copies with "Update GitHub" ({ changes: [...] }).');

// ─── where each token lives ────────────────────────────────────────────────
const tier1Files = readdirSync(join(TOKENS, CONFIG.tokens.definitions))
  .filter((f) => f.endsWith('.json'))
  .map((f) => `${CONFIG.tokens.definitions}/${f}`);
const files = new Map(); // relative path → { text, data }
const load = (rel) => {
  if (!files.has(rel)) {
    const text = readFileSync(join(TOKENS, rel), 'utf8');
    files.set(rel, { text, data: JSON.parse(text), changed: false });
  }
  return files.get(rel);
};
const at = (data, path) => path.reduce((n, k) => n?.[k], data);
const tier1FileFor = (path) => tier1Files.find((f) => at(load(f).data, path)?.$value !== undefined);

// ─── value formats, the way the source files write them ───────────────────
const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
const colour = (v) => {
  if (v.alias) return `{${v.alias.split('/').join('.')}}`;
  const h = v.color.toLowerCase();
  if ((v.alpha ?? 1) >= 1) return h;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgb(${r} ${g} ${b} / ${Math.round(v.alpha * 100) / 100})`;
};
/** Keep the unit the token already uses: 16 → "1rem" where it was rem, "16px" where it was px. */
const dimension = (px, current) => {
  if (px === 0) return '0';
  const r = (n) => Math.round(n * 1000) / 1000;
  return String(current).endsWith('rem') ? `${r(px / 16)}rem` : `${r(px)}px`;
};

/** Work out the file, the token path and the new $value for one change, or why it is skipped. */
function locate({ collection, name, mode, value }) {
  const path = name.split('/');
  if (collection === 'Color Primitives') return { rel: tier1FileFor(path), path, next: colour(value) };
  if (collection === 'Color') {
    if (path[0] === 'elevation') return { skip: 'shadow colours are part of a shadow token; change it in code' };
    const rel = mode === 'Dark' ? CONFIG.tokens.dark : CONFIG.tokens.light;
    return { rel, path, next: colour(value) };
  }
  if (collection === 'Size' || (collection === 'Typography' && path[0] === 'font' && path[1] === 'size')) {
    const rel = tier1FileFor(path);
    if (typeof value !== 'number') return { skip: 'expected a number' };
    return { rel, path, next: dimension(value, rel && at(load(rel).data, path).$value) };
  }
  if (collection === 'Typography' && path[0] === 'font' && path[1] === 'weight') {
    const rel = tier1FileFor(path);
    const current = rel && at(load(rel).data, path).$value;
    return { rel, path, next: typeof current === 'number' ? value : String(value) };
  }
  if (collection === 'Typography' && path[0] === 'typography') {
    const [, style, prop] = path;
    if (!['font-family', 'font-size', 'font-weight'].includes(prop)) {
      return { skip: `${prop} is derived in Figma (px); change line.height or letter.spacing in code` };
    }
    if (!value?.alias) return { skip: `a text style's ${prop} must point at a scale variable` };
    return { rel: CONFIG.tokens.textStyles, path: ['typography', style, prop], next: colour({ alias: value.alias }) };
  }
  if (collection === 'Typography' && path[0] === 'font') return { skip: 'font stacks live in code; Figma holds one family' };
  if (collection === 'Motion') return { skip: 'motion tokens are not synced yet' };
  return { skip: `unknown collection "${collection}"` };
}

/** Replace one $value in the text without touching anything else, then prove it. */
function rewrite(file, path, next) {
  let pos = 0;
  for (const key of path) {
    const i = file.text.indexOf(`${JSON.stringify(key)}:`, pos);
    if (i < 0) throw new Error(`key ${path.join('.')} not found`);
    pos = i + 1;
  }
  const re = /"\$value"\s*:\s*("(?:[^"\\]|\\.)*"|-?[\d.]+)/g;
  re.lastIndex = pos;
  const m = re.exec(file.text);
  if (!m) throw new Error(`no $value for ${path.join('.')}`);
  const start = m.index + m[0].length - m[1].length;
  const text = file.text.slice(0, start) + JSON.stringify(next) + file.text.slice(start + m[1].length);

  const expected = structuredClone(file.data);
  at(expected, path).$value = next;
  if (JSON.stringify(JSON.parse(text)) !== JSON.stringify(expected)) throw new Error(`edit of ${path.join('.')} touched more than its value`);
  file.text = text;
  file.data = expected;
  file.changed = true;
}

const applied = [];
const skipped = [];
for (const change of changes) {
  const label = `${change.collection} · ${change.name}${change.mode && change.mode !== 'Value' ? ` (${change.mode})` : ''}`;
  try {
    const loc = locate(change);
    if (loc.skip) { skipped.push(`${label}: ${loc.skip}`); continue; }
    if (!loc.rel) { skipped.push(`${label}: no such token in tokens/`); continue; }
    const file = load(loc.rel);
    const before = at(file.data, loc.path)?.$value;
    if (before === undefined) { skipped.push(`${label}: no such token in ${loc.rel}`); continue; }
    if (before === loc.next) { skipped.push(`${label}: already ${JSON.stringify(before)}`); continue; }
    rewrite(file, loc.path, loc.next);
    applied.push(`${loc.rel}  ${loc.path.join('.')}: ${JSON.stringify(before)} → ${JSON.stringify(loc.next)}`);
  } catch (err) {
    skipped.push(`${label}: ${err.message}`);
  }
}

if (!DRY) for (const [rel, f] of files) if (f.changed) writeFileSync(join(TOKENS, rel), f.text);

console.log(`${DRY ? 'Would change' : 'Changed'} ${applied.length} token(s):`);
for (const a of applied) console.log(`  ${a}`);
if (skipped.length) {
  console.log(`Skipped ${skipped.length}:`);
  for (const s of skipped) console.log(`  ${s}`);
}
if (applied.length && !DRY) console.log('\nNext: npm run build:tokens && npm run check:contrast, then commit on a branch and open a PR.');
