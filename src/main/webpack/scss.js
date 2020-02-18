const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const miniCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].css',
  chunkFilename: '[id].css',
});

const scssRule = {
  test: /\.s[ac]ss$/i,
  use: [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    'css-loader',
    // Compiles Sass to CSS
    'sass-loader',
  ],
};

const miniCssOptions = {
  loader: MiniCssExtractPlugin.loader,
};

const miniCssRule = {
  test: /\.css$/i,
  use: [miniCssOptions, 'css-loader'],
};

module.exports = {
  rules: [scssRule, miniCssRule],
  plugins: [miniCss]
};

