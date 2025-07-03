import path from 'path';

/**
 * Nuxt module
 */
export default function nuxtCrudUI(moduleOptions) {
  this.addPlugin(path.resolve(__dirname, 'plugin.js'));
}
