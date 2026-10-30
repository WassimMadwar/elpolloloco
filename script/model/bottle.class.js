class Bottle extends MovableObj {
  height = 30;
  width = 30;
  // ===== BOTTLE HITBOX: transparent edges that do not count for pickup =====
  // The visible bottle stands right of the image center: an 11 x 21 box inside 30 x 30.
  offset = { top: 6, left: 13, right: 6, bottom: 3 };
  // =========================================================================

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y+10;
    this.loadImg("assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
  }
}
