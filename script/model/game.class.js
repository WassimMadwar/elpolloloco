class Game {
  character = new Character();
  enemies = [new Enemy(), new Enemy(), new Enemy()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  ctx;
  renderCanvas;

  clouds = [new Cloud("assets/img/5_background/layers/4_clouds/1.png")];
  backgroundObj = [
    new BackgroundObj("assets/img/5_background/layers/1_first_layer/1.png")
  ];
  constructor(canvas) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);
  this.addToMap(this.character); 
  
  
  this.enemies.forEach((enemy) => {
    this.ctx.drawImage(
      enemy.img,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height,
    );
  });
  
  this.addToMap(this.character); 
  this.clouds.forEach((cloud) => {
    this.ctx.drawImage(
      cloud.img,
      cloud.x,
      cloud.y,
      cloud.width,
      cloud.height,
    );
  });
  let self = this;
  requestAnimationFrame(() => self.draw());
}
addToMap(movableObj) {
  this.ctx.drawImage(
    movableObj.img,
    movableObj.x,
      movableObj.y,
      movableObj.width,
      movableObj.height,
    );
  }
}
