class Enemy extends MovableObj {
  imgEnemyWalking = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  currentImg = 0;
  constructor(parameters) {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 150 + Math.random() * 100;
    this.y = 100;
    this.height = 25;
    this.width = 15;
    this.loadImgMoving(this.imgEnemyWalking);
    this.speed = 0.15 + Math.random() * 1.1;
    this.animateEnemyWalking();
    this.animate();
  }

  animateEnemyWalking() {
    setInterval(() => {
      let path = this.imgEnemyWalking[this.currentImg];
      this.img = this.imageCache[path];
      this.updateCurrentImg();
    }, 200);
  }

  updateCurrentImg() {
    this.currentImg++;
    if (this.currentImg >= this.imgEnemyWalking.length) {
      this.currentImg = 0;
    }
  }

  animate() {
    this.moveLeft();
  }
}
