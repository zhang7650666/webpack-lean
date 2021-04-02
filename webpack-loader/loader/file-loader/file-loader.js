const loaderUtils = require('loader-utils')
const loader = function(source) {
    // file-loader 需要返回一个路径
    const filePath = loaderUtils.interpolateName(this, '[hash:8].[ext]', {content: source})
    this.emitFile(filePath, source);
    return `module.exports="${filePath}"`
}
loader.raw = true; // 将内容转成二进制
module.exports = loader