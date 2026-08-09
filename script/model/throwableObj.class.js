class ThrowableObj extends MovableObj {
  constructor(x,y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImg("assets/img/6_salsa_bottle/salsa_bottle.png");
    this.height = 25;
    this.width = 30;
    this.throwBottle();
  }

  throwBottle() {
    this.speedY = 3;
    this.applyGravity();
    setInterval(() => {
        this.x +=6;
    }, 50);
  }
}
