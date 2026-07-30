#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { join } from 'node:path';

import { createApp } from './app.js';
import { getLogger } from './modules/logging/index.js';

const app = await createApp();
const logger = getLogger('server');

const port = Number.parseInt(process.env.PORT ?? '3100', 10);
const developmentMode = app.locals.ENV === 'development';
const shutdownDelayMs = 4_000;

const server = developmentMode
  ? createHttpsServer(
      {
        cert: readFileSync(join(import.meta.dirname, 'resources', 'localhost-ssl', 'localhost.crt')),
        key: readFileSync(join(import.meta.dirname, 'resources', 'localhost-ssl', 'localhost.key')),
      },
      app
    )
  : createHttpServer(app);

const protocol = developmentMode ? 'https' : 'http';

server.listen(port, () => {
  logger.info(`Application started: ${protocol}://localhost:${port}`);
});

function gracefulShutdownHandler(signal: NodeJS.Signals): void {
  logger.info(`⚠️ Caught ${signal}, gracefully shutting down. Setting readiness to DOWN`);

  app.locals.shutdown = true;

  setTimeout(() => {
    logger.info('Shutting down application');

    server.close(() => {
      logger.info('Application server closed');
    });
  }, shutdownDelayMs);
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.once(signal, () => {
    gracefulShutdownHandler(signal);
  });
}
