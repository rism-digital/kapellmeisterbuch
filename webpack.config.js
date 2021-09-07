const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// If you want to use a local server set the useRemoteServer const to false,
// in that case the system will use the devServer proxy configuration belove, 
// so please be sure you have onstage-backend installed and running (see https://github.com/rism-ch/onstage-backend) 
// and the solr-adaptor/server.js is running as well in your local machine in order to let it work.
const useRemoteServer = false;

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
        contentBase: path.join(__dirname, 'src'),
        historyApiFallback: true,

        // here it is the local server configuration
        proxy: {
            '/api/**': {
                target: 'http://localhost:5000/api/',
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
            DEBUG: !environment.production, // if true it will show the query parameters into console

            // here it is the endpoint for Diva JS manifest server
            DIVA_BASE_MANIFEST_SERVER: JSON.stringify('https://iiif.rism.digital/manifest/ch/'),

            // here it is the endpoint for remote onstage search server 
            // used only if useRemoteServer is setted as true, as explained above
            SOLR_BASE_SERVER: environment.production || useRemoteServer
                ? JSON.stringify('http://onstage-search.rism-ch.org')
                : JSON.stringify(''),

            // here it is the endpoint for remote kapellmeisterbuch json based api server
            JSON_BASE_SERVER: environment.production || useRemoteServer
                ? JSON.stringify('http://kapellmeisterbuch-api.rism.digital')   // production endpoint
                : JSON.stringify('https://rism-kb-search.altibo.club')          // staging endpoint
        })
    ]
});