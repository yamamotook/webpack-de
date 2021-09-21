const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    main: "./src/index.js",
    a: "./src/a.js",
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "js/[name]-[chunkhash:5].js",
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.(css)|(postcss)|(pcss)$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              esModule: false,
              url: {
                filter: (url, resourcePath) => {
                  //如果是包含了static的路劲，那么不处理;交给copy-plugin处理
                  if (/static/.test(url)) {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: "url-loader",
        options: {
          limit: 1000 * 1000,
          // esModule: false,
        },
        // 在webpack5中 引入了资源模块来替代webpack4的 url-loader， file-loader等.
        //不使用资源模块，还是使用原来的loader
        // 如果不禁用，会导致重复生成资源导致冲突
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new HtmlPlugin({
      template: "./public/index.html",
      inject: "body",
      chunks: ["main"],
    }),
    new HtmlPlugin({
      template: "./public/a.html",
      filename: "a.html",
      inject: "body",
      chunks: ["a"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/static",
          to: "./static",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
    },
  },
};
