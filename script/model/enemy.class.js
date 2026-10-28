class Enemy extends MovableObj {
  imgEnemyWalking = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  offset = { top: 2, left: 1, right: 1, bottom: 2 };
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

  /**
   * Starts the walking animation (every 200 ms). Skipped while the game is paused.
   */
  animateEnemyWalking() {
    this.walkInterval = setInterval(() => {
      if (Game.paused) return;
      this.playAnimation(this.imgEnemyWalking);
    }, 200);
  }

  /**
   * Starts the movement of the enemy: it walks continuously to the left.
   */
  animate() {
    this.moveLeft();
  }

  /**
   * Stops the enemy completely: the walking animation, the movement and the gravity.
   */
  stop() {
    clearInterval(this.walkInterval);
    clearInterval(this.moveInterval);
    clearInterval(this.gravityInterval);
  }

  /**
   * Starts the death of the enemy.
   * Saves the time of death, stops walking and shows the dead image.
   */
  die() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    clearInterval(this.walkInterval);
    clearInterval(this.moveInterval);
    this.loadImg("assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
  }

  /**
   * Checks whether the dead enemy has been shown long enough (2 seconds) to be removed.
   * @returns {boolean} True if the enemy can be removed from the level.
   */
  isReadyToRemove() {
    return this.isDying && new Date().getTime() - this.deathTime > 2000;
  }
}
