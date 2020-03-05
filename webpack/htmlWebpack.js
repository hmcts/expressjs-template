const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const cssPath = path.resolve(__dirname, '../src/main/views/webpack/css.njk');
const jsPath= path.resolve(__dirname, '../src/main/views/webpack/js.njk');


const cssWebPackPlugin = new HtmlWebpackPlugin({
  template:  cssPath,
  filename: cssPath,
  inject: false,
});

const jsWebPackPlugin = new HtmlWebpackPlugin({
  template: jsPath,
  filename: jsPath,
  inject: false,
});

module.exports = {
  plugins: [cssWebPackPlugin,jsWebPackPlugin],
};
