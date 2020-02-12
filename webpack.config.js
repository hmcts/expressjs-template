const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    context: path.resolve(__dirname, 'src/main'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    target: 'node',
    externals: [nodeExternals()],
    entry: path.join(__dirname,'src/main', '/app.ts'),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
   
};