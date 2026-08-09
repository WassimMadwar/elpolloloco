class ThrowableObj extends MovableObj {
  constructor() {
    super();
    this.x = 100;
    this.y = 50;
    this.loadImg("assets/img/6_salsa_bottle/salsa_bottle.png");
    this.height = 25;
    this.width = 30;
    this.throwBottle(60,10);
  }

  throwBottle(wx, wy) {
    this.x = wx;
    this.y = wy;
    this.speedY = 3;
    this.applyGravity();
    setInterval(() => {
        this.x +=6;
    }, 50);
  }
}
