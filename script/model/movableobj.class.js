class MovableObj {
  x = 50;
  y = 50;
  img;
  height = 75;
  width = 50;
  imageCache = {};
  speed = 1;
  otherDirection = false;
  currentImg = 0;
  speedY = 0;
  acceleration = 0.4;
  groundY = 130;

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    this.x += 8;
    this.otherDirection = false;
  }

  loadImgMoving(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(arrImg) {
    let path = arrImg[this.currentImg % arrImg.length];
    this.img = this.imageCache[path];
    this.updateCurrentImg(arrImg.length);
  }

  updateCurrentImg(arrLenght) {
    this.currentImg++;
    if (this.currentImg >= arrLenght) {
      this.currentImg = 0;
    }
  }
  moveLeft() {
    // this.otherDirection = true;
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 10); // 60 FPS log("Move Left");
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
}
