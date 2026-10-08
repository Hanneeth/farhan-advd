import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  outputDir: 'test-results',
  use: {
    baseURL: 'http://localhost:4173/',
    launchOptions: { executablePath: process.env.PW_CHROME ?? '/opt/pw-browsers/chromium' },
  },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
