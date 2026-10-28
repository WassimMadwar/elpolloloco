class SmallChick extends Enemy {
  imgEnemyWalking = [
    "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  offset = { top: 2, left: 2, right: 2, bottom: 2 };

  constructor(x, y) {
    super();
    this.setupSmallChick(x, y);
    this.startFallTrajectory();
  }

  /**
   * Places the chick at its start position, sets its size
   * and starts the walking animation of the small chick.
   * @param {number} x - The start x position (the boss position).
   * @param {number} y - The start y position (the boss position).
   */
  setupSmallChick(x, y) {
    clearInterval(this.walkInterval);
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 25;
    this.loadImg(this.imgEnemyWalking[0]);
    this.loadImgMoving(this.imgEnemyWalking);
    this.animateEnemyWalking();
  }

  /**
   * Throws the chick slightly upward and lets it fall down to the ground.
   */
  startFallTrajectory() {
    this.groundY = 100;
    this.speedY = 3;
    this.applyGravity();
  }

  /**
   * Starts the death of the chick.
   * Saves the time of death, stops walking and falling and shows the dead image.
   */
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
