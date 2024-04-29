import { app as myApp } from '../app';

import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

function shutdownCheck(): boolean {
  return myApp.locals.shutdown;
}

export default function (app: Application): void {
  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
    readinessChecks: {
      shutdownCheck: healthcheck.raw(() => {
        return shutdownCheck() ? healthcheck.down() : healthcheck.up();
      }),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
