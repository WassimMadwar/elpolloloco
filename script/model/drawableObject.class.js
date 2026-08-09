class DrawableObj {
  x = 50;
  y = 50;
  img;
  imageCache = {};
  currentImg = 0;

  constructor(parameters) {}

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  updateCurrentImg(arrLenght) {
    this.currentImg++;
    if (this.currentImg >= arrLenght) {
      this.currentImg = 0;
    }
  }

  drawViewFrame(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  loadImgMoving(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
