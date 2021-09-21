new Promise((r) => {
  r(1);
}).then((resp) => console.log(resp));

const abc = 123;

const func = () => {
  console.log("dd");
};

class A {
  constructor(a) {
    this.a = a;
  }
}

Array.of(1, 2, 3);

let x = 100;
let y = 20;

let a = do {
  if (x > 10) {
    if (y > 20) {
      ("big x, big y");
    } else {
      ("big x, small y");
    }
  } else {
    if (y > 10) {
      ("small x, big y");
    } else {
      ("small x, small y");
    }
  }
};

const color = "red";
let aa = do {
  if (color === "red") {
    ("red");
  } else if (color === "blue") {
    ("blue");
  }
};

console.log(a);
console.log(aa);
