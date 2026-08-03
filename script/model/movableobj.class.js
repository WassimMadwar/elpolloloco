class MovableObj {
  x = 50;
  y = 50;
  img;
  height = 75;
  width = 50;
  loadImg(path){
    this.img = new Image();
    this.img.src = path;
  }
  moveRight() {
    log("Move Right");
  }
}
