import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

/**
 * Builds the installable package: dist/lib/index.js plus one stylesheet that
 * carries the tokens, every component's CSS and the two font families (library
 * mode always inlines assets, so the stylesheet is self-contained). Dependencies stay external, so
 * the consuming app brings its own React and Base UI.
 */
const external = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/lib',
    emptyOutDir: true,
    copyPublicDir: false,
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index', cssFileName: 'styles' },
    rollupOptions: {
      external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    },
  },
});
