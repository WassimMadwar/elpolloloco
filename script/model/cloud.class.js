class Cloud extends MovableObj {
  y = 10;
  height = 100;
  width = 100;
  constructor(path, x) {
    super();
    this.loadImg(path);
    this.x = x;
    this.animate();
  }
  animate() {
    this.moveLeft();
  }
}
