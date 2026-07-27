const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackViewsPath = path.resolve(__dirname, '../src/main/views/webpack');

const cssWebPackPlugin = new HtmlWebpackPlugin({
  template: path.join(webpackViewsPath, 'css-template.njk'),
  publicPath: '/',
  filename: path.join(webpackViewsPath, 'css.njk'),
  inject: false,
});

const jsWebPackPlugin = new HtmlWebpackPlugin({
  template: path.join(webpackViewsPath, 'js-template.njk'),
  publicPath: '/',
  filename: path.join(webpackViewsPath, 'js.njk'),
  inject: false,
});

module.exports = {
  plugins: [cssWebPackPlugin, jsWebPackPlugin],
};
