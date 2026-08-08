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

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    log("Move Right");
  }

  loadImgMoving(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(arrImg) {
    let path = arrImg[this.currentImg];
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
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 10); // 60 FPS log("Move Left");
  }
}
