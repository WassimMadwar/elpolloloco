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
  // Transparent space around the visible image that should not collide.
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  playAnimation(arrImg) {
    let path = arrImg[this.currentImg % arrImg.length];
    this.img = this.imageCache[path];
    this.updateCurrentImg(arrImg.length);
  }

  moveRight() {
    this.x += 8;
    this.otherDirection = false;
  }

  moveLeft() {
    this.moveInterval = setInterval(() => {
      if (Game.paused) return;
      this.x -= this.speed;
    }, 1000 / 10);
  }

  isFalling() {
    return this.speedY < 0;
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (Game.paused) return;
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
    }, 1000 / 25);
  }

  goDown() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  isAboveGround() {
    return this.y < this.groundY;
  }

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

  getHitbox() {
    return {
      left: this.x + this.offset.left,
      right: this.x + this.width - this.offset.right,
      top: this.y + this.offset.top,
      bottom: this.y + this.height - this.offset.bottom,
    };
  }

  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    return new Date().getTime() - this.lastHit < 5000;
  }
  //
  isDead() {
    return this.energy == 0 || this.isDying;
  }
}
