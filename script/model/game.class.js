class Game {
  static paused = false;
  character;
  level;
  ctx;
  renderCanvas;
  keyAction;
  camera_x = -100;
  helthBarChar;
  coinBar;
  bottleBar;
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
  playIcon = new Image();
  settingsIcon = new Image();
  controlIconSize = 15;
  controlIconPadding = 5;
  controlIconGap = 5;
  settingsOpen = false;
  speakerIcon = new Image();
  muteIcon = new Image();
  replayIcon = new Image();
  gameStarted = false;
  startBgImg = new Image();
  jumpIcon = new Image();
  rightIcon = new Image();
  leftIcon = new Image();
  throwIcon = new Image();

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyAction = keyTaste;
    this.gameOverImg.src = "assets/img/You won, you lost/You lost.png";
    this.winImg.src = "assets/img/You won, you lost/You won A.png";
    this.pauseIcon.src = "assets/img/control/pause_15x15.png";
    this.playIcon.src = "assets/img/control/play_15x15.png";
    this.settingsIcon.src = "assets/img/control/settings_15x15.png";
    this.speakerIcon.src = "assets/img/control/speaker_15x15.png";
    this.muteIcon.src = "assets/img/control/mute_15x15.png";
    this.replayIcon.src = "assets/img/control/replay_15x15.png";
    this.startBgImg.src = "assets/img/5_background/complete_background.png";
    this.jumpIcon.src = "assets/img/control/jump.png";
    this.rightIcon.src = "assets/img/control/right_15x15.png";
    this.leftIcon.src = "assets/img/control/prev_arrow_15x15.png";
    this.throwIcon.src = "assets/img/control/space_15x15.png";
    this.setupControlIcons();
    this.draw();
  }

  startGame() {
    this.character = new Character();
    this.level = createLevel1();
    this.helthBarChar = new StatusBar();
    this.coinBar = new StatusBar(
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
    this.bottleBar = new StatusBar(
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
    this.setupGame();
    this.checkCollision();
    this.runGame();
    this.gameStarted = true;
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
    if (!this.gameStarted) {
      this.drawStartScreen();
      let self = this;
      requestAnimationFrame(() => self.draw());
      return;
    }
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgrounds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, -0);
    this.addToMap(this.helthBarChar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.drawControlIcons();
    this.drawSettingsPanel();
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
    this.updateBottleBar();
  }

  updateBottleBar() {
    this.bottleBar.setPercentge(
      (this.throwableBottles / this.maxThrowableBottles) * 100,
    );
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
    const pauseImg = Game.paused ? this.playIcon : this.pauseIcon;
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

  getSettingsPanelWidth() {
    return this.controlIconPadding * 2 + this.controlIconSize * 2 + this.controlIconGap;
  }

  getSettingsPanelHeight() {
    return this.controlIconPadding * 2 + this.controlIconSize;
  }

  getSettingsPanelX() {
    return this.getSettingsIconX() + this.controlIconSize - this.getSettingsPanelWidth();
  }

  getSettingsPanelY() {
    return this.controlIconPadding + this.controlIconSize + this.controlIconGap;
  }

  drawSettingsPanel() {
    if (!this.settingsOpen) return;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
    this.ctx.fillRect(
      this.getSettingsPanelX(),
      this.getSettingsPanelY(),
      this.getSettingsPanelWidth(),
      this.getSettingsPanelHeight(),
    );
    this.drawSettingsPanelIcons();
  }

  getPanelIconY() {
    return this.getSettingsPanelY() + this.controlIconPadding;
  }

  getSoundIconX() {
    return this.getSettingsPanelX() + this.controlIconPadding;
  }

  getReplayIconX() {
    return this.getSoundIconX() + this.controlIconSize + this.controlIconGap;
  }

  drawSettingsPanelIcons() {
    const soundIcon = this.control.muted ? this.muteIcon : this.speakerIcon;
    const y = this.getPanelIconY();
    this.ctx.drawImage(soundIcon, this.getSoundIconX(), y, this.controlIconSize, this.controlIconSize);
    this.ctx.drawImage(this.replayIcon, this.getReplayIconX(), y, this.controlIconSize, this.controlIconSize);
  }

  setupControlIcons() {
    this.renderCanvas.addEventListener("click", (event) => {
      const pos = this.getCanvasClickPosition(event);
      if (!this.gameStarted) {
        this.handleStartScreenClick(pos);
        return;
      }
      if (this.settingsOpen && this.handleSettingsPanelClick(pos)) return;
      if (this.isIconClicked(pos, this.getPauseIconX(), this.controlIconPadding)) this.togglePause();
      if (this.isIconClicked(pos, this.getSettingsIconX(), this.controlIconPadding)) this.toggleSettings();
    });
  }

  handleStartScreenClick(pos) {
    const x = this.getStartRowX();
    if (this.isIconClicked(pos, x, this.getStartRowY(1))) {
      this.startGame();
      return;
    }
    if (this.isIconClicked(pos, x, this.getStartRowY(0))) {
      this.control.swwitchSound();
    }
  }

  handleSettingsPanelClick(pos) {
    if (this.isIconClicked(pos, this.getSoundIconX(), this.getPanelIconY())) {
      this.control.swwitchSound();
      return true;
    }
    if (this.isIconClicked(pos, this.getReplayIconX(), this.getPanelIconY())) {
      this.restartGame();
      return true;
    }
    return false;
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

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
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
    this.helthBarChar.setPercentge(100);
    this.coinBar.setPercentge(0);
    this.bottleBar.setPercentge(0);
    Game.paused = false;
    this.settingsOpen = false;
  }

  drawStartScreen() {
    this.ctx.drawImage(
      this.startBgImg,
      0,
      0,
      this.renderCanvas.width,
      this.renderCanvas.height,
    );
    this.drawStartPanel();
  }

  getStartPanelWidth() {
    return this.renderCanvas.width * 0.8;
  }

  getStartPanelHeight() {
    return this.renderCanvas.height * 0.8;
  }

  getStartPanelX() {
    return (this.renderCanvas.width - this.getStartPanelWidth()) / 2;
  }

  getStartPanelY() {
    return (this.renderCanvas.height - this.getStartPanelHeight()) / 2;
  }

  getStartRowX() {
    return this.getStartPanelX() + 6;
  }

  getStartRowY(index) {
    return this.getStartPanelY() + 14 + index * 18;
  }

  drawStartPanel() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(
      this.getStartPanelX(),
      this.getStartPanelY(),
      this.getStartPanelWidth(),
      this.getStartPanelHeight(),
    );
    this.drawStartPanelRows();
  }

  drawStartPanelRows() {
    const x = this.getStartRowX();
    this.drawIconLabelRow(this.speakerIcon, "Sound", x, this.getStartRowY(0));
    this.drawIconLabelRow(this.playIcon, "Play / start", x, this.getStartRowY(1));
    this.drawMovementRow(this.getStartRowY(2));
    this.drawIconLabelRow(this.throwIcon, "Hit", x, this.getStartRowY(3));
  }

  drawIconLabelRow(icon, label, x, y) {
    this.ctx.drawImage(icon, x, y, this.controlIconSize, this.controlIconSize);
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + this.controlIconSize + 4, y + this.controlIconSize / 2);
  }

  drawMovementRow(y) {
    const startX = this.getStartRowX();
    const segmentWidth = (this.getStartPanelWidth() - 12) /3;
    this.drawIconLabelRow(this.jumpIcon, "Jump", startX, y);
    this.drawIconLabelRow(this.rightIcon, "Right", startX + segmentWidth, y);
    this.drawIconLabelRow(this.leftIcon, "Left", startX + segmentWidth * 2, y);
    
  
  }
}
