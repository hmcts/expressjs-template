#!/usr/bin/env node
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

import { app } from './app';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('server');

let httpsServer: https.Server | null = null;

// used by shutdownCheck in readinessChecks
app.locals.shutdown = false;

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT || '3100', 10);

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };
  httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}

function gracefulShutdownHandler(signal: string) {
  logger.info(`⚠️ Caught ${signal}, gracefully shutting down. Setting readiness to DOWN`);
  // stop the server from accepting new connections
  app.locals.shutdown = true;

  setTimeout(() => {
    logger.info('Shutting down application');
    // Close server if it's running
    httpsServer?.close(() => {
      logger.info('HTTPS server closed');
    });
  }, 4000);
}

process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);
