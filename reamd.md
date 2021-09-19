# clean-webpack-plugin
打包之前先清空dist目录

# html-webpack-plugin
自动生成一个html，包含了引用打包之后的js文件

# copy-webpack-plugin
将一些静态资源复制到打包文件夹中

# devServer
webpack 官方出品， 它既不是plugin 也不是 loader.

 # file-loader
将依赖的模块直接输出的打包结果中， 并且使用默认使用`export default`导出打包输出文件的路径（通过配置`esModule`可以修改导出方式）。
 # url-loader
将依赖的模块转换为base64格式，并通过默认`export default`导出。可以通过options配置`limit`当超过这个limit时，会自动交给file-loader处理。
