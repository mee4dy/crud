import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path';

const pathSrc = path.resolve(__dirname, './');

export default defineConfig({
  build: {
    lib: {
      entry: [
        // Backend
        'nestjs/index.ts',

        // Frontend Store
        'vuex/index.js',

        // Frontend UI
        'ui/vue',
        'ui/nuxt/index.js',
        'ui/nuxt/plugin.js',
      ],
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        preserveModules: true,
        inlineDynamicImports: false,
        assetFileNames: 'ui/vue/style.css',
      },
      external: [
        '@mee4dy/crud/dist/ui/vue',
        '@mee4dy/crud/dist/ui/vue/style.css',

        'vue',
        'bootstrap-vue',
        'moment',
        'lodash',
        'sequelize',
        '@nestjs/common',
        'qs',
        'deep-object-diff',
        'path',
      ],
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
          @use "${pathSrc}/ui/vue/scss/variables.scss" as *;
        `,
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import', 'abs-percent'],
      },
    },
  },
});
