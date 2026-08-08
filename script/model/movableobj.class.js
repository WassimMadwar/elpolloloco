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

  drawViewFrame(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
