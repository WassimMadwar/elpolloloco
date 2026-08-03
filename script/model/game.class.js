class Game {
  character = new Character();
  enemies = [new Enemy(), new Enemy(), new Enemy()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  ctx;
  renderCanvas;

  clouds = [new Cloud("assets/img/5_background/layers/4_clouds/1.png")];
  backgrounds = [
    new BackgroundObj("assets/img/5_background/layers/1_first_layer/1.png",0,75),
  ];
  constructor(canvas) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);

    this.addToMap(this.character);
    this.addObjectsToMap(this.backgrounds);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);

    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  addObjectsToMap(objs) {
    objs.forEach((obj) => {
      this.addToMap(obj);
    });
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
