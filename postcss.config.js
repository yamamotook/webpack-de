const postcssPresetEnv = require("postcss-preset-env");
const gridkiss = require("postcss-grid-kiss");
module.exports = {
  plugins: [
    postcssPresetEnv({
      //stage : 可以使用第几阶段的语法,默认是第2阶段
      stage: 1,
    }),
    gridkiss(),
  ],
};
