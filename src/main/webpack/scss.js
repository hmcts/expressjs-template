const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const miniCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].css',
  chunkFilename: '[id].css',
});

const miniCssOptions = {
  loader: MiniCssExtractPlugin.loader,
};

const miniCssRule = {
  test: /\.css$/i,
  use: [miniCssOptions, 'css-loader'],
};

module.exports = {
  rules: [{
    test: /\.scss$/,
    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  }],
  plugins: [miniCss]
};

