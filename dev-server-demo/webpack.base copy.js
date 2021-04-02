const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css插件
const OptimizeCss = require('optimize-css-assets-webpack-plugin'); // 优化项
const UglifyjsPlugin = require('uglifyjs-webpack-plugin') // js压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //  清除打包后的文件
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devServer: {
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
    // devtool: 'source-map', // 源码映射，会产生一个source-map文件，报错了，会显示具体的行和列，大而全
    // devtool: 'eval-source-map', // 不会产生一个映射文件，报错了，也可以显示具体的行和列
    // devtool: 'cheap-module-source-map', // 不会产生列，但是他是一个单独的文件
    devtool: 'cheap-module-eval-source-map', // 集成在打包后的文件中，不会产生单独的soure-map映射文件， 但是可以产生列的报错信息
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: 'http://www.baidu.com', // 在引用资源的时候，会统一给资源加上自定的路径
    },
    module: {
        rules: [ // loader 的加载顺序是从右到左，从下到上
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'eslint-loader',
            //         options: {
            //             enforce: 'pre', // 强制将eslint的loader提前校验
            //         }
            //     }
            // },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }], // 装饰器
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }], // 处理js中class的插件
                                "@babel/plugin-transform-runtime", // 提取_classCallCheck 兼容高级语法  例如genrator函数
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader, // 将css文件创建一个link标签插入到html中
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/,
                use: {
                    // loader: 'file-loader', // 默认会在内部生成一张图片，放到dist目录下面
                    loader: 'url-loader',
                    options: {
                        limit:1012 * 1024, // 限制图片大小（小于限制将装成base64）
                        outputPath: '/img/', // 将打包后的文件输出到指定的路径,
                        // publicPath: 'https://www.cdn.com', // 只给图片资源加上公用路径
                    }
                }
            },
            {
                test: /\.html$/i,
                loader: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
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
        new MiniCssExtractPlugin({
            filename: '/css/main.css', // css 打包压缩后放到指定路径下和自定义文件名
        }),
        new webpack.ProvidePlugin({ // 在每个模块中注入$
            $: 'jquery'
        }),
        new CopyWebpackPlugin([
            { // 拷贝文件插件
                from: './src/doc', to: './'
            }
        ]),
        new webpack.BannerPlugin('2021-03-16 by Hadwin'),
        new webpack.DefinePlugin({
            // DEV: "'dev'", // 如果只加一个单引号的话 相当于console.log(dev) 这样就会报dev未定义， 在外面要加一下双引号
            DEV: JSON.stringify('dev'), // 我们一般这样写
            BOOl: 'true', // 如果是boolean值可以直接这样写
            EXPRESSION: '1+1', // 如果是这样的话就会是2   如果JSON.stringify 就会是‘1+1’的表达式
        })
    ],
    externals: { // 这些模块不进行打包（例如我们使用CDN引入了jquery，如果我们使用了eslint在模块中直接使用$会报$未定义，所以我们需要通过依赖包的形式引入jquery 然后在不报jquery模块打包进去
        jquery: '$'
    },
    // 优化项
    optimization: {
        minimizer: [
            new UglifyjsPlugin({
                cache: true, // 是否使用缓存
                parallel: true, // 使用多进程并行运行提高构建速度
                sourceMap: true, // 将错误信息映射到模块上
            }),
            new OptimizeCss(), // css 压缩 （注意：如果加了这个配置项之后，只会压缩css，如果要压缩js 需要用UglifyjsPlugin插件）
        ]
    },
    // watch: true, // 实时监听打包文件 只要有代码变化就进行打包
    // watchOptions: {
    //     poll: 1000, // 每秒问我1000次
    //     aggregateTimeout: 500, // 防抖 输入停止500毫秒后打包
    //     ignored: /node_modules/, // 不需要监控那个文件
    // },
    resolve:{
        // resolve 的作用是解析第三方模块，模块的查找顺序现在node_modules 查找，找不到在向上一层查找
        modules: [path.resolve('node_modules')], // 缩小查找模块的范围 只在node_modules中查找
        alias: { // 别名
            '@': './src'
        },
        extensions: ['.js', '.css', '.json'], // 扩展名
    }
}
