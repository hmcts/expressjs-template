const testUrl = process.env.TEST_URL || 'https://localhost:3100';

describe('Smoke Test', () => {
  describe('Home page loads', () => {
    test('with correct content', async () => {
      const response = await fetch(testUrl, {
        signal: AbortSignal.timeout(10_000),
      });

      expect(response.status).toBe(200);

      const body = await response.text();

      expect(body).toContain('<h1 class="govuk-heading-xl">Default page template</h1>');
    });
  });
});
