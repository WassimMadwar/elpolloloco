class ThrowableObj extends MovableObj {
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
        this.land();
        return;
      }
      this.x += this.otherDirection ? -6 : 6;
    }, 50);
  } 

  land() {
    clearInterval(this.moveInterval);
    this.isDying = true;
    this.speedY = -9;
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
  }
}
