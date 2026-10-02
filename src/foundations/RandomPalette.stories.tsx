import type { Meta, StoryObj } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { contrast } from 'randoma11y';
import { Page, Group, mono, useResolved } from './tokenTable';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { Switch } from '../components/Switch';

/** The pairs components paint, as in ds-inspection/checks/contrast-pairs.mjs. */
const PAIRS: Array<[label: string, bg: string, fg: string, min: number]> = [
  ['Body text', 'background-default', 'content-default', 4.5],
  ['Text on a card', 'background-surface', 'content-default', 4.5],
  ['Muted text, sunken', 'background-sunken', 'content-muted', 4.5],
  ['Ghost button, active tab', 'background-surface', 'content-accent', 4.5],
  ['Accent badge', 'background-accent-subtle', 'content-accent', 4.5],
  ['Primary button', 'background-accent', 'content-on-accent', 4.5],
  ['Primary button, hover', 'background-accent-hover', 'content-on-accent', 4.5],
  ['Checkbox, switch track', 'background-surface', 'border-strong', 3],
  ['Focus ring', 'background-surface', 'border-focus', 3],
];

const NAMES = [...new Set(PAIRS.flatMap(([, bg, fg]) => [bg, fg]))].map((n) => `--pds-color-${n}`);

function ContrastTable() {
  const { ref, values } = useResolved(NAMES);
  return (
    <div ref={ref} style={{ display: 'grid', gap: 'var(--pds-space-2)' }}>
      {PAIRS.map(([label, bg, fg, min]) => {
        const [b, f] = [values[`--pds-color-${bg}`], values[`--pds-color-${fg}`]];
        const ratio = b && f ? contrast(b, f, 'WCAG21') : NaN;
        const pass = ratio >= min;
        return (
          <div
            key={label}
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr auto',
              alignItems: 'center',
              gap: 'var(--pds-space-3)',
            }}
          >
            {/* Text pairs show text; UI pairs (3:1) show a border, which is what they paint. */}
            <div
              aria-hidden
              style={{
                height: 32,
                borderRadius: 'var(--pds-radius-md)',
                border: fg.startsWith('border')
                  ? `2px solid var(--pds-color-${fg})`
                  : '1px solid var(--pds-color-border-default)',
                background: `var(--pds-color-${bg})`,
                color: `var(--pds-color-${fg})`,
                display: 'grid',
                placeItems: 'center',
                fontWeight: 'var(--pds-font-weight-bold)',
              }}
            >
              {fg.startsWith('border') ? null : 'Aa'}
            </div>
            <div>
              <div>{label}</div>
              <div style={{ ...mono, color: 'var(--pds-color-content-muted)' }}>
                {fg} on {bg}
              </div>
            </div>
            {/* Plain text, not a status Badge: the result must stay legible on any palette. */}
            <span style={{ ...mono, fontWeight: pass ? undefined : 'var(--pds-font-weight-bold)' }}>
              {Number.isNaN(ratio) ? '…' : `${pass ? '✓' : '✗'} ${ratio.toFixed(2)}:1 ${pass ? '≥' : '<'} ${min}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Specimen() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--pds-space-4)' }}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Weekly digest</Card.Title>
          <Card.Description>Every colour here comes from a semantic role.</Card.Description>
        </Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', gap: 'var(--pds-space-2)', flexWrap: 'wrap' }}>
            <Badge variant="accent">New</Badge>
            <Badge>Draft</Badge>
          </div>
        </Card.Body>
        <Card.Footer>
          <div style={{ display: 'flex', gap: 'var(--pds-space-2)' }}>
            <Button>Subscribe</Button>
            <Button variant="secondary">Later</Button>
            <Button variant="ghost">Skip</Button>
          </div>
        </Card.Footer>
      </Card.Root>
      <Card.Root variant="elevated">
        <Card.Body>
          <div style={{ display: 'grid', gap: 'var(--pds-space-4)' }}>
            <TextField label="Email" description="We never share it." placeholder="you@example.com" />
            <Switch label="Send me the digest" defaultChecked />
          </div>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

const meta = {
  title: 'Foundations/Random palette',
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Shuffle draws a new theme with randoma11y and switches the toolbar's
 * Palette to Randoma11y, so every other story shows it too until you switch
 * back to Pancake.
 */
export const Playground: Story = {
  render: function Render() {
    const [globals, updateGlobals] = useGlobals();
    const random = globals.palette === 'random';
    return (
      <Page
        title="Random palette"
        intro="randoma11y draws a background and foreground that meet WCAG 2.1 7:1, then an accent at 4.5:1. createRandomTheme() grows that into the semantic colour roles and checks each pair below. Status colours keep their authored values: their hue carries meaning."
      >
        <div style={{ display: 'flex', gap: 'var(--pds-space-2)', marginBottom: 'var(--pds-space-8)' }}>
          <Button onClick={() => updateGlobals({ palette: 'random', paletteSeed: String(Date.now()) })}>
            Shuffle
          </Button>
          <Button variant="secondary" disabled={!random} onClick={() => updateGlobals({ palette: 'pancake' })}>
            Back to Pancake
          </Button>
        </div>
        <Group title="Specimen" note="Real components, unchanged. Only the custom properties they read are different.">
          <Specimen />
        </Group>
        <Group title="Contrast" note="Measured from the values resolved on this page right now, for whichever palette is showing.">
          <ContrastTable />
        </Group>
      </Page>
    );
  },
};
