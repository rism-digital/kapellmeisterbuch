const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = environment => ({
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.bundle.js',
        publicPath: '/'
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
        historyApiFallback: true,

        // here it is the local server configuration
        proxy: {
            '/api/**': {
                target: 'http://localhost:5000/',
                changeOrigin: true,
                secure: false,
            },
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        },
        open: true
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
                    'sass-loader' // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                loaders: ['file-loader']
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
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
            DEBUG: environment.dev, // if true it will show the query parameters into console

            // here it is the endpoint for Diva JS manifest server
            DIVA_BASE_MANIFEST_SERVER: JSON.stringify('https://iiif.rism.digital/manifest/ch/'),

            // here it is the endpoint for remote kapellmeisterbuch json based api server
            JSON_BASE_SERVER: environment.dev
                ? JSON.stringify('') // leave this empty: it would be managed by the dev server proxy (see above)
                : environment.production
                    ? JSON.stringify('http://kapellmeisterbuch-api.rism.digital')   // production endpoint
                    : JSON.stringify('https://rism-kb-search.altibo.club')          // staging endpoint
        })
    ]
});