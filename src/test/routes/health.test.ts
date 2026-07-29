import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { createApp } from '../../main/app.js';

const app = await createApp();

describe('Health routes', () => {
  beforeEach(() => {
    app.locals.shutdown = false;
  });

  test('returns health status', async () => {
    const response = await supertest(app).get('/health');

    expect(response.status).toBe(200);
  });

  test('is live', async () => {
    const response = await supertest(app).get('/health/liveness');

    expect(response.status).toBe(200);
  });

  test('is ready while the application is running', async () => {
    const response = await supertest(app).get('/health/readiness');

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
