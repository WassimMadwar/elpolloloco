class Bottle extends MovableObj {
  height = 30;
  width = 30;

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y+10;
    this.loadImg("assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
  }
}
