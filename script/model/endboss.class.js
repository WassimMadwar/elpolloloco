class Endboss extends MovableObj {
  x = 1820;
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
  imgBossHurt = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  imgBossDead = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  hitsTaken = 0;
  maxHits = 10;
  triggerDistance = 400;

  constructor() {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImgMoving(this.imgBossWalking);
    this.loadImgMoving(this.imgBossHurt);
    this.loadImgMoving(this.imgBossDead);
    this.animate();
    this.startThrowingChicks();
  }

  animate() {
    this.animateInterval = setInterval(() => {
      if (Game.paused) return;
      if (this.isDying) {
        this.playAnimation(this.imgBossDead);
      } else if (this.isHurt()) {
        this.playAnimation(this.imgBossHurt);
      } else {
        this.playAnimation(this.imgBossWalking);
      }
    }, 200);
  }

  stop() {
    clearInterval(this.animateInterval);
    clearTimeout(this.throwTimeout);
    clearInterval(this.throwInterval);
  }

  hit() {
    if (this.isDying) return;
    this.hitsTaken++;
    this.gameMatch.statusBars.setEndbossHealth(
      100 - (this.hitsTaken / this.maxHits) * 100,
    );
    if (this.hitsTaken >= this.maxHits) {
      this.die();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  checkReached(character) {
    if (this.gameMatch.statusBars.visbilityEndBossBar) return;
    if (character.x >= this.x - this.triggerDistance) {
      this.gameMatch.statusBars.showEndbossBar();
    }
  }

  die() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    clearTimeout(this.throwTimeout);
    clearInterval(this.throwInterval);
  }

  startThrowingChicks() {
    this.throwTimeout = setTimeout(() => {
      this.throwInterval = setInterval(() => this.throwChick(), 12000);
    }, 16000);
  }

  throwChick() {
    if (Game.paused || this.isDying || !this.gameMatch) return;
    const chick = new SmallChick(this.x, this.y);
    this.gameMatch.level.enemies.push(chick);
  }
}
