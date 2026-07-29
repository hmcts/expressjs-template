import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { createApp } from '../../main/app.js';

const app = await createApp();

describe('Error routes', () => {
  test('returns 404 for an unknown route', async () => {
    const response = await supertest(app).get('/this-route-does-not-exist');

    expect(response.status).toBe(404);
    expect(response.type).toBe('text/html');
  });

  test('handles request parsing errors', async () => {
    const response = await supertest(app).post('/').set('Content-Type', 'application/json').send('{"invalid":');

    expect(response.status).toBe(400);
    expect(response.type).toBe('text/html');
  });
});
