const babel = require('@babel/core');
const loaderUtils = require('loader-utils')
const loader = function(source) {
    const options = loaderUtils.getOptions(this);
    const cb = this.async();
    console.log('resoure', this.resourcePath)
    babel.transform(source, {
        ...options,
        sourceMap: true,
        filename: this.resourcePath.split('/').pop()
    }, function(err, result) {
        cb(err, result.code, result.map)
    })
}
module.exports = loader;