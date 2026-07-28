import healthcheck from '@hmcts/nodejs-healthcheck';
import type { Application } from 'express';

function shutdownCheck(app: Application): boolean {
  return app.locals.shutdown;
}

export default function (app: Application): void {
  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
    readinessChecks: {
      shutdownCheck: healthcheck.raw(() => {
        return shutdownCheck(app) ? healthcheck.down() : healthcheck.up();
      }),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
