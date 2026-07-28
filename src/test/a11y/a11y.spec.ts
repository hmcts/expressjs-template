import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

function testAccessibility(path: string): void {
  test.describe(`Page ${path}`, () => {
    test('should have no automatically detectable accessibility violations', async ({ page }) => {
      const response = await page.goto(path, {
        waitUntil: 'load',
      });

      expect(response).not.toBeNull();
      expect(response?.ok()).toBe(true);

      const results = await new AxeBuilder({ page })
        .exclude('.govuk-footer__licence-logo')
        .exclude('.govuk-header__logotype-crown')
        .analyze();

      expect(
        results.violations,
        `There are accessibility violations:\n${JSON.stringify(results.violations, null, 2)}`
      ).toEqual([]);
    });
  });
}

testAccessibility('/');
