class Endboss extends MovableObj {
  x = 520;
  y = 30;
  height = 100;
  width = 100;
  imgBossWalking = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  
  constructor(parameters) {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImgMoving(this.imgBossWalking);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.imgBossWalking);
    }, 200);
  }
}
