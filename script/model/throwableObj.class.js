class ThrowableObj extends MovableObj {
  static SPLASH_FRAME_MS = 70;
  static SPLASH_WIDTH = 45;
  static SPLASH_HEIGHT = 35;
  static GROUND_SPLASH_Y = 112;
  // The ground line in the level (where the character's feet stand).
  static GROUND_LEVEL = 130;
  gameMatch;
  hasHit = false;
  isSplashing = false;
  isFinished = false;
  imgBottleSplash = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  imgBottleRotation = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y, otherDirection) {
    super();
    this.otherDirection = otherDirection;
    this.x = this.getStartX(x);
    this.y = y + 30;
    this.loadImg(this.imgBottleRotation[0]);
    this.loadImgMoving(this.imgBottleRotation);
    this.loadImgMoving(this.imgBottleSplash);
    this.height = 25;
    this.width = 30;
    this.groundY = ThrowableObj.GROUND_LEVEL - this.height;
    this.throwBottle();
    this.animateBottleRotation();
  }

  /**
   * Calculates the start x position of the bottle in front of the character.
   * @param {number} x - The x position of the character.
   * @returns {number} The start x position of the bottle.
   */
  getStartX(x) {
    return this.otherDirection ? x - 20 : x + 20;
  }

  /**
   * Throws the bottle in an arc in the direction the character is looking.
   * Skipped while the game is paused.
   */
  throwBottle() {
    this.speedY = 3;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      if (Game.paused) return;
      this.x += this.otherDirection ? -6 : 6;
    }, 50);
  }

  /**
   * Starts the gravity of the bottle (25 times per second).
   * The bottle breaks in the same step in which its bottom reaches the ground.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (Game.paused) return;
      this.goDown();
      if (this.isAboveGround()) return;
      this.y = this.groundY;
      this.splashOnGround();
    }, 1000 / 25);
  }

  /**
   * Returns the horizontal center of the bottle.
   * @returns {number} The x position of the center in game units.
   */
  getCenterX() {
    return this.x + this.width / 2;
  }

  /**
   * Returns the vertical center of the bottle.
   * @returns {number} The y position of the center in game units.
   */
  getCenterY() {
    return this.y + this.height / 2;
  }

  /**
   * Breaks the bottle on the ground below its current position.
   */
  splashOnGround() {
    this.splash(this.getCenterX(), ThrowableObj.GROUND_SPLASH_Y);
  }

  /**
   * Breaks the bottle on the front edge of the boss.
   * @param {Endboss} boss - The boss that was hit.
   */
  splashOnBoss(boss) {
    this.splash(boss.x + boss.offset.left, this.getCenterY());
  }

  /**
   * Breaks the bottle in the middle of a small enemy.
   * @param {Enemy} enemy - The enemy that was hit.
   */
  splashOnEnemy(enemy) {
    this.splash(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
  }

  /**
   * Breaks the bottle at a point: stops its movement, plays the glass sound
   * and starts the splash animation centered on that point.
   * @param {number} centerX - The x position of the impact.
   * @param {number} centerY - The y position of the impact.
   */
  splash(centerX, centerY) {
    if (this.isSplashing) return;
    this.isSplashing = true;
    this.stopBottle();
    this.gameMatch.control.playEffect("glassBreak");
    this.width = ThrowableObj.SPLASH_WIDTH;
    this.height = ThrowableObj.SPLASH_HEIGHT;
    this.x = centerX - this.width / 2;
    this.y = centerY - this.height / 2;
    this.playSplashOnce();
  }

  /**
   * Plays the splash animation once and marks the bottle as finished after the last frame.
   * Skipped while the game is paused.
   */
  playSplashOnce() {
    let frame = 0;
    this.img = this.imageCache[this.imgBottleSplash[frame]];
    this.splashInterval = setInterval(() => {
      if (Game.paused) return;
      frame++;
      if (frame >= this.imgBottleSplash.length) {
        clearInterval(this.splashInterval);
        this.isFinished = true;
        return;
      }
      this.img = this.imageCache[this.imgBottleSplash[frame]];
    }, ThrowableObj.SPLASH_FRAME_MS);
  }

  /**
   * Starts the rotation animation of the flying bottle (every 100 ms).
   * Skipped while the game is paused.
   */
  animateBottleRotation() {
    this.rotationInterval = setInterval(() => {
      if (Game.paused) return;
      this.playAnimation(this.imgBottleRotation);
    }, 100);
  }

  /**
   * Stops all intervals of the bottle: movement, rotation, gravity and splash.
   */
  stopBottle() {
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
    clearInterval(this.gravityInterval);
    clearInterval(this.splashInterval);
  }
}
