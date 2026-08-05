class Game {
  character = new Character();
  enemies = [new Enemy(), new Enemy(), new Enemy()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  ctx;
  renderCanvas;
  keyAction;
  clouds = [
    new Cloud("assets/img/5_background/layers/4_clouds/1.png"),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png"),
  ];
  backgrounds = [
    new BackgroundObj("assets/img/5_background/layers/air.png", 0),
    new BackgroundObj("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/1_first_layer/1.png", 0),
  ];
  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.draw();
    this.setupGame();
  }

  setupGame() {
    this.character.gameMatch = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);

    this.addObjectsToMap(this.backgrounds);
    this.addToMap(this.character);
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
    if (movableObj.otherDirection) {
      this.ctx.save();
      this.ctx.translate(movableObj.x * 2 + movableObj.width, 0);
      this.ctx.scale(-1, 1);
    }

    this.ctx.drawImage(
      movableObj.img,
      movableObj.x,
      movableObj.y,
      movableObj.width,
      movableObj.height,
    );

    if (movableObj.otherDirection) {
      this.ctx.restore();
    }
  }
}
