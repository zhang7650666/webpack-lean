const OptimizeCss = require('optimize-css-assets-webpack-plugin'); // 优化项
const UglifyjsPlugin = require('uglifyjs-webpack-plugin') // js压缩
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const {smart} = require('webpack-merge');
const baseConfig = require('./webpack.base');
module.exports = smart(baseConfig, {
    mode: 'production',
    // devtool: 'cheap-module-source-map', // 不会产生列，但是他是一个单独的文件
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            hash: true,
            // inject: 'head',
            minify: {
                removeAttributeQuotes: true, // 去除模板双引号
                removeComments: true, // 去除注释
                collapseWhitespace: true, // 去除空格和换行符
                minifyCSS: true, // 压缩模板中的样式
                minifyJS: true, // 压缩模板中js
                // removeEmptyElements: true, // 清楚内容为空的标签 (慎用：例如div标签没有内容，设定了一席样式信息，也会被移除)

            }
        }),
        
        new webpack.DefinePlugin({
            // DEV: "'dev'", // 如果只加一个单引号的话 相当于console.log(dev) 这样就会报dev未定义， 在外面要加一下双引号
            DEV: JSON.stringify('pro'), // 我们一般这样写
            BOOl: 'true', // 如果是boolean值可以直接这样写
            EXPRESSION: '1+1', // 如果是这样的话就会是2   如果JSON.stringify 就会是‘1+1’的表达式
        })
    ],
    // 优化项
    optimization: {
        minimizer: [
            new UglifyjsPlugin({
                cache: true, // 是否使用缓存
                parallel: true, // 使用多进程并行运行提高构建速度
                sourceMap: true, // 将错误信息映射到模块上
            }),
            new OptimizeCss(), // css 压缩 （注意：如果加了这个配置项之后，只会压缩css，如果要压缩js 需要用UglifyjsPlugin插件）
        ],
        splitChunks: { // 抽离公用代码块，只有多入口的时候适用，单入口没有必要
            cacheGroups: { // 缓存组
                common: { // 公共的代码块
                    chunks: 'initial', // 从哪里开始   默认是从入口文件
                    minSize: 0, // 超多少个字节开始可以抽取
                    minChunks: 2, // 适用过多少次抽取
                },
                vendor: { // 第三方模块单独打包
                    test: /node_modules/,
                    priority: 1, // 正常代码的执行顺序是从上到下，所以一些第三方模块已经在common模块中打包过了，所以第三方模块就不会再进行打包了，如果要想把第三方模块单独打包，需要加一个priority的属性，来提高优先级
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 2,

                }

            }
        }
    },
    // watch: true, // 实时监听打包文件 只要有代码变化就进行打包
    // watchOptions: {
    //     poll: 1000, // 每秒问我1000次
    //     aggregateTimeout: 500, // 防抖 输入停止500毫秒后打包
    //     ignored: /node_modules/, // 不需要监控那个文件
    // },
})