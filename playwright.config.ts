import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  testIgnore: process.env.RUN_PASSMARK === '1' ? [] : ['**/passmark/**'],
  timeout: 180_000,
  expect: {
    timeout: 12_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: 'https://automationexercise.com',
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    viewport: { width: 1366, height: 768 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
      },
    },
  ],
});
