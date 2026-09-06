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
  visbilityEndBossBar = false;

  draw(ctx) {
    this.drawBar(ctx, this.health);
    this.drawBar(ctx, this.coin);
    this.drawBar(ctx, this.bottle);
    if (this.visbilityEndBossBar) this.drawEndbossBar(ctx);
  }

  drawBar(ctx, bar) {
    ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height);
  }

  drawEndbossBar(ctx) {
    const x = ctx.canvas.width - this.endboss.width - this.endbossPaddingRight;
    ctx.drawImage(this.endboss.img, x, this.endbossPaddingTop, this.endboss.width, this.endboss.height);
  }

  setHealth(percentage) {
    this.health.setPercentge(percentage);
  }

  setCoins(count, total) {
    this.coin.setPercentge((count / total) * 100);
  }

  setBottles(throwable, max) {
    this.bottle.setPercentge((throwable / max) * 100);
  }

  showEndbossBar() {
    this.visbilityEndBossBar = true;
  }

  setEndbossHealth(percentage) {
    this.endboss.setPercentge(percentage);
  }

  reset() {
    this.setHealth(100);
    this.coin.setPercentge(0);
    this.bottle.setPercentge(0);
    this.visbilityEndBossBar = false;
    this.setEndbossHealth(100);
  }
}
