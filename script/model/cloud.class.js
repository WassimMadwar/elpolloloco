class Cloud extends MovableObj {
  y = 10;
  height = 100;
  width = 100;
  // path;
  constructor(path) {
    super();
    this.loadImg(path);
    //    this.y = 2 + Math.random() * 30;
    this.x = 30 + Math.random() * 250;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }
}
