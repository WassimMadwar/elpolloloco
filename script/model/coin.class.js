class Coin extends MovableObj {
  height = 40;
  width = 40;
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
