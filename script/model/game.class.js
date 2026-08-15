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
    this.setupEndboss();
  }

  setupEndboss() {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss) endboss.gameMatch = this;
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
      this.removeDeadEnemies();
      this.checkBottleCollisions();
      this.removeOffscreenBottles();
    }, 200);
  }

  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy) || enemy.isDying) return;
      if (enemy instanceof Enemy && this.character.isFalling()) {
        enemy.die();
      } else {
        this.character.hit();
      }
    });
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !(enemy.isDying && enemy.isReadyToRemove && enemy.isReadyToRemove()),
    );
  }

  checkThrowedBottle() {
    if (this.keyAction.space) {
      let bottle = new ThrowableObj(
        this.character.x,
        this.character.y,
        this.character.otherDirection,
      );
      this.bottlesObj.push(bottle);
    }
  }

  checkBottleCollisions() {
    this.bottlesObj.forEach((bottle) => this.checkBottleHitsEnemies(bottle));
  }

  checkBottleHitsEnemies(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        this.checkBottleHitsBoss(bottle, enemy);
      } else if (this.bottleHitsEnemy(bottle, enemy)) {
        enemy.die();
      }
    });
  }

  bottleHitsEnemy(bottle, enemy) {
    return enemy instanceof Enemy && !enemy.isDying && bottle.isColliding(enemy);
  }

  checkBottleHitsBoss(bottle, boss) {
    if (boss.isDying || !bottle.isColliding(boss)) return;
    boss.hit();
  }

  removeOffscreenBottles() {
    this.bottlesObj = this.bottlesObj.filter((bottle) => {
      const offscreen = this.isBottleOffscreen(bottle);
      if (offscreen) bottle.stopBottle();
      return !offscreen;
    });
  }

  isBottleOffscreen(bottle) {
    const screenX = bottle.x + this.camera_x;
    if (bottle.y > this.renderCanvas.height) return true;
    return screenX > this.renderCanvas.width || screenX < 0;
  }
}
