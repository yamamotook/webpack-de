# Babel
`Babel`是一个可以转换JS语法的编译器.
`Babel`的核心库是@babel/core;
可以通过Babel提供的包:@babel/cli 使用命令来使用Babel， 也可以和webpack联用（使用babel-loader）
`Bable的`的工作方式和`Postcss`非常相似, `Babel`本身不会对JS代码进行任何处理,
而是将JS代码的转换交给`presets`和`plugins`.
`presets`和`plugins`可以通过文件:`babel.config.js`来配置.

```js
module.exports = {
    presets : [],
    plugins : []
}
```


## presets
presets:预设.`babel`所有的js代码转换能力全部来自plugin的处理.而每个plugin都只是处理js代码中的很小一个部分.例如:`将箭头函数转换为普通函数`的功能就是依靠插件`@babel/plugin-transform-arrow-functions`来转换的.
所以我们可以平时常用的插件项都集中到一个预设中,这样就不用去繁琐的去添加插件和插件的配置了.

一个非常常用的preset是: `@babel/preset-env`
除此之外可以根据不用的框架来选择不同的preset.
例如在Vue-CLI中就集成了`@vue/cli-plugin-babel/preset`.

### @babel/preset-env
如果需要对preset进行详细的配置:
```js
    const presets = [["@babel/preset-env", {
        //对@babel/preset-env的配置
        //在转换之后的代码中添加polyfill.
        //添加polyfill 需要core-js支持.
        //https://developer.mozilla.org/ja/docs/Glossary/Polyfill
        //usage 为按需加载： 只会加载使用到了的polyfill
        //entry 会引入整个core-js
        useBuiltIns : 'usage',
        //loose为false时， babel会额外加入一些代码来校验变量值。
        loose: false,
    }]];

```

## plugin
插件：用于转换js代码。
[插件地址](https://www.babeljs.cn/docs/plugins-list)


# 与webpack的联用
直接配一个`babel-loader`即可，当然你还得安装`@babel/core`

