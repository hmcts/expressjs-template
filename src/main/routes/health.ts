import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application) {
  const healthCheckConfig = {
    checks: {
      // TODO: replace this sample check with proper checks for your application
      sampleCheck: healthcheck.raw(() => healthcheck.up()),
    },
  };

  healthcheck.addTo(app, healthCheckConfig);
}
