const express = require('express');
const app = express();

// 如果是自己写的服务可以将webpack-dev-server起在同一个服务下
const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js')
const compile = webpack(webpackConfig);
app.use(middleware(compile))

app.get('/api/username', (req, res) => {
    res.json({
        name: 'Hadwin',
    })
})
app.listen(3000, () => {
    console.log('服务启动了')
})