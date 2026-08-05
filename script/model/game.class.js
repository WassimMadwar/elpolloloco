class Game {
  character = new Character();
 level = level1;
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;

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
    this.addObjectsToMap(this.level.backgrounds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
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
