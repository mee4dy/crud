import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';

const pathSrc = path.resolve(__dirname, './src');

export default defineConfig({
  root: './src',
  build: {
    lib: {
      entry: ['./vue', './nuxt/index.js', './nuxt/plugin.js'],
    },
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        preserveModules: true,
        inlineDynamicImports: false,
        assetFileNames: 'ui/vue/style.css',
      },
      external: ['vue', 'bootstrap-vue', 'moment', 'path'],
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${pathSrc}/vue/scss/variables.scss" as *;
        `,
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'abs-percent'],
      },
    },
  },
});
