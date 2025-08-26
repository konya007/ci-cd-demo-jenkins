import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    allowedHosts: ['konnn04.pythonanywhere.com']
  },
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
    deps: {
      inline: ['@testing-library/user-event'],
    },
  },
});
