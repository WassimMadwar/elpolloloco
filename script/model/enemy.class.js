class Enemy extends MovableObj {
  imgEnemyWalking = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  // currentImg = 0;
  static countchicken = 0;
  constructor() {
    super();
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 300 + Enemy.countchicken * 100;
    Enemy.countchicken++;
    this.y = 100;
    this.height = 25;
    this.width = 15;
    this.loadImgMoving(this.imgEnemyWalking);
    this.animateEnemyWalking();
    this.animate();
  }

  animateEnemyWalking() {
    this.walkInterval = setInterval(() => {
      if (Game.paused) return;
      this.playAnimation(this.imgEnemyWalking);
    }, 200);
  }

  animate() {
    this.moveLeft();
  }

  die() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    clearInterval(this.walkInterval);
    clearInterval(this.moveInterval);
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
  }

  isReadyToRemove() {
    return this.isDying && new Date().getTime() - this.deathTime > 2000;
  }
}
