const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageRoot = path.dirname(require.resolve('govuk-frontend/package.json'));
const assets = path.join(packageRoot, 'dist/govuk/assets');

const copyGovukAssets = new CopyWebpackPlugin({
  patterns: [
    {
      from: path.join(assets, 'images'),
      to: 'assets/images',
    },
    {
      from: path.join(assets, 'fonts'),
      to: 'assets/fonts',
    },
  ],
});

module.exports = {
  plugins: [copyGovukAssets],
};
