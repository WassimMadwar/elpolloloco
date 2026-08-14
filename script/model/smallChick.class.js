class SmallChick extends Enemy {
  imgEnemyWalking = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor(x, y) {
    super();
    this.setupSmallChick(x, y);
    this.startFallTrajectory();
  }

  setupSmallChick(x, y) {
    clearInterval(this.walkInterval);
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 15;
    this.loadImg(this.imgEnemyWalking[0]);
    this.loadImgMoving(this.imgEnemyWalking);
    this.animateEnemyWalking();
  }

  startFallTrajectory() {
    this.groundY = 110 ;
    this.speedY = 3;
    this.applyGravity();
  }

  die() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    clearInterval(this.walkInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.gravityInterval);
    this.loadImg("assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png");
  }
}
