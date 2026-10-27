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

  get aspectRatio() {
    return this.viewWidth / this.viewHeight;
  }

  listenForResize() {
    const schedule = () => this.scheduleFit();
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
  }

  scheduleFit() {
    if (this.resizeScheduled) return;
    this.resizeScheduled = true;
    requestAnimationFrame(() => {
      this.resizeScheduled = false;
      this.fit();
    });
  }

  getAvailableSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  getPixelRatio() {
    return Math.min(window.devicePixelRatio || 1, Viewport.MAX_PIXEL_RATIO);
  }

  fit() {
    const available = this.getAvailableSize();
    this.cssWidth = Math.floor(
      Math.min(
        available.width,
        available.height * this.aspectRatio,
        Viewport.MAX_CSS_WIDTH,
      ),
    );
    this.cssHeight = Math.floor(this.cssWidth / this.aspectRatio);
    this.applyCssSize();
    this.applyBackingSize();
  }

  applyCssSize() {
    this.canvas.style.width = `${this.cssWidth}px`;
    this.canvas.style.height = `${this.cssHeight}px`;
  }

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
