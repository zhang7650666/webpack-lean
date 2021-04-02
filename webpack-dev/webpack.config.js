const path = require('path')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    // module: {
    //     // rules: [
    //     //     {
    //     //         test: /\.js$/,
    //     //         use: [
    //     //             {
    //     //                 loader: 'babel-loader',
    //     //                 plugins: [

    //     //                 ]
    //     //             }
    //     //         ]
    //     //     }
    //     // ]
    // }
}