class Game {
  character = new Character();
  level = level1;
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;
  helthBarChar = new StatusBar();
  bottlesObj = [    ];

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.draw();
    this.setupGame();
    this.camera_x;
    this.checkCollision();
    this.runGame();
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
    this.ctx.translate(-this.camera_x, -0);
    this.addToMap(this.helthBarChar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bottlesObj);
    this.character.drawViewFrame(this.ctx);
    this.level.enemies.forEach((enemy) => enemy.drawViewFrame(this.ctx));
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

  runGame() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowedBottle();
    }, 200);
  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.helthBarChar.setPercentge(this.helthBarChar._percentge - 20);
      }
    });
  }

  checkThrowedBottle() {
    if (this.keyAction.space) {
      let bottle = new ThrowableObj(this.character.x,this.character.y);
      this.bottlesObj.push(bottle);
    }
  }
}
