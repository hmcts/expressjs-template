#!/usr/bin/env node
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import { app } from './app';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('server');

let server: https.Server | http.Server | null;

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
  server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}

function gracefulShutdownHandler(signal: string) {
  logger.info(`⚠️ Caught ${signal}, gracefully shutting down`);

  server?.close(() => {
    logger.info('Connections closed, exiting');
    process.exit(0);
  });

  setTimeout(() => {
    logger.info('Forcefully shutting down application');
    // Close server if it's running
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);
