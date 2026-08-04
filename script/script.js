///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
let canvas;
let game;
let keyTaste = new KeyboardObj();

function init() {
  canvas = document.getElementById("canvas");
  game = new Game(canvas, keyTaste);

  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
      keyTaste.left = true;
    }
    if (e.key == "ArrowRight") {
      keyTaste.right = true;
    }
    if (e.key == "ArrowUp") {
      keyTaste.up = true;
    }
    if (e.key == " ") {
      keyTaste.space = true;
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") {
      keyTaste.left = false;
    }
    if (e.key == "ArrowRight") {
      keyTaste.right = false;
    }
    if (e.key == "ArrowUp") {
      keyTaste.up = false;
    }
    if (e.key == " ") {
      keyTaste.space = false;
    }
  });
}
