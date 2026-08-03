class Enemy extends MovableObj {
  constructor(parameters) {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 150 + Math.random() * 100;
    this.y = 100;
    this.height = 25;
    this.width = 15;
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.x -= 0.15;
    }, 1000 / 60); // 60 FPS
  }

  animateEnemy() {
    setInterval(() => {
      let path = this.imageCharWalking[this.currentImg];
      this.img = this.imageCache[path];
      this.updateCurrentImg();
    }, 100);
  }

  updateCurrentImg() {
    this.currentImg++;
    if (this.currentImg >= this.imageCharWalking.length) {
      this.currentImg = 0;
    }
  }
}
