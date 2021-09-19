const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    myChunk: "./src/index.js",
    a: "./src/a.js",
  },
  output: {
    path: resolve(__dirname, "./target"), //绝对路劲,
    filename: "script/[name]-[chunkhash:5].js",
    //在打包结果中暴露一个全局变量myApp
    library: "myApp",
    //全局变量暴露到那里? 默认是var ,可以是window ,也可以是global(for nodejs环境)
    libraryTarget: "var",
  },
  // 最终打包的结果运行的环境(默认是web)
  target: "web",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["./loaders/my-style-loader"],
      },
      {
        test: /\.(png)|(jpg)|(gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 如果超过10k ，交给file-loader处理,同时会将所有的query parameter 传递给file-loader
              limit: 1 * 1000,
              //如果超过了limit，file-loader生成文件名的规则
              name: "img/[name]-[hash].[ext]",
            },
          },
        ],
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
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      //生成的html使用的模板
      template: "./public/index.html",
      //生成的文件名
      filename: "index.html",
      //那些chunk会被引用
      chunks: ["myChunk"],
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "a.html",
      chunks: ["a"],
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public/static",
          to: "./static",
        },
      ],
    }),
  ],
};
