class MovableObj {
  x = 50;
  y = 50;
  img;
  height = 75;
  width = 50;
  imageCache = {};

  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }
  moveRight() {
    log("Move Right");
  }
  // loadImgMoving(arr) {
  //   this.img = new Image();
  //   this.img.src = arr[0];
  // }
  loadImgMoving(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
