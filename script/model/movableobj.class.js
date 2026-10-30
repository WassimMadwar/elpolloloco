class MovableObj extends DrawableObj {
  height = 75;
  width = 50;
  speed = 1;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.4;
  groundY = 130;
  energy = 100;
  lastHit = 0;
  isDying = false;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Shows the next frame of an animation.
   * @param {string[]} arrImg - The image paths of the animation.
   */
  playAnimation(arrImg) {
    let path = arrImg[this.currentImg % arrImg.length];
    this.img = this.imageCache[path];
    this.updateCurrentImg(arrImg.length);
  }

  /**
   * Moves the object 5 units to the right and lets it look to the right.
   */
  moveRight() {
    this.x += 5;
    this.otherDirection = false;
  }

  /**
   * Starts moving the object continuously to the left (10 times per second).
   * Skipped while the game is paused.
   */
  moveLeft() {
    this.moveInterval = setInterval(() => {
      if (Game.paused) return;
      this.x -= this.speed;
    }, 1000 / 10);
  }

  /**
   * Checks whether the object is moving downward.
   * @returns {boolean} True if the object is falling.
   */
  isFalling() {
    return this.speedY < 0;
  }

  /**
   * Starts the gravity (25 times per second).
   * Lets the object fall until it reaches the ground. A dying object keeps falling.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (Game.paused) return;
      this.applyGravityStep();
    }, 1000 / 25);
  }

  /**
   * Moves the object one gravity step and stops it on the ground.
   * A dying object keeps falling through the ground.
   */
  applyGravityStep() {
    if (this.isDying) {
      this.goDown();
      return;
    }
    if (this.isAboveGround() || this.speedY > 0) {
      this.goDown();
      if (!this.isAboveGround()) {
        this.y = this.groundY;
        this.speedY = 0;
      }
    }
  }

  /**
   * Moves the object by its vertical speed and reduces the speed by the acceleration.
   */
  goDown() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  /**
   * Checks whether the object is above the ground.
   * @returns {boolean} True if the object is in the air.
   */
  isAboveGround() {
    return this.y < this.groundY;
  }

  /**
   * Checks whether the collision boxes of this object and another object overlap.
   * @param {MovableObj} movableObj - The other object.
   * @returns {boolean} True if both objects touch each other.
   */
  isColliding(movableObj) {
    const a = this.getHitbox();
    const b = movableObj.getHitbox();
    return (
      a.right > b.left &&
      a.left < b.right &&
      a.bottom > b.top &&
      a.top < b.bottom
    );
  }

  /**
   * Returns the collision box of the object without its transparent edges (see offset).
   * @returns {{left: number, right: number, top: number, bottom: number}} The edges of the box in game units.
   */
  getHitbox() {
    return {
      left: this.x + this.offset.left,
      right: this.x + this.width - this.offset.right,
      top: this.y + this.offset.top,
      bottom: this.y + this.height - this.offset.bottom,
    };
  }

  /**
   * Reduces the energy by 5 after a hit and saves the time of the hit.
   */
  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks whether the last hit was less than 5 seconds ago.
   * @returns {boolean} True if the object is still hurt.
   */
  isHurt() {
    return new Date().getTime() - this.lastHit < 1000;
  }

  /**
   * Checks whether the object has no energy left or is dying.
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    return this.energy == 0 || this.isDying;
  }
}
