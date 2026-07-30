import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { createApp } from '../../main/app.js';

const app = await createApp();

describe('Health routes', () => {
  beforeEach(() => {
    app.locals.shutdown = false;
  });

  test.each([
    { route: '/health', behaviour: 'returns health status' },
    { route: '/health/liveness', behaviour: 'is live' },
    { route: '/health/readiness', behaviour: 'is ready while the application is running' },
  ])('$behaviour', async ({ route }) => {
    const response = await supertest(app).get(route);

    expect(response.status).toBe(200);
  });

  test('is not ready while the application is shutting down', async () => {
    app.locals.shutdown = true;

    const response = await supertest(app).get('/health/readiness');

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      status: 'DOWN',
    });
  });
});
