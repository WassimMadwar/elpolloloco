class ThrowableObj extends MovableObj {
  static SPLASH_FRAME_MS = 70;
  static SPLASH_WIDTH = 45;
  static SPLASH_HEIGHT = 35;
  static GROUND_SPLASH_Y = 112;
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
    this.throwBottle();
    this.animateBottleRotation();
  }

  getStartX(x) {
    return this.otherDirection ? x - 20 : x + 20;
  }

  throwBottle() {
    this.speedY = 3;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      if (Game.paused) return;
      if (!this.isAboveGround()) {
        this.splashOnGround();
        return;
      }
      this.x += this.otherDirection ? -6 : 6;
    }, 50);
  }

  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  splashOnGround() {
    this.splash(this.getCenterX(), ThrowableObj.GROUND_SPLASH_Y);
  }

  splashOnBoss(boss) {
    this.splash(boss.x + 10, this.getCenterY());
  }

  splash(centerX, centerY) {
    if (this.isSplashing) return;
    this.isSplashing = true;
    this.stopBottle();
    this.width = ThrowableObj.SPLASH_WIDTH;
    this.height = ThrowableObj.SPLASH_HEIGHT;
    this.x = centerX - this.width / 2;
    this.y = centerY - this.height / 2;
    this.playSplashOnce();
  }

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

  animateBottleRotation() {
    this.rotationInterval = setInterval(() => {
      if (Game.paused) return;
      this.playAnimation(this.imgBottleRotation);
    }, 100);
  }

  stopBottle() {
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
    clearInterval(this.gravityInterval);
    clearInterval(this.splashInterval);
  }
}
