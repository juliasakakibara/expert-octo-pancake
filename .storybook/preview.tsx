import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/tokens/base.css';
import { breakpoints } from '../src/tokens/breakpoints';
import { ComponentDocsPage } from './ComponentDocsPage';
import { createRandomTheme, applyTheme, clearTheme, type ThemeVars } from '../src/theme';

/** Viewports come from the breakpoint tokens, so the sizes designers test at
 *  and the sizes the CSS is written against cannot drift apart. */
const viewports = Object.fromEntries(
  Object.entries(breakpoints).map(([name, width]) => [
    name,
    { name: `${name} (${width})`, styles: { width, height: '900px' }, type: 'desktop' as const },
  ]),
);

/**
 * Applies the selected theme by setting the token scope on a wrapper.
 * Fullscreen stories get no padding, so app shells sit flush to the frame.
 */
/** One random theme per seed, so re-rendering a story does not reshuffle it. */
const randomThemes = new Map<string, ThemeVars>();
const randomThemeFor = (seed: string) => {
  if (!randomThemes.has(seed)) randomThemes.set(seed, createRandomTheme().vars);
  return randomThemes.get(seed)!;
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  const fullscreen = context.parameters.layout === 'fullscreen';
  document.documentElement.setAttribute('data-theme', theme);

  // Palette "Randoma11y" overrides the semantic colour roles inline, on the root
  // (for portalled popups) and on the wrapper (which re-scopes [data-theme]).
  const random = context.globals.palette === 'random' ? randomThemeFor(context.globals.paletteSeed ?? '0') : null;
  if (random) applyTheme(random);
  else clearTheme();

  return (
    <div
      data-theme={theme}
      style={{
        ...random,
        background: 'var(--pds-color-background-default)',
        color: 'var(--pds-color-content-default)',
        padding: fullscreen ? 0 : 'var(--pds-space-6)',
        minHeight: '100%',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { theme: 'light', palette: 'pancake', paletteSeed: '0' },
  globalTypes: {
    palette: {
      description: 'Colour palette: the authored tokens, or a random accessible theme from randoma11y',
      toolbar: {
        title: 'Palette',
        icon: 'paintbrush',
        items: [
          { value: 'pancake', title: 'Pancake' },
          { value: 'random', title: 'Randoma11y' },
        ],
        dynamicTitle: true,
      },
    },
    // Changed by the Shuffle button in Foundations/Random palette; no toolbar of its own.
    paletteSeed: { description: 'Which random palette is showing' },
    theme: {
      description: 'Token theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    // Default Docs page + the component's own stylesheet at the end.
    docs: { page: ComponentDocsPage },
    layout: 'centered',
    viewport: { options: viewports },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Overview',
          'Getting started',
          'Sync status',
          'Toolkit',
          'Layout',
          'Figma only',
          'Gaps',
          'Foundations',
          ['Colour', 'Random palette', 'Typography', 'Space and shape', 'Motion'],
          'Components',
          ['Actions', 'Forms', 'Navigation', 'Overlays', 'Content', 'Layout', 'Display', 'Feedback'],
          'Patterns',
        ],
      },
    },
  },
};

export default preview;
