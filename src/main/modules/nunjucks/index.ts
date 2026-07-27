import { dirname, join } from 'node:path';

import type { Express } from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public readonly developmentMode: boolean) {}

  enableFor(app: Express): void {
    app.set('view engine', 'njk');

    const govukTemplates = join(dirname(require.resolve('govuk-frontend/package.json')), 'dist');
    const viewsPath = join(__dirname, '..', '..', 'views');

    nunjucks.configure([govukTemplates, viewsPath], {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
