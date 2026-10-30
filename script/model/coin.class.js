class Coin extends MovableObj {
  height = 40;
  width = 40;
  // ===== COIN HITBOX: transparent edges that do not count for pickup =====
  // The visible coin is only the middle of the image: a 14 x 14 box inside 40 x 40.
  offset = { top: 13, left: 13, right: 13, bottom: 13 };
  // =======================================================================
  imgCoinSpin = [
    "assets/img/8_coin/coin_1.png",
    "assets/img/8_coin/coin_2.png",
  ];

  constructor(x, y) {
    super();
    this.x =  x;
    this.y =  y;
    this.loadImg(this.imgCoinSpin[0]);
    this.loadImgMoving(this.imgCoinSpin);
    this.animateCoinSpin();
  }

  animateCoinSpin() {
    this.spinInterval = setInterval(() => {
      if (Game.paused) return;
      this.playAnimation(this.imgCoinSpin);
    }, 300);
  }

  stop() {
    clearInterval(this.spinInterval);
  }
}
