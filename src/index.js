import style from "@/assets/index.css"; // 这个import 是给webpack看的,webpack看到import 或者require 就会去读取对应的文件.
import img from "@/assets/logo.png";
import vue from "@/test";
import $ from "jquery";
console.log($);
console.log(vue);
var a = 0;
console.log(style);
console.log(img);
const imgDom = document.createElement("img");
imgDom.src = img;
document.body.appendChild(imgDom);

export default "hhh";
