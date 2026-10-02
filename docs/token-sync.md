# Token sync between code and Figma

How a token value moves between this repo and any Figma file, in both
directions, and what keeps it honest. The tool on the Figma side is
**LiveDocs**, a widget (dev copy in `~/Developer/plugin-claude`, documented in
its `doc/TOKEN-SYNC.md`).

## The two directions

```
GitHub → Figma   tokens/*.json ─PR─► main ─CI─► GitHub Pages: tokens.json ─SYNC─► Figma variables
Figma → GitHub   Figma variables ─Export─► changes JSON ─npm run tokens:from-figma─► tokens/*.json ─PR─► CI ─► main
```

The repo stays the final record. Every change, wherever it starts, reaches
`main` through a pull request that CI checks (`validate --strict`, build,
Storybook), and branch protection makes `build` required.

## GitHub → Figma

1. `npm run build-storybook` also writes `storybook-static/tokens.json`
   (`npm run tokens:json`): the output of `scripts/figma/tokens-to-figma.mjs`,
   every variable with its collection, modes, values or aliases, scopes and
   code syntax.
2. CI deploys it with Storybook:
   `https://juliasakakibara.github.io/expert-octo-pancake/tokens.json`.
   GitHub Pages serves it with `access-control-allow-origin: *`, which is what
   a widget needs to read it.
3. In Figma, LiveDocs reads it and updates the file's variables **in place, by
   collection and name**. A variable keeps its ID, so every component and text
   style binding survives. Missing collections and variables are created;
   nothing is ever deleted.

Nothing to install, no API key, works on every Figma plan.

## Figma → GitHub

1. Edit variables in Figma.
2. LiveDocs → **Export Figma edits to GitHub** → **Copy changes**. The export
   holds only tokens edited since the last sync (see *baseline* below).
3. In your own terminal (not a sandboxed agent shell, which cannot read the
   clipboard):
   ```bash
   pbpaste | npm run tokens:from-figma        # or: npm run tokens:from-figma -- changes.json
   ```
   `scripts/figma/tokens-from-figma.mjs` finds the token each variable came
   from and rewrites that one `$value` in place. The files are hand-aligned, so
   it never reformats: every edit is verified by re-parsing the file, and a
   file where anything else changed is left untouched. It is idempotent; a
   second run reports "already".
4. `npm run build:tokens && npm run check:contrast`, commit on a branch, PR.

What maps back, and what is reported instead:

| Figma | Written to | Note |
| --- | --- | --- |
| Color Primitives | `tier-1-definitions/color.json` | hex |
| Color, Light / Dark | `tier-2-usage/semantic.light.json` / `.dark.json` | alias `{color.…}` or `rgb(r g b / a)` |
| Size, `font/size/*` | the tier-1 file that holds the token | keeps the token's unit: `rem` stays `rem`, `px` stays `px` |
| `font/weight/*` | `tier-1-definitions/typography.json` | |
| `typography/<style>/font-family`, `font-size`, `font-weight` | `tier-2-usage/text-style.json` | must alias a scale variable |
| `typography/<style>/line-height`, `letter-spacing` | — | derived px in Figma; change `line.height` / `letter.spacing` in code |
| `font/sans`, `font/mono` | — | code holds a font stack, Figma one family |
| `elevation/*/color`, Motion | — | part of a shadow token; motion not synced yet |

## The baseline: who changed what

A difference between Figma and GitHub does not say which side moved. LiveDocs
stores the value of every token at the last sync (the *baseline*) in the
widget. Then:

| Figma vs baseline | GitHub vs baseline | SYNC does | Export includes it |
| --- | --- | --- | --- |
| same | same | nothing | no |
| same | changed | applies GitHub's value | no |
| changed | same | keeps the Figma edit ("Figma edits kept") | yes |
| changed | changed | keeps Figma, reports a conflict | yes |

**Pull tokens** is the explicit override: it takes GitHub's value for
everything. A file that has never synced has no baseline, so its first SYNC
overwrites: export first if it holds edits.

## Limits

- 177 of 180 variables sync. Motion (timing, easing) is skipped in both
  directions.
- A widget runs only after someone interacts with it, on that person's
  machine. SYNC is a click, not a schedule. An unattended, scheduled sync
  would need the Figma REST variables API, which is Enterprise-only.
- `validate --strict` compares names, not values. A value can differ between
  the Figma library file and the code without CI noticing; SYNC the library
  file after token changes.
- CI does not run `check:contrast` yet. Run it before merging a token change.

## Lessons

- **Generated CSS goes stale when JSON is edited in GitHub's web editor.**
  `src/tokens/*.css` is committed, and nothing rebuilt it after PR #5. The
  live site was fine (CI rebuilds before deploying), but the repo copy was
  wrong until the next local `build:tokens`. A CI check
  (`npm run build:tokens && git diff --exit-code src/tokens`) would catch it.
- **"Failed to fetch" was the network**, not the widget: the log said
  `ERR_INTERNET_DISCONNECTED`. The widget now says so in plain words.
- **Clipboard copy inside a Figma plugin window must be synchronous.** Awaiting
  the async clipboard API first loses the click, and the fallback then fails
  silently. LiveDocs copies on the click and shows "Copied ✓" or "Press ⌘C".
- **Agent shells may not see the clipboard.** Run `pbpaste` in your own
  terminal.
