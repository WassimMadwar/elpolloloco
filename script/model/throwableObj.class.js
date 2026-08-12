class ThrowableObj extends MovableObj {
  imgBottleRotation = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y) {
    super();
    this.x = x + 20;
    this.y = y + 30;
    this.loadImg(this.imgBottleRotation[0]);
    this.loadImgMoving(this.imgBottleRotation);
    this.height = 25;
    this.width = 30;
    this.throwBottle();
    this.animateBottleRotation();
  }

  throwBottle() {
    this.speedY = 3;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      this.x += 6;
    }, 50);
  }

  animateBottleRotation() {
    this.rotationInterval = setInterval(() => {
      this.playAnimation(this.imgBottleRotation);
    }, 100);
  }

  stopBottle() {
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
    clearInterval(this.gravityInterval);
  }
}
