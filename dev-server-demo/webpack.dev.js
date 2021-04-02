const {smart} = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');

module.exports = smart(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            // DEV: "'dev'", // 如果只加一个单引号的话 相当于console.log(dev) 这样就会报dev未定义， 在外面要加一下双引号
            DEV: JSON.stringify('dev'), // 我们一般这样写
            BOOl: 'true', // 如果是boolean值可以直接这样写
            EXPRESSION: '1+1', // 如果是这样的话就会是2   如果JSON.stringify 就会是‘1+1’的表达式
        }),
        new webpack.NamedModulesPlugin(), // 打印更新的模块路径
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
    ],
    devServer: {
        hot: true, // 开启热更新
        port: 3000,
        progress: true,
        contentBase: './dist',
        // 如果我们只想mock一些数据可以使用before钩子, devServer 内部就是express
        before(app) {
            app.get('/api/username', (req, res) => {
                res.json({
                    msg: '这是mock的数据'
                })
            })
        },

        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3001',
        //         pathRewrite: {
        //             // '/api': ''
        //         }
        //     }
        // }
    },
})