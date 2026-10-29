class Game {
  static VIEW_WIDTH = 300;
  static VIEW_HEIGHT = 150;
  static paused = false;
  // DEBUG: draws collision boxes as red outlines. Remove after testing.
  static SHOW_HITBOXES = false;
  character;
  level;
  ctx;
  renderCanvas;
  viewport;
  touchControls;
  keyAction;
  camera_x = -100;
  runGameInterval;
  fastCheckInterval;
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
  resultTimeoutStarted = false;
  matchOver = false;
  control = new Control();
  controlIconSize = 15;
  controlIconPadding = 5;
  controlIconGap = 5;

  constructor(canvas, keyTaste) {
    this.renderCanvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.viewport = new Viewport(
      canvas,
      this.ctx,
      Game.VIEW_WIDTH,
      Game.VIEW_HEIGHT,
    );
    this.keyAction = keyTaste;
    this.touchControls = new TouchControls(this);
    this.gameOverImg.src = "assets/img/You won, you lost/You lost.png";
    this.winImg.src = "assets/img/You won, you lost/You won A.png";
    this.control.gameMatch = this;
    this.control.ctx = this.ctx;
    this.control.renderCanvas = this.renderCanvas;
    this.setupControlIcons();
    this.draw();
    this.resultTimeout = null;
    this.resultTimeoutStarted = false;
  }

  /**
   * Starts a new match.
   * Creates the character, the level and the status bars, starts the game loops
   * and closes the start screen.
   */
  startGame() {
    this.character = new Character();
    this.level = createLevel1();
    this.statusBars = new StatusBars();
    this.matchOver = false;
    this.setupGame();
    this.checkCollision();
    this.runGame();
    this.control.gameStarted = true;
    this.clearResultTimeout();
  }

  /**
   * Connects the character and the boss with this game.
   */
  setupGame() {
    this.character.gameMatch = this;
    this.setupEndboss();
  }

  /**
   * Finds the boss in the level and connects it with this game.
   */
  setupEndboss() {
    const endboss = this.level.enemies.find(
      (enemy) => enemy instanceof Endboss,
    );
    if (endboss) endboss.gameMatch = this;
  }

  /**
   * Draws one frame of the game and requests the next frame.
   * Shows the start screen before the match, otherwise the level, the character,
   * the status bars, the controls, the result screen and the pause menu.
   */
  draw() {
    this.ctx.clearRect(0, 0, Game.VIEW_WIDTH, Game.VIEW_HEIGHT);
    if (this.drawStartScreenIfNeeded()) return;
    this.drawWithCamera(() => {
      this.addingBackgroundsElemente();
      this.addToMap(this.character);
    });
    this.statusBars.draw(this.ctx);
    this.drawControlIcons();
    this.drawWithCamera(() => this.addingAggregateElements());
    if (Game.SHOW_HITBOXES) this.drawWithCamera(() => this.drawHitboxes()); // DEBUG
    this.touchControls.draw(this.ctx);
    this.drawGameResult();
    if (this.control.pauseMenuOpen) this.control.drawStartPanel();
    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  /**
   * Runs a drawing function with the camera offset, so the level moves with the character.
   * @param {Function} drawFn - The function that draws the objects.
   */
  drawWithCamera(drawFn) {
    this.ctx.translate(this.camera_x, 0);
    drawFn();
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws the start screen as long as the match has not started.
   * @returns {boolean} True if the start screen was drawn, otherwise false.
   */
  drawStartScreenIfNeeded() {
    if (this.control.gameStarted) return false;
    this.control.drawStartScreen();
    requestAnimationFrame(() => this.draw());
    return true;
  }

  /**
   * Draws the collision boxes of the character, enemies, coins and bottles as red outlines.
   * Only used for debugging when Game.SHOW_HITBOXES is true.
   */
  drawHitboxes() {
    const objects = [
      this.character,
      ...this.level.enemies,
      ...this.level.coins,
      ...this.level.bottles,
      ...this.bottlesObj,
    ];
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 0.5;
    objects.forEach((obj) => {
      const box = obj.getHitbox();
      this.ctx.strokeRect(
        box.left,
        box.top,
        box.right - box.left,
        box.bottom - box.top,
      );
    });
  }

  /**
   * Draws the coins, the bottles on the ground and the thrown bottles.
   */
  addingAggregateElements() {
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.bottlesObj);
  }

  /**
   * Draws the background layers, the clouds and the enemies.
   */
  addingBackgroundsElemente() {
    this.addObjectsToMap(this.level.backgrounds);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   * Draws the won or lost image when the match is over
   * and opens the pause menu 2 seconds later.
   */
  drawGameResult() {
    const result = this.getGameResult();
    if (result === "lost") this.drawResultImg(this.gameOverImg);
    if (result === "won") this.drawResultImg(this.winImg);
    if (result && !this.resultTimeoutStarted) {
      this.resultTimeoutStarted = true;
      this.resultTimeout = setTimeout(() => {
        this.resultTimeoutStarted = false;
        this.control.pauseMenuOpen = true;
        Game.paused = true;
      }, 2000);
    }
  }

  /**
   * Checks whether the match is lost (character dead) or won (boss dead).
   * @returns {(string|boolean)} "lost", "won" or false while the match is still running.
   */
  getGameResult() {
    if (this.isReadyToShow(this.character)) return "lost";
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss && this.isReadyToShow(boss)) return "won";
    return false;
  }

  /**
   * Cancels a pending result timeout, closes the pause menu and resumes the game.
   */
  clearResultTimeout() {
    if (this.resultTimeout) {
      clearTimeout(this.resultTimeout);
      this.resultTimeout = null;
      this.resultTimeoutStarted = false;
    }
    this.control.pauseMenuOpen = false;
    Game.paused = false;
  }

  /**
   * Restarts the match: stops all running objects and creates a new character and level.
   */
  restartGame() {
    this.clearResultTimeout();
    this.matchOver = false;
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

  /**
   * Checks whether an object has been dead long enough to show the result screen.
   * @param {MovableObj} entity - The character or the boss.
   * @returns {boolean} True if the result can be shown.
   */
  isReadyToShow(entity) {
    if (!entity.isDying) return false;
    return new Date().getTime() - entity.deathTime >= this.gameOverDelay;
  }

  /**
   * Draws the result image (won or lost) over the whole game view.
   * @param {HTMLImageElement} img - The image to draw.
   */
  drawResultImg(img) {
    this.ctx.drawImage(
      img,
      5,
      5,
      Game.VIEW_WIDTH - 10,
      Game.VIEW_HEIGHT - 10,
    );
  }

  /**
   * Draws a list of objects.
   * @param {MovableObj[]} objs - The objects to draw.
   */
  addObjectsToMap(objs) {
    objs.forEach((obj) => {
      this.addToMap(obj);
    });
  }

  /**
   * Draws a single object and mirrors it when it looks to the left.
   * @param {MovableObj} movableObj - The object to draw.
   */
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

  /**
   * Mirrors the canvas horizontally so the object is drawn looking to the left.
   * @param {MovableObj} movableObj - The object to mirror.
   */
  flipImage(movableObj) {
    this.ctx.save();
    this.ctx.translate(movableObj.x * 2 + movableObj.width, 0);
    this.ctx.scale(-1, 1);
  }

  /**
   * Restores the canvas after an object was drawn mirrored.
   */
  flipImageBack() {
    this.ctx.restore();
  }

  /**
   * Starts the main game loop (every 200 ms) for collisions, throwing, coins and bottles,
   * and starts the fast checks. Skipped while the game is paused.
   * After the end of the match only finished bottle splashes are still removed.
   */
  runGame() {
    clearInterval(this.runGameInterval);
    this.runGameInterval = setInterval(() => {
      if (Game.paused) return;
      this.removeOffscreenBottles();
      if (this.matchOver) return;
      this.checkCollision();
      this.checkThrowedBottle();
      this.removeDeadEnemies();
      this.checkBossReached();
      this.checkCoinCollisions();
      this.checkGroundBottleCollisions();
    }, 200);
    this.runFastChecks();
  }

  /**
   * Starts the fast check loop (every 50 ms) for bottle hits and stomps,
   * so fast moving objects are not missed. Skipped while the game is paused or the match is over.
   */
  runFastChecks() {
    clearInterval(this.fastCheckInterval);
    this.fastCheckInterval = setInterval(() => {
      if (Game.paused || this.matchOver) return;
      this.checkBottleCollisions();
      this.checkStomps();
    }, 50);
  }

  /**
   * Kills every small enemy the character is landing on.
   */
  checkStomps() {
    if (this.character.isDying) return;
    this.level.enemies.forEach((enemy) => {
      if (this.isStomped(enemy)) this.killEnemy(enemy);
    });
  }

  /**
   * Kills a small enemy and plays the death sound.
   * @param {Enemy} enemy - The enemy to kill.
   */
  killEnemy(enemy) {
    if (enemy.isDying) return;
    enemy.die();
    this.control.playEffect("smallDeath");
  }

  /**
   * Checks whether the character is landing on top of a small enemy.
   * @param {MovableObj} enemy - The enemy to check.
   * @returns {boolean} True if the enemy is stomped.
   */
  isStomped(enemy) {
    if (!(enemy instanceof Enemy) || enemy.isDying) return false;
    if (!this.character.isColliding(enemy)) return false;
    return this.character.canStomp(enemy);
  }

  /**
   * Checks the contact between the character and the enemies.
   * A stomped small enemy dies, any other contact hurts the character.
   */
  checkCollision() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy) || enemy.isDying) return;
      if (this.isStomped(enemy)) {
        this.killEnemy(enemy);
      } else {
        this.character.hit();
      }
    });
  }

  /**
   * Removes dead enemies from the level after their death time has passed.
   */
  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) =>
        !(enemy.isDying && enemy.isReadyToRemove && enemy.isReadyToRemove()),
    );
  }

  /**
   * Throws a bottle when a throw was requested and the character has bottles left.
   * Plays the throw sound and updates the bottle bar.
   */
  checkThrowedBottle() {
    const wantsThrow = this.keyAction.throwRequested;
    this.keyAction.throwRequested = false;
    if (wantsThrow && this.throwableBottles > 0) {
      let bottle = new ThrowableObj(
        this.character.x,
        this.character.y,
        this.character.otherDirection,
      );
      bottle.gameMatch = this;
      this.bottlesObj.push(bottle);
      this.control.playEffect("throwBottle", false);
      this.throwableBottles--;
      this.updateBottleBar();
    }
  }

  /**
   * Checks whether the character has come close enough to the boss.
   */
  checkBossReached() {
    const boss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (boss) boss.checkReached(this.character);
  }

  /**
   * Checks all thrown bottles for hits on enemies.
   */
  checkBottleCollisions() {
    this.bottlesObj.forEach((bottle) => this.checkBottleHits(bottle));
  }

  /**
   * Checks whether a bottle hits an enemy.
   * The boss loses health, a small enemy dies. The bottle breaks on the hit.
   * @param {ThrowableObj} bottle - The thrown bottle.
   */
  checkBottleHits(bottle) {
    if (bottle.hasHit || bottle.isSplashing) return;
    const enemy = this.level.enemies.find(
      (enemy) => !enemy.isDying && bottle.isColliding(enemy),
    );
    if (!enemy) return;
    bottle.hasHit = true;
    if (enemy instanceof Endboss) {
      enemy.hit();
      bottle.splashOnBoss(enemy);
    } else {
      this.killEnemy(enemy);
      bottle.splashOnEnemy(enemy);
    }
  }

  /**
   * Removes bottles that have finished breaking or left the view.
   */
  removeOffscreenBottles() {
    this.bottlesObj = this.bottlesObj.filter((bottle) => {
      const remove = bottle.isFinished || this.isBottleOffscreen(bottle);
      if (remove) bottle.stopBottle();
      return !remove;
    });
  }

  /**
   * Checks whether a bottle is outside the visible game view.
   * @param {ThrowableObj} bottle - The bottle to check.
   * @returns {boolean} True if the bottle is outside the view.
   */
  isBottleOffscreen(bottle) {
    const screenX = bottle.x + this.camera_x;
    if (bottle.y > Game.VIEW_HEIGHT) return true;
    return screenX > Game.VIEW_WIDTH || screenX < 0;
  }

  /**
   * Collects every coin the character touches.
   */
  checkCoinCollisions() {
    this.level.coins = this.level.coins.filter((coin) => {
      const collected = this.character.isColliding(coin);
      if (collected) this.collectCoin();
      return !collected;
    });
  }

  /**
   * Counts a collected coin, plays the coin sound and updates the coin bar.
   */
  collectCoin() {
    this.coinCount++;
    this.control.playEffect("coin");
    this.statusBars.setCoins(this.coinCount, this.totalCoins);
  }

  /**
   * Collects every bottle on the ground the character touches.
   */
  checkGroundBottleCollisions() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      const collected = this.character.isColliding(bottle);
      if (collected) this.collectBottle();
      return !collected;
    });
  }

  /**
   * Counts a collected bottle, adds two throwable bottles,
   * plays the pickup sound and updates the bottle bar.
   */
  collectBottle() {
    this.bottleCount++;
    this.throwableBottles += 2;
    this.control.playEffect("takeBottle");
    this.updateBottleBar();
  }

  /**
   * Updates the bottle bar with the number of throwable bottles.
   */
  updateBottleBar() {
    this.statusBars.setBottles(this.throwableBottles, this.maxThrowableBottles);
  }

  /**
   * Converts the position of a click or touch from screen pixels to game units.
   * @param {MouseEvent} event - The click or pointer event.
   * @returns {{x: number, y: number}} The position in game units.
   */
  getCanvasClickPosition(event) {
    const rect = this.renderCanvas.getBoundingClientRect();
    const scaleX = Game.VIEW_WIDTH / rect.width;
    const scaleY = Game.VIEW_HEIGHT / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  /**
   * Returns the x position of the settings icon (top right corner).
   * @returns {number} The x position in game units.
   */
  getSettingsIconX() {
    return (
      Game.VIEW_WIDTH - this.controlIconSize - this.controlIconPadding
    );
  }

  /**
   * Returns the x position of the pause icon (left of the settings icon).
   * @returns {number} The x position in game units.
   */
  getPauseIconX() {
    return this.getSettingsIconX() - this.controlIconSize - this.controlIconGap;
  }

  /**
   * Draws the pause (or play) icon and the settings icon in the top right corner.
   */
  drawControlIcons() {
    RoundButton.drawInBox(
      this.ctx,
      Game.paused ? "play" : "pause",
      this.getPauseIconX(),
      this.controlIconPadding,
      this.controlIconSize,
    );
    RoundButton.drawInBox(
      this.ctx,
      "settings",
      this.getSettingsIconX(),
      this.controlIconPadding,
      this.controlIconSize,
    );
  }

  /**
   * Adds the click handler for the canvas.
   * Handles clicks on the start screen, the pause menu, the pause icon and the settings icon.
   */
  setupControlIcons() {
    this.renderCanvas.addEventListener("click", (event) => {
      const pos = this.getCanvasClickPosition(event);
      if (this.touchControls.isButtonAt(pos)) return;
      if (!this.control.gameStarted || this.control.pauseMenuOpen) {
        this.control.handleStartScreenClick(pos);
        return;
      }
      if (
        this.isIconClicked(pos, this.getPauseIconX(), this.controlIconPadding)
      )
        this.togglePause();
      if (
        this.isIconClicked(
          pos,
          this.getSettingsIconX(),
          this.controlIconPadding,
        )
      )
        this.control.togglePauseMenu();
    });
  }

  /**
   * Checks whether a position lies on a control icon.
   * @param {{x: number, y: number}} pos - The click position in game units.
   * @param {number} iconX - The x position of the icon.
   * @param {number} iconY - The y position of the icon.
   * @returns {boolean} True if the icon was clicked.
   */
  isIconClicked(pos, iconX, iconY) {
    return (
      pos.x >= iconX &&
      pos.x <= iconX + this.controlIconSize &&
      pos.y >= iconY &&
      pos.y <= iconY + this.controlIconSize
    );
  }

  /**
   * Pauses or resumes the game.
   */
  togglePause() {
    Game.paused = !Game.paused;
  }

  /**
   * Ends the match once the character or the boss starts dying.
   * Freezes all enemies, clouds and coins and removes the bottles still in the air.
   * A dying boss keeps playing its death animation.
   */
  endMatch() {
    if (this.matchOver) return;
    this.matchOver = true;
    this.level.enemies.forEach((enemy) => {
      if (!(enemy instanceof Endboss && enemy.isDying)) enemy.stop();
    });
    this.level.clouds.forEach((cloud) => cloud.stop());
    this.level.coins.forEach((coin) => coin.stop());
    this.removeFlyingBottles();
  }

  /**
   * Removes all thrown bottles that have not hit anything yet.
   * Bottles that already hit an enemy finish their splash.
   */
  removeFlyingBottles() {
    this.bottlesObj = this.bottlesObj.filter((bottle) => {
      const flying = !bottle.hasHit && !bottle.isSplashing;
      if (flying) bottle.stopBottle();
      return !flying;
    });
  }

  /**
   * Stops all enemies, clouds and coins of the current level.
   */
  stopCurrentLevel() {
    this.level.enemies.forEach((enemy) => enemy.stop());
    this.level.clouds.forEach((cloud) => cloud.stop());
    this.level.coins.forEach((coin) => coin.stop());
  }

  /**
   * Resets the coin and bottle counters and the status bars and resumes the game.
   */
  resetCounters() {
    this.coinCount = 0;
    this.bottleCount = 0;
    this.throwableBottles = 0;
    this.statusBars.reset();
    Game.paused = false;
  }

  /**
   * Ends the match and returns to the start screen.
   * Stops all running objects and game loops and resets the counters.
   */
  exitToStartScreen() {
    this.clearResultTimeout();
    this.matchOver = false;
    this.character.stop();
    this.stopCurrentLevel();
    this.bottlesObj.forEach((bottle) => bottle.stopBottle());
    this.bottlesObj = [];
    clearInterval(this.runGameInterval);
    clearInterval(this.fastCheckInterval);
    this.resetCounters();
    this.control.gameStarted = false;
  }
}
