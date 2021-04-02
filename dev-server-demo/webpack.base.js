const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //  清除打包后的文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Happypack = require('happypack'); // 多线程打包 适合大项目
const webpack = require('webpack')


module.exports = {
    entry: {
        index: './src/pub_code_extract/index.js',
        other: './src/pub_code_extract/other.js'
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: 'http://www.baidu.com', // 在引用资源的时候，会统一给资源加上自定的路径
    },
    module: {
        noParse: /jquery/, // 不对此模块进行解析（提高打包的速度）
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
                use: 'Happypack/loader?id=js',
                
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
        new Happypack({
            id: 'js',
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
                            "@babel/plugin-syntax-dynamic-import}", // 语法动态导入插件
                        ]
                    }
                }
            ]
        })
    ],
    // externals: { // 这些模块不进行打包（例如我们使用CDN引入了jquery，如果我们使用了eslint在模块中直接使用$会报$未定义，所以我们需要通过依赖包的形式引入jquery 然后在不报jquery模块打包进去
    //     jquery: '$'
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

/**
 * 1、webpack自带优化功能
 *      a) import 在生成环境下，会自动去除无用代码（tree-shaking 把没有用的代码自动删除)
 *      b)通过require引进来的模块es6 会把结果放在default上
 */