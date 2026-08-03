class Enemy extends MovableObj {
  constructor(parameters) {
    super().loadImg(
      "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    );
    this.x =    150 + Math.random() * 100;
    this.y = 95;
    this.height = 25;
    this.width = 15;
  }
}
