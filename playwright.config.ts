import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.TEST_URL ?? 'https://localhost:3100';

const headless = process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'true' : true;

const slowMo = Number.parseInt(process.env.TEST_SLOW_MO ?? (headless ? '0' : '250'), 10);

export default defineConfig({
  outputDir: './functional-output/functional/results',

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    [
      'junit',
      {
        outputFile: './functional-output/functional/reports/playwright-results.xml',
      },
    ],
  ],

  webServer: process.env.TEST_URL
    ? undefined
    : {
        command: 'yarn start:dev',
        url: `${baseURL}/health`,
        reuseExistingServer: !process.env.CI,
        ignoreHTTPSErrors: true,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },

  use: {
    baseURL,
    headless,
    ignoreHTTPSErrors: true,

    actionTimeout: 10_000,
    navigationTimeout: 10_000,

    launchOptions: {
      slowMo,
    },

    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testDir: './src/test/functional',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'accessibility',
      testDir: './src/test/a11y',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
