const path = require('path');
var nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const govukFrontEndPath = path.join(__dirname, 'node_modules/govuk-frontend/govuk')
const govukImagePath = path.resolve(govukFrontEndPath, 'assets/images')
const govukFontsPath = path.resolve(govukFrontEndPath, 'assets/fonts')
const govukscssPath = path.resolve(govukFrontEndPath, 'all.scss')

const miniCssExtractPlugin = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css',
})
const copyGovukTemplateAssets = new CopyWebpackPlugin([
    { from: govukImagePath, to: 'img' },
    { from: govukFontsPath, to: 'fonts' }
]);
module.exports = {
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    //target: 'node',
    externals: [nodeExternals()],
    entry: path.join(__dirname, 'src/main/modules/govukfrontend/', 'index.ts'),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: '[name].js.map'
    },
    plugins: [
        copyGovukTemplateAssets,
        miniCssExtractPlugin
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [// fallback to style-loader in development
                    process.env.NODE_ENV !== 'production'
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [govukscssPath],
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [govukscssPath],
                            },
                        }
                    }],
                include: [
                    govukscssPath,
                ]
            }
        ]
    },

};
