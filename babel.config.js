module.exports = (api) => {
  console.log("当前环境: ", api.env());
  if (api.env() === "development") {
    return {
      presets: [
        [
          "@babel/preset-env",
          {
            //在转换之后的代码中添加polyfill.
            //添加polyfill 需要core-js支持.
            //usage 为按需加载： 只会加载使用到了的polyfill
            //entry 会引入整个core-js
            useBuiltIns: "entry",
            loose: true,
            corejs: "3",
          },
        ],
      ],
      plugins: ["@babel/plugin-proposal-do-expressions"],
    };
  } else {
    return {};
  }
};
