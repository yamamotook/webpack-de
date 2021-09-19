const { resolve } = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    myChunk: "./src/index.js",
  },
  output: {
    path: resolve(__dirname, "./target"), //绝对路劲,
    // filename: "[name]-[hash:5].js",
    filename: "bundle.js",
    //在打包结果中暴露一个全局变量myApp
    library: "myApp",
    //全局变量暴露到那里? 默认是var ,可以是window ,也可以是global(for nodejs环境)
    libraryTarget: "var",
    publicPath: "/",
  },
  // 最终打包的结果运行的环境(默认是web)
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "./loaders/loader1.js",
            options: {
              test: true,
            },
          },
          {
            loader: "./loaders/loader2.js",
            options: {
              test: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["./loaders/my-style-loader"],
      },
      {
        test: /\.(png)|(jpg)$/,
        use: ["./loaders/img-loader.js"],
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    //当import文件时, 如果文件省略了后缀, 那么webpack会以以下扩展名寻找依赖
    extensions: [".js", ".json", ".vue"],
  },
  //扩展, 打包过程中某些依赖可能已经通过cdn安装, 或者在引用的环境中已经安装了该库.那么在打包过程中将不会将这个依赖打包进结果...
  externals: {
    jquery: "$",
  },
};
