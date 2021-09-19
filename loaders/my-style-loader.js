module.exports = function (sourceCode) {
  return `
    const styleDOM = document.createElement("style");
    styleDOM.innerHTML = \`${sourceCode}\`;
    document.head.appendChild(styleDOM);
    // 还可以输出这一段sourceCode
    module.exports = \`${sourceCode}\`
  `;
};
