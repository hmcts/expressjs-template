import type { Express } from 'express';

import health from './health.js';
import home from './home.js';
import info from './info.js';

export const registerRoutes = (app: Express): void => {
  health(app);
  home(app);
  info(app);
};
