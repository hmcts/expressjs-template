import webpackDev = require('webpack-dev-middleware');
import webpack = require('webpack');
const webpackconfig = require('../../webpack.config');
import * as express from 'express';

const setupDev = (app: express.Express): void => {
  const compiler = webpack(webpackconfig);
  app.use(webpackDev(compiler, { publicPath: 'src/main/public/' }));
};

module.exports = { setupDev };
