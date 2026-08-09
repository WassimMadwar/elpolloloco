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
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 10);
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (!this.isAboveGround()) {
          this.y = this.groundY;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < this.groundY;
  }

  isColliding(movableObj) {
    return (
      this.x + this.width > movableObj.x &&
      this.x < movableObj.x &&
      this.y + this.height > movableObj.y &&
      this.y < movableObj.y + movableObj.height
    );
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
    let timeDifference = new Date().getTime() - this.lastHit;
    timeDifference = timeDifference / 60;
    // console.log(timeDifference)
    // resolveImageIndex();
    // this.helthCheck();
    return timeDifference < 5;
  }
// 
  isDead() {
    return this.energy == 0;
  }
}
