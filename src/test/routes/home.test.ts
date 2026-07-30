import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { createApp } from '../../main/app.js';

describe('Home page', () => {
  describe('on GET', () => {
    test('should return sample home page', async () => {
      const app = await createApp();

      const response = await supertest(app).get('/');

      expect(response.text).toContain('Default page template');
      expect(response.status).toBe(200);
    });
  });
});
