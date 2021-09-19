# 配置文件
* 通常情况下webpack进行打包时会默认读取文件:`webpack.config.js`.也可以使用CLI命令`--config`来指定使用其他配置文件.
```
webpack --config xxx.js
```
* webpack的配置文件规则必须遵循nodejs环境.配置文件中通过CommonJS的方式导出一个对象作为webpack配置.
  
# 基本配置
1. `mode` 表示打包的环境,合法的值有`development`和`production`.如果CLI命令行中也指定了`--mode`,那么CLI命令行的优先级会高于配置文件中的`mode`配置.
2. `entry` 字符串或者对象 ,webpack分析依赖时的入口文件路径.默认值为`src/index.js`.
    entry的配置，其实配置的是每一个chunk的入口。
    entry的规则为：一个对象， 对象的`key`为`chunk`的名字。`value`为入口模块的路径（可以使用相对路劲）。
    因为默认的chunk name为main，所以默认的entry配置为：
    ```js
        entry : {
            main : './src/index.js'
        }
    ```
    也可以简写为：
    ```js
        entry : './src/index.js'
    ```
    entry下面可以有多个chunk。每个chunk下面也支持多个入口。
    ```js
        entry : {
            chunk1 : './src/chunk1.js',
            chunk2 : ['./src/chunk1', './src/chunk2.js'] //将这2个文件作为入口，进行依赖分析来生成该chunk.
        }
    ```
3. `output` 对象, 表示打包结果输出的目录.
   ```js
   const path = require('path');
    output : {
        path : path.resolve(__dirname, 'target'),//必须配置一个绝对路劲，表示资源生成的根路径。（绝对路径可以使用nodejs中的path模块的resolve配合__dirname生成）
        filename : [name][hash:5].js//打包之后生成的bundle的文件名。这个文件名可以是通过规则动态生成，文件名中也可以包含路劲.
    }
   ```
    关于filename的一些规则：
   1. name代表该chunk的name。
   2. id代表该chunk的id。（开发环境下id为chunk的name， 生产环境下id为一个数字从0开始）.
   3. hash代表: 总的资源hash。（hash通常用来解决浏览器缓存问题）
   4. chunkhash: 每一个chunk的hash。

# source map
source map 和webpack 无关。
在开发过程中，代码通常会使用webpack进行打包合并。当运行打包合并之后的代码出错时，错误信息会非常难以阅读和调试。
source map 就是为了解决这一问题而生。source map会生成一个单独的文件来关联源码和打包之后的代码。
打包之后的代码可以通过一个特殊的注释`//# sourceMappingURL=xxx.map`来加载source map文件。
除了source map 。使用`eval`也是一种能够映射打包后代码位置的一种手段。

webpack中可以通过`devtool` 来配置优化配置。
[](https://webpack.docschina.org/configuration/devtool/)


# chunk的解析过程
1. 找到入口文件或者有require的文件依赖.
2. 查看该文件是否已经被解析过了.如果解析过了直接跳过.
3. 如果没有解析过,那么使用fs读取文件的内容,生成文件内容的字符串.
4. 如果配置文件中有配置loader,并且该文件的路劲满足规则.那么将文件的内容字符串传递给loader处理.
5. loader返回的字符串作为处理结果,根据这个结果生成AST(抽象语法树).默认情况下webpack只能将js代码转换为AST.如果是其他格式的文件如:css , png之类的文件,需要经过loader处理后webpack才能够生成AST.
6. 生成AST之后分析该文件中的其他依赖,并记录下这些依赖.
7. 将文件中的require关键字替换为__webpack_require.
8. 将该文件的id(唯一路劲)和转换之后的内容缓存起来.
9. 回到第一步根据记录下来的缓存递归.

# loader
loader本质上是一个函数,webpack会再读取了文件内容之后,将文件内容作为字符串传递给匹配到规则的loader函数处理;
loader函数处理结束之后也会返回一个字符串.如果配置了多个loader,会继续将这个字符串传递给下一个loader接力.直到没有loader之后就会生成AST.

loader处理函数的格式
```js
//my-loader.js
module.exports = function(sourceCode){
    //webpack 会将文件字符串作为函数参数传递进来.
    //在this中可以获取该loader的一些配置参数, 也可以使用第三方库loader-utils获得loader的options
    //...处理源代码
    return sourceCode;
}
```

loader的配置完整格式:
```js
// webpack.config.js
// 以下配置规则就意味着 : “嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.js' 的路径」时，在你对它打包之前，先使用 loader1 转换一下。”
module.exports = {
    //模块的配置
    module : {
        //配置规则,如果满足下面的规则,则会使用对应的loader.规则可以有多个.
        rules : [
            //其中一个规则
            {
                //能够匹配上的文件路径
                test : /\.js$/,
                //当匹配到之后要使用的loader
                use : [
                    {   
                        //loader的位置
                        loader : './loaders/loader1.js',
                        //loader的配置options ;在loader处理函数中可以获取到该options
                        options : {
                            test : true
                        }
                    }
                ]
            }
        ]
    }
}
```

当loader没有options可以简写为:
```js
// webpack.config.js
module.exports = {
    module : {
        rules : [
            {
                test : /\.js$/,
                use : './loaders/loader1.js'
            },
            {
                test : /index\.js$/,
                use : ['./loaders/loader1.js', './loaders/loader2.js']
            }
        ]
    }
}
```
**loader的运行顺序是倒序的**
```js
    //其中一个rule
    {
        test : /\.js$/,
        use : ['/loaders/loader1.js', './loaders/loader2.js']
    }
    //运行顺序是先运行loader2 再将结果交给loader1处理.
```


# plugin
loader 用于将webpack无法分析的代码转换为可以识别的代码.而plugin的目的是用于解决loader无法解决的事.
通过plugin可以注册许多事件,在webpack 编译过程中会触发这些事件,从而影响打包结果.
plugin本质上是一个带有`apply`方法的对象.这个方法会被`webpack compiler`调用,并传入一个compliler对象.
`compiler`对象在整个打包过程中产生于初始化阶段,并且只会产生一个实例,后续完成打包工作的是comipiler对象内部创建的`compilation`.

通常plugin会写成类的形式
```js
    class MyPlugin{
        apply(compiler){

        }
    }
```

`compiler`中提供了大量的钩子函数
```js
apply(compiler){
    compiler.hooks.事件名称.事件类型(name , function(compilation, ...){
        //事件处理函数
        //根据不同的事件类型, 事件处理函数的结束方式也不一样.
    })
}
```

事件名称:
[https://www.webpackjs.com/api/compiler-hooks/](https://www.webpackjs.com/api/compiler-hooks/)

事件类型:
webpack使用了Tapable API第三方库, 这个库提供了一个事件类型:

* tap : 处理同步事件.
* tapAsync : 通过回调函数的调用表示事件处理函数的结束.
* tapPromise : 通过Promise的resolve表示事件处理函数的结束.

plugin在webpack中的配置
```js
    const MyPlugin = reuiqre('My-Plugin');
    module.exports = {
        plugins : [new MyPlugin()]
     }
```


# 其他配置

* context : 上下文,控制打包入口和loaders的加载路劲的.  [文档](https://www.webpackjs.com/configuration/entry-context/)
* output 输出相关
    * libray 打包结果的入口文件会暴露一个变量,指定变量名.[文档](https://www.webpackjs.com/configuration/output/#output-library)
    * librayTarget 暴露的方式
    * publiPath 一个字符串。一些loader 和 plugin 在处理资源时会拼接这个字符串。比如一个静态图在某些html文件中使用，如果不规定publiPath，那么这些静态资源可能将以相对位置加载，照成404.默认情况下一般配置为`/`,根据项目部署的路劲不同来定。
* target 打包的输出结果
* resolve  解析相关
    * modules 当解析到不指定路劲的引用时,去哪里找依赖
    * extensions 当模块没有指定后缀时, 默认使用那些后缀
    * alias 路劲的别名
* externals 扩展, 比如有些库通过cdn引用了,打包结果中不需要将这个库打包进入的处理

有问题看文档[webpack中文文档](https://www.webpackjs.com/configuration/)

  