class Viewport {
  static MAX_CSS_WIDTH = 960;
  static MAX_PIXEL_RATIO = 2;
  canvas;
  ctx;
  viewWidth;
  viewHeight;
  cssWidth = 0;
  cssHeight = 0;
  scale = 1;
  resizeScheduled = false;

  constructor(canvas, ctx, viewWidth, viewHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.fit();
    this.listenForResize();
  }

  /**
   * The aspect ratio of the game view (width divided by height, 2 for 300 x 150).
   * @returns {number} The aspect ratio.
   */
  get aspectRatio() {
    return this.viewWidth / this.viewHeight;
  }

  /**
   * Fits the canvas again whenever the window is resized or the device is rotated.
   */
  listenForResize() {
    const schedule = () => this.scheduleFit();
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
  }

  /**
   * Fits the canvas in the next animation frame.
   * Several resize events in a row lead to only one fit.
   */
  scheduleFit() {
    if (this.resizeScheduled) return;
    this.resizeScheduled = true;
    requestAnimationFrame(() => {
      this.resizeScheduled = false;
      this.fit();
    });
  }

  /**
   * Returns the size of the page that is available for the canvas.
   * Uses the real page size, which is not affected by the browser zoom after a rotation.
   * @returns {{width: number, height: number}} The available size in CSS pixels.
   */
  getAvailableSize() {
    const root = document.documentElement;
    return { width: root.clientWidth, height: root.clientHeight };
  }

  /**
   * Returns the maximum width of the canvas.
   * Desktops are limited to MAX_CSS_WIDTH, touch devices use the full screen.
   * @returns {number} The maximum width in CSS pixels.
   */
  getMaxCssWidth() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    return isTouch ? Infinity : Viewport.MAX_CSS_WIDTH;
  }

  /**
   * Returns the pixel density of the screen, limited to MAX_PIXEL_RATIO.
   * @returns {number} The device pixel ratio.
   */
  getPixelRatio() {
    return Math.min(window.devicePixelRatio || 1, Viewport.MAX_PIXEL_RATIO);
  }

  /**
   * Sizes the canvas to the largest area with the game's aspect ratio that fits the page,
   * so the game is never stretched.
   */
  fit() {
    const available = this.getAvailableSize();
    this.cssWidth = Math.floor(
      Math.min(
        available.width,
        available.height * this.aspectRatio,
        this.getMaxCssWidth(),
      ),
    );
    this.cssHeight = Math.floor(this.cssWidth / this.aspectRatio);
    this.applyCssSize();
    this.applyBackingSize();
  }

  /**
   * Sets the display size of the canvas on the page.
   */
  applyCssSize() {
    this.canvas.style.width = `${this.cssWidth}px`;
    this.canvas.style.height = `${this.cssHeight}px`;
  }

  /**
   * Sets the real pixel size of the canvas for the screen density, so it stays sharp,
   * and scales the drawing so that the game always uses its own units (300 x 150).
   */
  applyBackingSize() {
    const pixelRatio = this.getPixelRatio();
    this.canvas.width = Math.round(this.cssWidth * pixelRatio);
    this.canvas.height = Math.round(this.cssHeight * pixelRatio);
    this.scale = this.canvas.width / this.viewWidth;
    this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.canvas.height / this.viewHeight,
      0,
      0,
    );
    this.ctx.imageSmoothingQuality = "high";
  }
}
