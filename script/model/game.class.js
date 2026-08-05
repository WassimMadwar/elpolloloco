class Game {
  character = new Character();
  enemies = [new Enemy(), new Enemy(), new Enemy()];
  clouds = [new Cloud(), new Cloud(), new Cloud()];
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;
  clouds = [
    new Cloud("assets/img/5_background/layers/4_clouds/1.png"),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png"),
  ];
  backgrounds = [
    new BackgroundObj("assets/img/5_background/layers/air.png", -300),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      -300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      -300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      -300,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 0),
    new BackgroundObj("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 2),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 3),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 3,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 3,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 3,
    ),
  ];

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.draw();
    this.setupGame();
    this.camera_x;
  }

  setupGame() {
    this.character.gameMatch = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.renderCanvas.width, this.renderCanvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgrounds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.ctx.translate(-this.camera_x, -0);

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
      this.flipImage(movableObj);
    }

    this.ctx.drawImage(
      movableObj.img,
      movableObj.x,
      movableObj.y,
      movableObj.width,
      movableObj.height,
    );

    if (movableObj.otherDirection) {
      this.flipImageBack(movableObj);
    }
  }

  flipImage(movableObj) {
    this.ctx.save();
    this.ctx.translate(movableObj.x * 2 + movableObj.width, 0);
    this.ctx.scale(-1, 1);
  }
  
  flipImageBack(movableObj) {
    this.ctx.restore();
  }
}
