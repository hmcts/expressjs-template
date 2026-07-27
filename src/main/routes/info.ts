import { hostname } from 'node:os';

import { infoRequestHandler } from '@hmcts/info-provider';
import type { Router } from 'express';

export default function (app: Router): void {
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: hostname(),
        name: 'expressjs-template',
        uptime: process.uptime(),
      },
      info: {
        // TODO: add downstream info endpoints if your app has any
      },
    })
  );
}
