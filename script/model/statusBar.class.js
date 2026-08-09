class StatusBar extends DrawableObj {
  _percentge = 100;
  x;
  y;
  width;
  height;
  imgHelth = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  constructor() {
    // maybe it should be load image(loadImg(path))
    super();
    this.loadImgMoving(this.imgHelth);
    this.setPercentge(100);
    this.x = 5;
    this.y = 0;
    this.height = 10;
    this.width = 60;
  }

  setPercentge(percentge) {
    this._percentge = percentge;
    let imgHelthPath = this.imgHelth[this.resolveImageIndex()];
    this.img = this.imageCache[imgHelthPath];
  }

  resolveImageIndex() {
    if (this._percentge == 100) {
      return 5;
    } else if (this._percentge == 80) {
      return 4;
    } else if (this._percentge == 60) {
      return 3;
    } else if (this._percentge == 40) {
      return 2;
    } else if (this._percentge == 20) {
      return 1;
    } else {
      return 0;
    }
  }

  //helthCheck(){
  //   if (this.isHurt()) {
  //     this._percentge -=20;
  //   }
  // }
}
