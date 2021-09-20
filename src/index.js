import style from "@/assets/style/index.css";
import style1 from "@/assets/style/style1.module.css";
import style2 from "@/assets/style/style2.module.css";

const image = require("@/assets/img/cssWorld.png");

function setStyle(selector, style) {
  if (document.querySelector(selector)) {
    document.querySelector(selector).className = style;
  }
}

console.log(image);

console.log(style1);
console.log(style2);

setStyle(".container1", style1.container);
setStyle(".left", style1.left);
setStyle(".right", style1.right);
setStyle(".container2", style2.container);
