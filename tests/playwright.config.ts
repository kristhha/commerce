// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./tests/global.setup'),
  baseURL: 'http://localhost:3000', // Your local dev server URL
  testDir: './tests',
  reporter: 'list', // Or 'html' for a nice HTML report
  use: {
    browserName: 'chromium',
    headless: process.env.CI ? true : false, // Run headless in CI, headed locally
    viewport: { width: 1280, height: 720 },
    // video: 'on-first-retry', // Record video for failing tests
    trace: 'on-first-retry', // Capture trace for failing tests
  },
});
