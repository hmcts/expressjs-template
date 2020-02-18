const path = require('path');

const govukFrontend = require('./src/main/webpack/govukFrontend');
const scss = require('./src/main/webpack/scss');

module.exports = {
  plugins: [...govukFrontend.plugins, ...scss.plugins],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [...scss.rules]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  }
};
