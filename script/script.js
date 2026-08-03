console.log("Class Info");

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
let canvas;
// let ctx;
let game ;


function init() {
  canvas = document.getElementById("canvas");
  game = new Game(canvas);
  // character.src = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
  // ctx = canvas.getContext("2d");
  // setTimeout(() => {
  //   ctx.drawImage(character, 20, 20, 50, 100);
  // }, 2000);
  console.log("gtgtt",game.character);
}
