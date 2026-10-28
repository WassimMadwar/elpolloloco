class StatusBar extends DrawableObj {
  static imgHelth = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];
  percentge;
  x;
  y;
  width = 60;
  height = 10;
  imgBar;

  constructor(imgBar = StatusBar.imgHelth, startPercentage = 100, x = 5, y = 0) {
    super();
    this.imgBar = imgBar;
    this.x = x;
    this.y = y;
    this.loadImgMoving(this.imgBar);
    this.setPercentge(startPercentage);
  }

  /**
   * Sets the fill level of the bar and shows the matching image.
   * @param {number} percentge - The fill level from 0 to 100.
   */
  setPercentge(percentge) {
    this.percentge = percentge;
    let imgBarPath = this.imgBar[this.resolveImageIndex()];
    this.img = this.imageCache[imgBarPath];
  }

  /**
   * Finds the image that matches the current fill level (in steps of 20 %).
   * @returns {number} The index of the image, from 0 (empty) to 5 (full).
   */
  resolveImageIndex() {
    if (this.percentge >= 100) return 5;
    if (this.percentge >= 80) return 4;
    if (this.percentge >= 60) return 3;
    if (this.percentge >= 40) return 2;
    if (this.percentge >= 20) return 1;
    return 0;
  }
}
