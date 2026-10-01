import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Separator } from '../components/Separator';
import figma from '../../figma/manifest.json';
import { PROJECT, bare } from '../project';
import styles from './Overview.module.css';

/*
 * The Overview, built from Figma's README frame (Overview, 110:97) with the
 * system's own components. Counts are read from the code and from the Figma
 * snapshot, so the page cannot drift from either.
 */

const cx = (...c: string[]) => c.join(' ');

const componentsInCode = Object.keys(import.meta.glob('../components/*/index.ts')).length;
const figmaIcons = figma.components.filter((c) => c.name.startsWith('icon/')).length;
const figmaComponents = figma.components.length - figmaIcons;
const figmaVariables = Object.values(figma.variables).reduce((n, c) => n + c.names.length, 0);
const colourModes = figma.variables.Color.modes;

/** Running text with `backticks` rendered as inline code. */
function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') ? (
          <code key={i} className={styles.code}>
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

function SectionHeading({ title, lead }: { title: string; lead: string }) {
  return (
    <div className={styles.stack}>
      <h2 className={cx(styles.headingLg, styles.p)}>{title}</h2>
      <p className={cx(styles.bodyMd, styles.muted, styles.p)}>{lead}</p>
    </div>
  );
}

function LinkTile({ label, title, href }: { label: string; title: string; href: string }) {
  return (
    <div className={cx(styles.tile, styles.tileRoomy)}>
      <span className={cx(styles.overline, styles.muted)}>{label}</span>
      <a className={cx(styles.headingLg, styles.link)} href={href} target="_blank" rel="noreferrer">
        {title} ↗
      </a>
      <span className={cx(styles.codeSm, styles.muted, styles.url)}>{bare(href)}</span>
    </div>
  );
}

function NumberTile({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.tile}>
      <span className={styles.headingLg}>{value}</span>
      <span className={cx(styles.bodySm, styles.muted)}>{label}</span>
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className={styles.list}>
      {items.map((text, i) => (
        <li key={i} className={styles.stack}>
          {i > 0 ? <Separator /> : null}
          <div className={styles.item}>
            <span className={cx(styles.codeSm, styles.muted)}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.bodyMd}>
              <Rich>{text}</Rich>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AudienceCard({ tag, accent, title, items }: { tag: string; accent: boolean; title: string; items: string[] }) {
  return (
    <div className={cx(styles.tile, styles.tileRoomy)}>
      <div className={styles.stack}>
        <span>
          <Badge variant={accent ? 'accent' : 'neutral'}>{tag}</Badge>
        </span>
        <h3 className={cx(styles.titleMd, styles.p)}>{title}</h3>
      </div>
      <NumberedList items={items} />
    </div>
  );
}

function InfoTile({ eyebrow, title, text, roomy = true }: { eyebrow: string; title: string; text: string; roomy?: boolean }) {
  return (
    <div className={cx(styles.tile, roomy ? styles.tileRoomy : '')}>
      <span className={cx(styles.overline, styles.accent)}>{eyebrow}</span>
      <h3 className={cx(styles.titleMd, styles.p)}>{title}</h3>
      <p className={cx(styles.bodySm, styles.muted, styles.p)}>
        <Rich>{text}</Rich>
      </p>
    </div>
  );
}

function Step({ title, note }: { title: string; note: string }) {
  return (
    <div className={styles.step}>
      <span className={styles.titleSm}>{title}</span>
      <span className={cx(styles.codeSm, styles.muted)}>{note}</span>
    </div>
  );
}

const Arrow = () => (
  <span aria-hidden className={cx(styles.headingLg, styles.arrow)}>
    →
  </span>
);

function FlowRow({ tag, accent, steps }: { tag: string; accent: boolean; steps: Array<[string, string]> }) {
  return (
    <div className={styles.row}>
      <Arrow />
      <Badge variant={accent ? 'accent' : 'neutral'}>{tag}</Badge>
      {steps.map(([title, note], i) => [
        i > 0 ? <Arrow key={`a${i}`} /> : null,
        <Step key={title} title={title} note={note} />,
      ])}
    </div>
  );
}

const TREE: Array<[string, string]> = [
  ['tokens/', 'source of truth, DTCG JSON'],
  ['  tier-1-definitions/', 'raw ramps and scales'],
  ['  tier-2-usage/', 'roles, Light + Dark, text styles'],
  ['scripts/', 'token build, Figma mirror, validate'],
  ['src/tokens/', 'generated CSS, do not edit'],
  ['src/components/', `${componentsInCode} components, one folder each`],
  ['src/theme/', 'random accessible palettes (randoma11y)'],
  ['src/foundations/', 'Colour, Typography, Space and shape, Motion'],
  ['src/patterns/', 'full screens and prototypes'],
  ['figma/', 'manifest.json and GAPS.md'],
  ['docs/', 'decisions, architecture, conventions, branching'],
];

export function Overview() {
  return (
    <div className={styles.page}>
      <header className={styles.stack}>
        <div className={styles.cluster}>
          <span className={styles.dot} />
          <span className={cx(styles.overline, styles.accent)}>README · Start here</span>
        </div>
        <h1 className={cx(styles.headingXl, styles.p)}>{PROJECT.name}</h1>
        <p className={cx(styles.bodyMd, styles.muted, styles.p)}>
          A design system built on Base UI primitives, documented in Storybook, with tokens that sync to Figma
          variables. Code is the source of truth. The Figma file is generated from it, so names, properties and values
          match the code one to one.
        </p>
      </header>

      <section className={styles.section} aria-label="At a glance">
        <div className={styles.columns3}>
          <LinkTile label="Live docs" title="Storybook" href={PROJECT.storybook} />
          <LinkTile label="Code" title="GitHub" href={PROJECT.github} />
          <LinkTile label="Figma file" title="Figma" href={PROJECT.figma} />
        </div>
        <div className={styles.columns6}>
          <NumberTile value={componentsInCode} label="components in code" />
          <NumberTile value={figmaComponents} label={`components in Figma, plus ${figmaIcons} icons`} />
          <NumberTile value={figmaVariables} label="variables" />
          <NumberTile value={figma.textStyles.length} label="text styles" />
          <NumberTile value={figma.effectStyles.length} label="effect styles" />
          <NumberTile value={colourModes.length} label={`colour modes: ${colourModes.join(' and ')}`} />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title="Start here" lead="Same system, two ways in." />
        <div className={styles.columns2}>
          <AudienceCard
            tag="Design"
            accent
            title="For designers"
            items={[
              'Use the components in the library. Their properties are the code’s props: `variant=primary`, `size=md`.',
              'Pick colours by role, not by hue. Three groups: `background`, `content`, `border`.',
              'Set any frame’s Color mode to Dark and every colour follows.',
              'Don’t edit the Figma library by hand. It is generated from the code, so ask for the change in code.',
              'See every component live, with all its states, in Storybook.',
            ]}
          />
          <AudienceCard
            tag="Dev"
            accent={false}
            title="For developers"
            items={[
              '`npm install`, then `npm run storybook`. It opens on `localhost:6001`.',
              'Edit `tokens/**/*.json`, then run `npm run build:tokens`. Never edit the generated CSS.',
              'Components use semantic tokens only. Never a primitive, never a raw hex.',
              'If Base UI ships a primitive, wrap it. Never rebuild focus handling or ARIA.',
              '`npm run validate` checks the rules. It runs strict in CI.',
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title="The stack" lead="Plain, well-supported tools. Nothing exotic." />
        <div className={styles.columns3}>
          <InfoTile eyebrow="1.8" title="Base UI" text="Unstyled, accessible primitives: behaviour, keyboard and ARIA." />
          <InfoTile eyebrow="19 · 6" title="React + TypeScript" text="The components, fully typed." />
          <InfoTile eyebrow="8" title="Vite" text="Build and dev server." />
          <InfoTile eyebrow="Custom properties" title="CSS Modules" text="Styles read from tokens, inspectable in the browser." />
          <InfoTile eyebrow="5" title="Style Dictionary" text="DTCG JSON in, CSS variables out." />
          <InfoTile eyebrow="10" title="Storybook" text="Docs, accessibility checks and an MCP addon for AI." />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title="How it stays in sync" lead="One source, two outputs. Code is the source. Figma follows." />
        <div className={styles.flow}>
          <div className={styles.source}>
            <span className={cx(styles.overline, styles.accent)}>Source of truth</span>
            <span className={cx(styles.titleMd, styles.accent)}>
              <code className={styles.code}>tokens/*.json</code>
            </span>
            <span className={cx(styles.bodySm, styles.muted)}>Plus each component’s .tsx and CSS.</span>
          </div>
          <div className={styles.rows}>
            <FlowRow
              tag="Code"
              accent={false}
              steps={[
                ['npm run build:tokens', 'Style Dictionary'],
                ['CSS variables', '--pds-*'],
                ['React components', 'shown in Storybook'],
              ]}
            />
            <FlowRow
              tag="Figma"
              accent
              steps={[
                ['figma-library-from-code', 'scripts + checks'],
                ['Figma variables', 'and styles'],
                ['Figma components', 'the library'],
              ]}
            />
          </div>
        </div>
        <Alert variant="success" title="npm run validate compares Figma with the code.">
          If a name or a value drifts, the check fails.
        </Alert>
      </section>

      <section className={styles.section}>
        <SectionHeading
          title="Two token tiers"
          lead="A primitive says what a colour is. A semantic token says what it is for. Only the second survives a rebrand."
        />
        <div className={styles.tiers}>
          <div className={cx(styles.tile, styles.tileRoomy)}>
            <span className={cx(styles.overline, styles.accent)}>Tier 1 · Definitions</span>
            <h3 className={cx(styles.titleMd, styles.p)}>What a value is</h3>
            <p className={cx(styles.bodySm, styles.muted, styles.p)}>
              Raw material: colour ramps, the spacing scale, the type scale. Components never use these directly.
            </p>
            <div className={styles.example}>
              <div className={styles.swatch} />
              <div className={styles.stack}>
                <code className={styles.code}>--pds-color-brand-blue-600</code>
                <span className={cx(styles.codeSm, styles.muted)}>one fixed value</span>
              </div>
            </div>
          </div>
          <Arrow />
          <div className={cx(styles.tile, styles.tileRoomy)}>
            <span className={cx(styles.overline, styles.accent)}>Tier 2 · Usage</span>
            <h3 className={cx(styles.titleMd, styles.p)}>What a value is for</h3>
            <p className={cx(styles.bodySm, styles.muted, styles.p)}>
              Roles with a Light and a Dark value. Components use only these, and each one is a Figma variable.
            </p>
            <div className={styles.example}>
              <div className={styles.cluster}>
                <div data-theme="light">
                  <div className={styles.swatch} title="Light" />
                </div>
                <div data-theme="dark">
                  <div className={styles.swatch} title="Dark" />
                </div>
              </div>
              <div className={styles.stack}>
                <code className={styles.code}>--pds-color-background-accent</code>
                <span className={cx(styles.codeSm, styles.muted)}>Light · Dark</span>
              </div>
            </div>
          </div>
        </div>
        <Alert variant="info" title="Shuffle the palette.">
          Because components read only tier 2, a whole new palette is just new values for those roles. Pick Randoma11y
          under Palette in the toolbar, or open Foundations → Random palette, for a random theme that still passes
          WCAG contrast.
        </Alert>
      </section>

      <section className={styles.section}>
        <SectionHeading title="Read it in this order" lead="The same order in Storybook and in Figma." />
        <div className={styles.columns3}>
          <InfoTile
            eyebrow="01"
            title="Foundations"
            text="Colour, Typography, Space and shape, Motion. The decisions everything else inherits."
          />
          <InfoTile
            eyebrow="02"
            title="Components"
            text="A Default variant first, then one per state. The properties are the code’s props."
          />
          <InfoTile
            eyebrow="03"
            title="Patterns"
            text="Real screens built from the library. Where you find out whether the system holds together."
          />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeading title="Repository" lead="Where things live in the code." />
        <pre className={cx(styles.tree, styles.codeSm)}>
          {TREE.map(([path, note]) => (
            <span key={path}>
              <strong>{path.padEnd(26)}</strong>
              {note}
              {'\n'}
            </span>
          ))}
        </pre>
      </section>

      <footer className={styles.stack}>
        <Separator />
        <div className={styles.footer}>
          <span className={styles.bodySm}>Generated from the code on main.</span>
          <span className={styles.overline}>{PROJECT.name}</span>
        </div>
      </footer>
    </div>
  );
}
