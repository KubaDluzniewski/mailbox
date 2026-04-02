import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// Use same plugins as vite, or just vue for simple testing
// unplugin-vue-components is often skipped in unit testing to define globals manually or they work ok depending on setup
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
