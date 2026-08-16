class Game {
  character = new Character();
  level = level1;
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;
  helthBarChar = new StatusBar();
  coinBar = new StatusBar(
    [
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
      "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
    ],
    0,
    5,
    15,
  );
  bottleBar = new StatusBar(
    [
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
      "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
    ],
    0,
    5,
    30,
  );
  bottlesObj = [];
  coinCount = 0;
  totalCoins = 5;
  bottleCount = 0;
  totalBottles = 5;
  throwableBottles = 0;
  gameOverImg = new Image();
  winImg = new Image();
  gameOverDelay = 2000;

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.gameOverImg.src = "assets/img/You won, you lost/You lost.png";
    this.winImg.src = "assets/img/You won, you lost/You won A.png";
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
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss,
    );
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
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.bottlesObj);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.character.drawViewFrame(this.ctx);
    this.level.enemies.forEach((enemy) => enemy.drawViewFrame(this.ctx));
    this.ctx.translate(-this.camera_x, -0);
    this.drawGameResult();
    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  drawGameResult() {
    const result = this.getGameResult();
    if (result === "lost") this.drawResultImg(this.gameOverImg);
    if (result === "won") this.drawResultImg(this.winImg);
  }

  getGameResult() {
    if (this.isReadyToShow(this.character)) return "lost";
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss && this.isReadyToShow(boss)) return "won";
    return null;
  }

  isReadyToShow(entity) {
    if (!entity.isDying) return false;
    return new Date().getTime() - entity.deathTime >= this.gameOverDelay;
  }

  drawResultImg(img) {
    this.ctx.drawImage(
      img,
      5,
      5,
      this.renderCanvas.width - 10,
      this.renderCanvas.height - 10,
    );
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
      this.checkCoinCollisions();
      this.checkGroundBottleCollisions();
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
      (enemy) =>
        !(enemy.isDying && enemy.isReadyToRemove && enemy.isReadyToRemove()),
    );
  }

  checkThrowedBottle() {
    if (this.keyAction.space && this.throwableBottles > 0) {
      let bottle = new ThrowableObj(
        this.character.x,
        this.character.y,
        this.character.otherDirection,
      );
      this.bottlesObj.push(bottle);
      this.throwableBottles--;
    }
  }

  checkBottleCollisions() {
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (!boss) return;
    this.bottlesObj.forEach((bottle) => this.checkBottleHitsBoss(bottle, boss));
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

  checkCoinCollisions() {
    this.level.coins = this.level.coins.filter((coin) => {
      const collected = this.character.isColliding(coin);
      if (collected) this.collectCoin();
      return !collected;
    });
  }

  collectCoin() {
    this.coinCount++;
    this.coinBar.setPercentge((this.coinCount / this.totalCoins) * 100);
  }

  checkGroundBottleCollisions() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      const collected = this.character.isColliding(bottle);
      if (collected) this.collectBottle();
      return !collected;
    });
  }

  collectBottle() {
    this.bottleCount++;
    this.throwableBottles += 2;
    this.bottleBar.setPercentge((this.bottleCount / this.totalBottles) * 100);
  }
}
