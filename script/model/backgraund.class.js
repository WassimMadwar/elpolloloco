class BackgroundObj extends MovableObj {
  height = 184;
  width = 300;
  constructor(imgPath, bgX) {
    super();
    this.loadImg(imgPath);
    this.x = bgX;
    this.y = 150 - this.height;
  }
  // constructor(imgPath) {
  //     super();
  //     this.loadImg(imgPath);
  //     // this.x = bgX;
  //     // this.y = bgY;
  // }
}
