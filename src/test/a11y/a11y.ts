import type { Server } from 'http';
import type { AddressInfo } from 'net';

import { app } from '../../main/app';

import AxeBuilder from '@axe-core/playwright';
import { type Browser, chromium } from 'playwright';

let server: Server;
let browser: Browser;
let baseUrl: string;

beforeAll(async () => {
  server = app.listen(0);

  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Server address is not available');
  }

  baseUrl = `http://localhost:${(address as AddressInfo).port}`;

  browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
});

afterAll(async () => {
  await browser.close();

  await new Promise<void>((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

function testAccessibility(path: string): void {
  describe(`Page ${path}`, () => {
    test('should have no automatically detectable accessibility violations', async () => {
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        const response = await page.goto(`${baseUrl}${path}`, {
          waitUntil: 'load',
        });

        expect(response).not.toBeNull();
        expect(response?.ok()).toBe(true);

        const results = await new AxeBuilder({ page })
          .exclude('.govuk-footer__licence-logo')
          .exclude('.govuk-header__logotype-crown')
          .analyze();

        if (results.violations.length > 0) {
          throw new Error(`There are accessibility violations:\n${JSON.stringify(results.violations, null, 2)}`);
        }
      } finally {
        await context.close();
      }
    }, 150000);
  });
}

testAccessibility('/');
