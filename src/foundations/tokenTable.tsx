import { useEffect, useRef, useState } from 'react';

/** Reads the computed value of a CSS custom property, so the docs show the
 *  resolved value for the theme currently selected in the toolbar. */
export function useResolved(names: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  // Runs after every render so a theme flip in the toolbar is picked up, but
  // only commits when a value actually changed — otherwise setting a fresh
  // object each time would re-trigger the effect forever.
  useEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    const next: Record<string, string> = {};
    for (const name of names) next[name] = style.getPropertyValue(name).trim();

    const keys = Object.keys(next);
    const unchanged =
      keys.length === Object.keys(values).length && keys.every((k) => values[k] === next[k]);
    if (!unchanged) setValues(next);
  });

  return { ref, values };
}

export function Page({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--pds-font-sans)', maxWidth: 900 }}>
      <h1 style={{ fontSize: 'var(--pds-font-size-xl)', margin: '0 0 var(--pds-space-2)' }}>{title}</h1>
      <p style={{ color: 'var(--pds-color-content-muted)', margin: '0 0 var(--pds-space-8)', maxWidth: '60ch' }}>
        {intro}
      </p>
      {children}
    </div>
  );
}

export function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 'var(--pds-space-10)' }}>
      <h2 style={{ fontSize: 'var(--pds-font-size-lg)', margin: '0 0 var(--pds-space-1)' }}>{title}</h2>
      {note ? (
        <p style={{ color: 'var(--pds-color-content-muted)', fontSize: 'var(--pds-font-size-sm)', margin: '0 0 var(--pds-space-4)', maxWidth: '60ch' }}>
          {note}
        </p>
      ) : (
        <div style={{ height: 'var(--pds-space-4)' }} />
      )}
      {children}
    </section>
  );
}

export const mono: React.CSSProperties = {
  fontFamily: 'var(--pds-font-mono)',
  fontSize: 'var(--pds-font-size-xs)',
};
