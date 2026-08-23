class StatusBars {
  health = new HealthBar();
  coin = new CoinBar();
  bottle = new BottleBar();

  draw(ctx) {
    this.drawBar(ctx, this.health);
    this.drawBar(ctx, this.coin);
    this.drawBar(ctx, this.bottle);
  }

  drawBar(ctx, bar) {
    ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height);
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

  reset() {
    this.setHealth(100);
    this.coin.setPercentge(0);
    this.bottle.setPercentge(0);
  }
}
