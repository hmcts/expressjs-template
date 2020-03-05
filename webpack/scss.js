const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const miniCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].[contenthash].css',
  chunkFilename: '[id].css',
});

module.exports = {
  rules: [
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
  ],
  plugins: [miniCss],
};
