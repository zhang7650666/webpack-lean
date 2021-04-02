const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'banner-loader/banner-loader',
                    options: {
                        text: '自定义的banner-loader',
                        filename: path.resolve(__dirname, './src/banner.js')
                    }
                }
                // use: ['loader1', 'loader2', 'loader3',]
            },
            {
                test: /\.(png|jpg)$/,
                use: {
                    loader: 'url-loader/url-loader',
                    options: {
                        limit: 1024 * 1024,
                    }
                }
            },
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: [
            //                 '@babel/preset-env'
            //             ]
            //         }
            //     }
            //     // use: ['loader1', 'loader2', 'loader3',]
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
}