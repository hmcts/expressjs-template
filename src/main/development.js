const webpackDev = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackconfig = require(path.resolve(__dirname, '../../webpack.config'));


const setupDev = (app) => {
  const _webpack = app.get('webpack');

  const compiler = webpack(webpackconfig)
  app.use(webpackDev(compiler, {}));
};

module.exports = { setupDev };

