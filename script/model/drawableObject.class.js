class DrawableObj {
  x = 50;
  y = 50;
  img;
  imageCache = {};
  currentImg = 0;

  constructor() {}

  /**
   * Loads a single image and sets it as the current image of the object.
   * @param {string} path - The path of the image file.
   */
  loadImg(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Moves to the next frame of an animation and starts again at 0 after the last frame.
   * @param {number} arrLenght - The number of frames in the animation.
   */
  updateCurrentImg(arrLenght) {
    this.currentImg++;
    if (this.currentImg >= arrLenght) {
      this.currentImg = 0;
    }
  }

  /**
   * Preloads all images of an animation into the image cache.
   * @param {string[]} arr - The paths of the animation frames.
   */
  loadImgMoving(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
