import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Express } from 'express';
import nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public readonly developmentMode: boolean) {}

  enableFor(app: Express): void {
    app.set('view engine', 'njk');

    const govukPackage = fileURLToPath(import.meta.resolve('govuk-frontend/package.json'));
    const govukTemplates = join(dirname(govukPackage), 'dist');
    const viewsPath = join(import.meta.dirname, '..', '..', 'views');

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
