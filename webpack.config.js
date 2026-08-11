const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (environment = {}) => ({
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.bundle.js',
        publicPath: '/',
        clean: true
    },
    mode: environment.production ? 'production' : 'development',
    devtool: environment.production ? false : 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'static')
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                // this is so that we can compile any React,
                // ES6 and above into normal ES5 syntax
                test: /\.(js|jsx)$/,
                // we do not want anything from node_modules to be compiled
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader', // translates CSS into CommonJS
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            api: 'modern-compiler'
                        }
                    }
                ]
            },
            {
                test: /\.md$/i,
                use: 'raw-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),
        new webpack.DefinePlugin({
            PRODUCTION: environment.production,
            DEBUG: environment.dev,
            DIVA_BASE_MANIFEST_SERVER: JSON.stringify('https://iiif.rism.digital/manifest/ch/')
        })
    ]
});
