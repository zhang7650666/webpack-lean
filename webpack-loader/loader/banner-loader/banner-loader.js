const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const fs = require('fs')
const loader = function(source) {
    const options = loaderUtils.getOptions(this);
    const cb = this.async();
    const schema = {
        type: 'object',
        properties: {
            text: {
                type: 'string',
            },
            filename: {
                type: 'string'
            }
        }
    }
    validateOptions(schema, options, 'banner-loader');
    if(options.filename) {
        this.addDependency(options.filename) // 自动添加文件依赖
        fs.readFile(options.filename, 'utf8', function(err, data) {
            cb(err, `/**${data}**/${source}` )
        })
    } else {
        cb(null,  `/**${options.text}**/${source}`)
    }

}

module.exports = loader