const path = require('path');
const fs = require('fs')

// babylon 主要是将源码转成ast
// @babel/traverse 遍历对应的节点
// @babel/types 替换遍历好的节点
// @babel/generator 生成替换好的结果

const babylon = require('babylon');
const types = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
class Compiler{
    constructor(config) {
        // webpack.config
        this.config = config;
        // 需要保存入口文件的路径
        this.entryId = '';
        // 需要保存所欲模块的依赖
        this.modules = {};
        // 入口路径
        this.entry = config.entry;
        // 工作路径
        this.root = process.cwd();
        
    }
    
    run() {
        // 创建模块依赖关系
        /**
         * @memberof buildModlue
         * this.root 表示当前工作路径  entry 入口   true  是否是主模块
         * 
         */
        this.buildModule(path.resolve(this.root, this.entry), true)
        // 派发一个文件 (打包后的文件);
        this.emitFile()
    }

    // 构建模块依赖关系函数
    buildModule(modulePath, isEntry) {
        const source = this.getReadFile(modulePath);
        console.log('source', source)
        // 模块的id（现在是相对路径）  modulePath= 绝对路径（modulePath） - 工作路径（this.root)
        const moduleName = './' + path.relative(this.root, modulePath); // ./src/index.js
        // 判断是否是主入口
        if(this.isEntry) {
            this.entryId = moduleName;
        }
        // 把源码进行改造返回一个依赖列表   path.dirname(moduleName) ./src
        const {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
        console.log('sourceCode', sourceCode, dependencies);
        // 把相对路径和模块中的路径对应起来
        this.modules[moduleName] = sourceCode;
        dependencies.forEach(dep => {
            this.buildModule(path.join(this.root, dep), false)
        })
    }
    // 解析源码
    parse(source, parentPath) {
        // 将源码转成AST
        const ast = babylon.parse(source);
        // 创建一个依赖收集的数组
        const dependencies = [];
        // 遍历ast节点
        traverse(ast, {
            // 调用表达式
            CallExpression(p) {
                // console.log('p', p)
                const node = p.node;
                if(node.callee.name == 'require') {
                    node.callee.name = "__webpack_require__";
                    let moduleName = node.arguments[0].value; // 获取模块的引用名称
                    moduleName = moduleName + (path.extname(moduleName)? '' : '.js'); // 如果模块的后缀名存在就是用模块默认的后缀名，如果不存在就是用'.js'
                    moduleName = './' + path.join(parentPath, moduleName);
                    dependencies.push(moduleName);
                    node.arguments = [types.stringLiteral(moduleName)];
                }
            }
        })
        console.log('ast', ast)
        const sourceCode = generator(ast);
        
        // return {
        //     sourceCode,
        //     dependencies
        // }
        return {
            sourceCode: 1,
            dependencies: 2
        }
    }

    // 派发打包后的文件
    emitFile() {

    }

    // 读取文件内容
    getReadFile(modulePath) {
        let content = fs.readFileSync(modulePath, 'utf8');
        // 拿到webpack.config.js中的匹配规则
        const rules = this.config.module.rules;
        // 遍历rules
        
        for(let i = 0; i < rules.length; i++) {
            const {test, use} = rules[i];
            let len = use.length - 1;
            if(test.test(modulePath)) {
                function normalLoader() {
                    const loader = require(use[len--])
                    content = loader(content)
                    if(len >= 0) {
                        normalLoader()
                    }
                }
                normalLoader()
            }
        }
        return content;
    }
}

module.exports = Compiler;
