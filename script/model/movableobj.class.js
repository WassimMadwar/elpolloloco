class MovableObj {
  x = 50;
  y = 50;
  img;
  height = 75;
  width = 50;
  imageCache = {};
  speed = 1;

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

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 10); // 60 FPS log("Move Left");
  }
}
