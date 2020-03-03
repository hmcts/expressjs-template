const webpackDev = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackconfig = require('../../webpack.config');


const setupDev = (app) => {

  const compiler = webpack(webpackconfig)
  app.use(webpackDev(compiler, {}));
};

module.exports = { setupDev };

