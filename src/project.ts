/**
 * Where Pancake DS lives. One place, so the Overview, Getting started and the
 * package metadata cannot point at different homes.
 */
export const PROJECT = {
  name: 'Pancake DS',
  github: 'https://github.com/juliasakakibara/expert-octo-pancake',
  storybook: 'https://juliasakakibara.github.io/expert-octo-pancake/',
  figma: 'https://www.figma.com/design/iMysuIxqcsHZ4OpffFKYMp',
} as const;

/** `https://github.com/a/b` -> `github.com/a/b`, for showing a link as text. */
export const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
