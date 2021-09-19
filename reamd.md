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

# style-loader

因为css-loader只会将css文件转换为一个包含了这个css文件的js文件.
其实就是将css文件转换为了js中的字符串.

style-loader将css-loader的结果转换为styleDOM标签,插入到head中.
