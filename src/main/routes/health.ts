const healthcheck = require('@hmcts/nodejs-healthcheck');
import * as express from 'express';

const router = express.Router();

const healthCheckConfig = {
  checks: {
    // TODO: replace this sample check with proper checks for your application
    sampleCheck: healthcheck.raw(() => healthcheck.up()),
  },
};

healthcheck.addTo(router, healthCheckConfig);

module.exports = router;
