import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('loads the default template', async ({ page }) => {
    const response = await page.goto('/?lng=en');

    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Default page template',
      })
    ).toBeVisible();
  });
});
