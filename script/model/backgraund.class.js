class BackgroundObj extends MovableObj {
  height = 150;
  width = 300;
  constructor(imgPath, bgX, bgY) {
    super();
    this.loadImg(imgPath);
    this.x = bgX;
    this.y = bgY;
  }
  // constructor(imgPath) {
  //     super();
  //     this.loadImg(imgPath);
  //     // this.x = bgX;
  //     // this.y = bgY;
  // }
}
