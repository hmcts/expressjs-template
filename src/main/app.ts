import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';

import { setupDev } from './development.js';
import { HttpError } from './http-error.js';
import { AppInsights } from './modules/appinsights/index.js';
import { getAssets } from './modules/assets/index.js';
import { Helmet } from './modules/helmet/index.js';
import { getLogger } from './modules/logging/index.js';
import { Nunjucks } from './modules/nunjucks/index.js';
import { PropertiesVolume } from './modules/properties-volume/index.js';
import { registerRoutes } from './routes/index.js';

export async function createApp(): Promise<Express> {
  const env = process.env.NODE_ENV ?? 'development';
  const developmentMode = env === 'development';
  const productionMode = env === 'production';

  const app = express();
  const logger = getLogger('app');

  app.locals.ENV = env;
  app.locals.shutdown = false;
  app.locals.assets = getAssets(productionMode);

  new PropertiesVolume().enableFor(app);
  new AppInsights().enable();
  new Nunjucks(developmentMode).enableFor(app);
  new Helmet(developmentMode).enableFor(app);

  if (developmentMode) {
    await setupDev(app);
  }

  const govukPackage = fileURLToPath(import.meta.resolve('govuk-frontend/package.json'));
  const govukAssets = join(dirname(govukPackage), 'dist', 'govuk', 'assets');

  app.use('/assets/fonts', express.static(join(govukAssets, 'fonts')));
  app.use('/assets/images', express.static(join(govukAssets, 'images')));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });

  app.get('/favicon.ico', limiter, (_req, res) => {
    res.sendFile(join(govukAssets, 'images', 'favicon.ico'));
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(join(import.meta.dirname, 'public')));

  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
    next();
  });

  registerRoutes(app);

  app.use((_req, res) => {
    res.status(404).render('not-found');
  });

  app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.stack || err}`);

    res.locals.message = err.message;
    res.locals.error = developmentMode ? err : {};
    res.status(err.statusCode || 500).render('error');
  });

  return app;
}
