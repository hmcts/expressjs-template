const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/');
const govukFrontend = require(path.resolve(__dirname, 'webpack/govukFrontend'));
const scss = require(path.resolve(__dirname,'webpack/scss'));
const HtmlWebpack = require(path.resolve(__dirname,'webpack/htmlWebpack'));

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins, ...HtmlWebpack.plugins ],
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
