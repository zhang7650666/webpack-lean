const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'production',
    entry: {
        home: './src/home/index.js',
        other: './src/other/index.js'
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html',
                filename: 'home.html',
                chunks: ['home']
            }
        ),
        new HtmlWebpackPlugin(
            {
                template: './src/index.html',
                filename: 'other.html',
                minify: {
                    removeAttributeQuotes: true, // 去除模板双引号
                    removeComments: true, // 去除注释
                    collapseWhitespace: true, // 去除空格和换行符
                    minifyCSS: true, // 压缩模板中的样式
                    minifyJS: true, // 压缩模板中js
                    // removeEmptyElements: true, // 清楚内容为空的标签 (慎用：例如div标签没有内容，设定了一席样式信息，也会被移除)
    
                },
                chunks: ['other']
            }
        )
        
    ]
    
}