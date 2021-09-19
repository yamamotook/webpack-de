const utils = require("loader-utils");
function imgLoader(buffer) {
  console.log(buffer.byteLength);
  if (buffer.byteLength > 3000) {
    const filename = utils.interpolateName(this, "[contenthash:5].[ext]", {
      content: buffer,
    });
    this.emitFile(filename, buffer);
    return `module.exports = '${filename}'`;
    //将图片打包资源列表中
  } else {
    //将文件转换成base64
    return getBase64(buffer);
  }
}

function getBase64(buffer) {
  return `module.exports = 'data:image/png;base64,${buffer.toString(
    "base64"
  )}'`;
}
//通过static 属性raw 表示传入的sourceCode为原始格式
imgLoader.raw = true;

module.exports = imgLoader;
