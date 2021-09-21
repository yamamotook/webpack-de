# css-loader
关于css-loader: 将css文件转换为字符串；如果在css中发现了`url`或者`@import`那么将会使用require引入这些依赖。
```css
.red{
    color : red;
    background-image : url('./img/xxx.png');
}
```

经过css-loader的转换，可能会变成

```js
const img = require('./img/xxx.png');
export default `
.red{
    color : red;
    background-image : url(${img});
}
`
```
**坑1**:
对于`url`中的内容，css-loader默认会使用`require`来引入.[查看url的导出文档](https://www.npmjs.com/package/css-loader#url)
url通常为图片或者字体，在webpack 5以下(webpack4)中， 通常需要通过file-loader或者url-loader来处理。而url-loader和file-loader处理完毕之后会默认以`ESmodule`的形式导出,而css-loader又是通过`CommonJS`导入，所以会造成最终打包的css中url变成:` background-image: url("http://127.0.0.1:5500/dist/[object%20Module]");`.
解决办法:
* 设置url-loader的导出方式为`CommonJS`,对应的配置:
    ```js
    options : {
        esModule : false
    }
    ```
**坑2**:
由于webpack中引入了资源模块(assets module),当解析到一些图片或者字体,图标时,无需使用url-loader,file-loader等loader.[查看关于assets module的文档](https://webpack.docschina.org/guides/asset-modules/)
所以在webpack5中默认情况下,是不需要加入url-loader对图片资源进行处理.
如果使用了webpack5 并且同时配置了url-loader进行对图片的处理,那么会造成同一个资源被处理2次.最终图片并不能正常显示.

解决办法: 
* 不使用url-loader,默认使用assets module
* 继续使用url-loader, 不使用assets module.但是需要在图片资源的配置下配置: `type : "javascript/auto"`.
  具体配置:
    ```js
    {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        type: "javascript/auto",
      },
    ```

**坑3**:
在css-loader 6.0之后,如果开启了ESModule,url的创建将会使用`URL()构造函数`.URL构造函数必须接受一个path地址或者一个base64编码.如果关闭了ESModule, 那么url的创建将会使用css-loader的内置方法`getUrl`.getUrl方法是可以处理通过CommonJS导入的模块的.
所以处理url-loader导出 和 css-loader导入 规则不统一的办法有2种.
* 第一种: 使用坑1的配置.即让url-loader通过commonJS导出, css-loader默认会通过commonJS导入.
* 第二种: url-loader还是使用ESModule导出. css-loader通过commonJS导入.导入的模块是一个对象,会包含一个default属性,default属性是url-loader导出的值.但是在创建url的之后不要使用`URL构造函数`, 而使用`getUrl方法`.

第一种方法的配置
```js
{
    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    loader: "url-loader",
    options : {
        esModule : false
    }
}
```
第二种方法的配置
```js
{
    test: /\.css$/,
    use : [{
        loader : 'css-loader',
        options : {
            esModule : false
        }     
    }]
}
```


## CSS-Module
使用css-loader 可以轻松启用CSS Module.默认情况下, css-loader会自动匹配`xxx.module.css`这样的文件名,并启用CSS-Module.
也可以使用配置Module: true来启用全局的CSS Module.
css-loader 会根据文件路劲和类名生成一个hash值.并且会返回一个对象
这个对象映射转换前和转换后的类名.

关于local class的命名规则,推荐使用小驼峰,但不是必须的.

如果在css module中 有一些样式是公共的,不希望被转换, 可以加上语法:
`:global`.这样css-loader 会将这些样式原样输出.


```css
/* 原样输出 */
:global(.red){
    color : red;
}
/* 或者 */
:global .red{
    color : red;
}
```


## 使用scss
* 安装:
    在webpack中使用scss, 需要安装`sass编译器`和`sass-loader`.
    * sass编译器在node环境下有`node-sass`和`dart-sass`.推荐使用`dart-sass`,`node-sass`安装有很多坑, 经常会安装失败.不仅如此Apple Silicon 并不兼容node-sass.
  
```
    yarn add --dev sass sass-loader
```

* 使用:
    scss-loader是处理scss文件的第一步, scss-loader可以将scss代码编译成为css代码,后续处理就可以交给css-loader来处理了.
```js
    {
        test : /\.s[ac]ss$/,
        use : ['style-loader', 'css-loader', 'scss-loader']
    }
```

## 使用postcss
postcss 是一个css代码转换的工具.可以简单的理解为:CSS版本的Babel.
postcss 的工作方式和webpack类似.他本身只会将css代码分析成AST, 很多强大的功能是依赖于`plugin`.比如自动加入厂商前缀, 使用未来的css语法...等等都是需要插件来支持的.
使用postcss 你需要编写一个配置文件:`postcss.config.js`.
postcss 本身和scss/less 这一些预处理语言并不冲突.

* 在webpack中使用postcss
    安装`postcss` 和 `postcss-loader`.
    处理的顺序(如果安装了scss) scss-loader => postcss-loader => css-loader => style-loader

# style-loader

因为css-loader只会将css文件转换为一个包含了这个css文件的js文件.
其实就是将css文件转换为了js中的字符串.

style-loader将css-loader的结果转换为styleDOM标签,插入到head中.

# mini-css-extract-plugin

style-loader 只会将css代码通过style标签插入到head中.
有的时候我们希望引入的css能够生成css文件,就可以使用`mini-css-extract-plugin`;
`mini-css-extract-plugin`提供了一个loader和一个plugin需要同时使用, 因为loader并不具备生成文件的能力,但是loader需要知道要生成的css内容
所以css-loader处理之后需要交给`mini-css-extract-plugin`的loader处理.

* mini-css-extract-plugin的loader可以通过引入的类的静态方法获取的到:```MiniCssExtractPlugin.loader```
* `mini-css-extract-plugin`生成文件的方式和webpack打包相似, 一个chunk会对应生成一个css文件.
* `mini-css-extract-plugin`并不会将打包出来的文件自动引入html模板中, 需要通过`html-webpack-plugin`来引入.
