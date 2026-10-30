class StatusBars {
  health = new HealthBar();
  coin = new CoinBar();
  bottle = new BottleBar();
  endbossImages = [
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];
  endboss = new StatusBar(this.endbossImages, 100, 0, 0);
  endbossPaddingRight = 5;
  endbossPaddingTop = 20;
  // Start and end of the blue fill inside the boss bar image (in image pixels).
  endbossFillStart = 97;
  endbossFillEnd = 585;
  // Start and end of the green fill inside the bottle bar image (in image pixels).
  bottleFillStart = 61;
  bottleFillEnd = 581;
  visbilityEndBossBar = false;

  /**
   * Draws the health, coin and bottle bars, and the boss bar once it is visible.
   * The bottle bar is filled exactly (one step per bottle).
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  draw(ctx) {
    this.drawBar(ctx, this.health);
    this.drawBar(ctx, this.coin);
    this.drawExactBar(
      ctx,
      this.bottle,
      this.bottle.x,
      this.bottle.y,
      this.bottleFillStart,
      this.bottleFillEnd,
    );
    if (this.visbilityEndBossBar) this.drawEndbossBar(ctx);
  }

  /**
   * Draws a single status bar at its position.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {StatusBar} bar - The bar to draw.
   */
  drawBar(ctx, bar) {
    ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height);
  }

  /**
   * Draws the boss health bar in the top right corner, below the control icons,
   * filled exactly (one step per hit).
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  drawEndbossBar(ctx) {
    const bar = this.endboss;
    this.drawExactBar(
      ctx,
      bar,
      Game.VIEW_WIDTH - bar.width - this.endbossPaddingRight,
      this.endbossPaddingTop,
      this.endbossFillStart,
      this.endbossFillEnd,
    );
  }

  /**
   * Draws a bar with an exact fill level instead of the 20 % image steps.
   * The empty bar is drawn first, then the left part of the full bar on top of it.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {StatusBar} bar - The bar to draw (its first image is empty, its last one full).
   * @param {number} x - The x position of the bar.
   * @param {number} y - The y position of the bar.
   * @param {number} fillStart - Where the fill starts in the image (in image pixels).
   * @param {number} fillEnd - Where the fill ends in the image (in image pixels).
   */
  drawExactBar(ctx, bar, x, y, fillStart, fillEnd) {
    const emptyImg = bar.imageCache[bar.imgBar[0]];
    const fullImg = bar.imageCache[bar.imgBar[bar.imgBar.length - 1]];
    ctx.drawImage(emptyImg, x, y, bar.width, bar.height);
    if (bar.percentge <= 0 || !fullImg.naturalWidth) return;
    const sourceWidth = this.getFillWidth(fullImg, bar.percentge, fillStart, fillEnd);
    const scale = bar.width / fullImg.naturalWidth;
    ctx.drawImage(
      fullImg,
      0,
      0,
      sourceWidth,
      fullImg.naturalHeight,
      x,
      y,
      sourceWidth * scale,
      bar.height,
    );
  }

  /**
   * Returns how much of the full bar image is drawn for a fill level.
   * @param {HTMLImageElement} fullImg - The image of the full bar.
   * @param {number} percentage - The fill level from 0 to 100.
   * @param {number} fillStart - Where the fill starts in the image (in image pixels).
   * @param {number} fillEnd - Where the fill ends in the image (in image pixels).
   * @returns {number} The width in image pixels, measured from the left edge of the image.
   */
  getFillWidth(fullImg, percentage, fillStart, fillEnd) {
    if (percentage >= 100) return fullImg.naturalWidth;
    return fillStart + ((fillEnd - fillStart) * percentage) / 100;
  }

  /**
   * Updates the health bar of the character.
   * @param {number} percentage - The health from 0 to 100.
   */
  setHealth(percentage) {
    this.health.setPercentge(percentage);
  }

  /**
   * Updates the coin bar from the number of collected coins.
   * @param {number} count - The number of collected coins.
   * @param {number} total - The number of coins in the level.
   */
  setCoins(count, total) {
    this.coin.setPercentge((count / total) * 100);
  }

  /**
   * Updates the bottle bar from the number of throwable bottles.
   * @param {number} throwable - The number of bottles the character can throw.
   * @param {number} max - The maximum number of bottles.
   */
  setBottles(throwable, max) {
    this.bottle.setPercentge((throwable / max) * 100);
  }

  /**
   * Makes the boss health bar visible.
   */
  showEndbossBar() {
    this.visbilityEndBossBar = true;
  }

  /**
   * Updates the boss health bar.
   * @param {number} percentage - The boss health from 0 to 100.
   */
  setEndbossHealth(percentage) {
    this.endboss.setPercentge(percentage);
  }

  /**
   * Resets all bars for a new match: full health, empty coin and bottle bars
   * and a hidden, full boss bar.
   */
  reset() {
    this.setHealth(100);
    this.coin.setPercentge(0);
    this.bottle.setPercentge(0);
    this.visbilityEndBossBar = false;
    this.setEndbossHealth(100);
  }
}
