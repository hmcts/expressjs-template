import supertest from 'supertest';

import { app } from '../../main/app';

describe('Home page', () => {
  describe('on GET', () => {
    test('should return sample home page', async () => {
      const response = await supertest(app).get('/');

      expect(response.status).toBe(200);
    });
  });
});
