const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/');

const govukFrontend = require(path.resolve(sourcePath, 'webpack/govukFrontend'));
const scss = require(path.resolve(sourcePath,'webpack/scss'));
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins,new HtmlWebpackPlugin({
                                                          template: 'src/main/views/template.njk',
                                                          filename: '../views/template.njk',
                                                          inject: false
                                                        }) ],
  entry: path.resolve(sourcePath, 'index.js') ,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [...scss.rules],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    filename: 'main.[contenthash].js',
  },
};
