import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Group, mono, useResolved } from './tokenTable';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const WEIGHTS = ['regular', 'medium', 'bold'] as const;

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Scale() {
  const { ref, values } = useResolved(SIZES.map((s) => `--pds-font-size-${s}`));
  return (
    <div ref={ref} style={{ display: 'grid', gap: 'var(--pds-space-5)' }}>
      {[...SIZES].reverse().map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--pds-space-6)' }}>
          <div style={{ ...mono, width: 200, flexShrink: 0, color: 'var(--pds-color-content-muted)' }}>
            --pds-font-size-{size}
            <br />
            {values[`--pds-font-size-${size}`]}
          </div>
          <div style={{ fontSize: `var(--pds-font-size-${size})`, lineHeight: 'var(--pds-line-height-tight)' }}>
            Design systems are agreements, written down.
          </div>
        </div>
      ))}
    </div>
  );
}

export const Scales: Story = {
  render: () => (
    <Page
      title="Typography"
      intro="A deliberately short scale. Five sizes and three weights cover almost everything, and a short scale is far easier to keep consistent than a long one. If you find yourself wanting a sixth size, the usual answer is that the layout needs more space, not more type."
    >
      <Group title="Size">
        <Scale />
      </Group>

      <Group title="Weight" note="Regular for body, medium for labels and controls, bold for headings. There is no light weight, because it fails contrast at small sizes.">
        <div style={{ display: 'grid', gap: 'var(--pds-space-3)' }}>
          {WEIGHTS.map((w) => (
            <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--pds-space-6)' }}>
              <div style={{ ...mono, width: 200, flexShrink: 0, color: 'var(--pds-color-content-muted)' }}>
                --pds-font-weight-{w}
              </div>
              <div style={{ fontSize: 'var(--pds-font-size-lg)', fontWeight: `var(--pds-font-weight-${w})` }}>
                Design systems are agreements, written down.
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Line height" note="Tight for headings and controls where the box is sized by the text. Normal for anything you actually read.">
        <div style={{ display: 'grid', gap: 'var(--pds-space-6)', maxWidth: '52ch' }}>
          {(['tight', 'normal'] as const).map((lh) => (
            <div key={lh}>
              <div style={{ ...mono, color: 'var(--pds-color-content-muted)', marginBottom: 'var(--pds-space-2)' }}>
                --pds-line-height-{lh}
              </div>
              <p style={{ margin: 0, lineHeight: `var(--pds-line-height-${lh})` }}>
                A component library is the visible part. The agreements underneath it, about spacing,
                about naming, about who decides, are the part that determines whether it survives
                contact with a real product team.
              </p>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Families">
        <div style={{ display: 'grid', gap: 'var(--pds-space-3)' }}>
          <div style={{ fontFamily: 'var(--pds-font-sans)', fontSize: 'var(--pds-font-size-lg)' }}>
            Sans, Inter. Used everywhere.
          </div>
          <div style={{ fontFamily: 'var(--pds-font-mono)', fontSize: 'var(--pds-font-size-lg)' }}>
            Mono, Roboto Mono. For token names, code and tabular figures.
          </div>
        </div>
      </Group>
    </Page>
  ),
};
