/* eslint-disable @typescript-eslint/no-require-imports -- development-only modules must be loaded lazily */
import * as express from 'express';

const setupDev = (app: express.Express, developmentMode: boolean): void => {
  if (developmentMode) {
    const webpackDev = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackconfig = require('../../webpack.config');
    const compiler = webpack(webpackconfig);
    app.use(
      webpackDev(compiler, {
        publicPath: '/',
      })
    );
  }
};

export { setupDev };
