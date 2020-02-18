const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          compress: {
            ie8: true,
          },
          mangle: {
            ie8: true
          },
          output: {
            comments: false,
            ie8: true
          }
        }
      })
    ]
  },
  entry: './src/main/assets/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map'
  }
};

module.exports = config;
