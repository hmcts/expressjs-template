const path = require('path');

const sourcePath = path.resolve(__dirname, 'src/main/');

const govukFrontend = require(path.resolve(sourcePath, 'webpack/govukFrontend'));
const scss = require(path.resolve(sourcePath,'webpack/scss'));

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins],
  entry: path.resolve(sourcePath, 'index.js') ,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [...scss.rules],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/public/'),
    filename: 'main.js',
  },
};
