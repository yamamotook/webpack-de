console.log("环境", process.env.NODE_ENV);

const HTMLPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: "./public/template.html",
    }),
  ],
};
