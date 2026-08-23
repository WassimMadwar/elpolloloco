class Game {
  static paused = false;
  character;
  level;
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;
  statusBars;
  bottlesObj = [];
  coinCount = 0;
  totalCoins = 5;
  bottleCount = 0;
  totalBottles = 5;
  throwableBottles = 0;
  maxThrowableBottles = 10;
  gameOverImg = new Image();
  winImg = new Image();
  gameOverDelay = 2000;
  control = new Control();
  pauseIcon = new Image();
  settingsIcon = new Image();
  controlIconSize = 15;
  controlIconPadding = 5;
  controlIconGap = 5;

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.gameOverImg.src = "assets/img/You won, you lost/You lost.png";
    this.winImg.src = "assets/img/You won, you lost/You won A.png";
    this.pauseIcon.src = "assets/img/control/pause_15x15.png";
    this.settingsIcon.src = "assets/img/control/settings_15x15.png";
    this.control.gameMatch = this;
    this.control.ctx = this.ctx;
    this.control.renderCanvas = this.renderCanvas;
    this.setupControlIcons();
    this.draw();
  }

  startGame() {
    this.character = new Character();
    this.level = createLevel1();
    this.statusBars = new StatusBars();
    this.setupGame();
    this.checkCollision();
    this.runGame();
    this.control.gameStarted = true;
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
    if (!this.control.gameStarted) {
      this.control.drawStartScreen();
      let self = this;
      requestAnimationFrame(() => self.draw());
      return;
    }
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgrounds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, -0);
    this.statusBars.draw(this.ctx);
    this.drawControlIcons();
    this.control.drawPanel(this.ctx, this.getSettingsIconX() + this.controlIconSize, this.getSettingsPanelAnchorY());
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
      if (Game.paused) return;
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
      this.updateBottleBar();
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
    this.statusBars.setCoins(this.coinCount, this.totalCoins);
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
    this.updateBottleBar();
  }

  updateBottleBar() {
    this.statusBars.setBottles(this.throwableBottles, this.maxThrowableBottles);
  }

  getCanvasClickPosition(event) {
    const rect = this.renderCanvas.getBoundingClientRect();
    const scaleX = this.renderCanvas.width / rect.width;
    const scaleY = this.renderCanvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  getSettingsIconX() {
    return this.renderCanvas.width - this.controlIconSize - this.controlIconPadding;
  }

  getPauseIconX() {
    return this.getSettingsIconX() - this.controlIconSize - this.controlIconGap;
  }

  drawControlIcons() {
    const pauseImg = Game.paused ? this.control.playIcon : this.pauseIcon;
    this.ctx.drawImage(
      pauseImg,
      this.getPauseIconX(),
      this.controlIconPadding,
      this.controlIconSize,
      this.controlIconSize,
    );
    this.ctx.drawImage(
      this.settingsIcon,
      this.getSettingsIconX(),
      this.controlIconPadding,
      this.controlIconSize,
      this.controlIconSize,
    );
  }

  getSettingsPanelAnchorY() {
    return this.controlIconPadding + this.controlIconSize + this.controlIconGap;
  }

  setupControlIcons() {
    this.renderCanvas.addEventListener("click", (event) => {
      const pos = this.getCanvasClickPosition(event);
      if (!this.control.gameStarted) {
        this.control.handleStartScreenClick(pos);
        return;
      }
      const anchorX = this.getSettingsIconX() + this.controlIconSize;
      const anchorY = this.getSettingsPanelAnchorY();
      if (this.control.panelOpen && this.control.handlePanelClick(pos, anchorX, anchorY)) return;
      if (this.isIconClicked(pos, this.getPauseIconX(), this.controlIconPadding)) this.togglePause();
      if (this.isIconClicked(pos, this.getSettingsIconX(), this.controlIconPadding)) this.control.togglePanel();
    });
  }

  isIconClicked(pos, iconX, iconY) {
    return (
      pos.x >= iconX &&
      pos.x <= iconX + this.controlIconSize &&
      pos.y >= iconY &&
      pos.y <= iconY + this.controlIconSize
    );
  }

  togglePause() {
    Game.paused = !Game.paused;
  }

  restartGame() {
    this.character.stop();
    this.stopCurrentLevel();
    this.bottlesObj.forEach((bottle) => bottle.stopBottle());
    this.bottlesObj = [];
    this.character = new Character();
    this.character.gameMatch = this;
    this.level = createLevel1();
    this.setupEndboss();
    this.resetCounters();
  }

  stopCurrentLevel() {
    this.level.enemies.forEach((enemy) => enemy.stop());
    this.level.clouds.forEach((cloud) => cloud.stop());
    this.level.coins.forEach((coin) => coin.stop());
  }

  resetCounters() {
    this.coinCount = 0;
    this.bottleCount = 0;
    this.throwableBottles = 0;
    this.statusBars.reset();
    Game.paused = false;
    this.control.closePanel();
  }

}
