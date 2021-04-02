// data:image/jpg;base64,
const loaderUtils = require('loader-utils')
const mime = require('mime')
const loader = function(source) {
    const {limit} = loaderUtils.getOptions(this);
    if(limit && limit > source.length) {
        return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    } else {
        return require('../file-loader/file-loader').call(this, source)
    }
}
loader.raw = true;
module.exports = loader