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
  maxHits = 8;
  triggerDistance = 300;
  // Back-and-forth movement after the first hit: half of the character's
  // walking speed (8 units per 100 ms), in steps of 1000 / 25 ms.
  patrolRange = 100;
  patrolStep = 1.6;
  patrolStartX;
  patrolDirection = 1;

  constructor() {
    super();
    this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImgMoving(this.imgBossWalking);
    this.loadImgMoving(this.imgBossHurt);
    this.loadImgMoving(this.imgBossDead);
    this.animate();
    this.startThrowingChicks();
  }

  /**
   * Starts the animation interval (every 200 ms).
   * Plays the dead, hurt or walking animation depending on the boss state.
   */
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

  /**
   * Stops the boss completely: the animation, the movement and the throwing of chicks.
   */
  stop() {
    clearInterval(this.animateInterval);
    clearInterval(this.patrolInterval);
    clearTimeout(this.throwTimeout);
    clearInterval(this.throwInterval);
  }

  /**
   * Starts moving the boss back and forth (25 times per second):
   * patrolRange units to the right of his start position and back again.
   * Only starts once. Skipped while the game is paused.
   */
  startPatrol() {
    if (this.patrolInterval) return;
    this.patrolStartX = this.x;
    this.patrolInterval = setInterval(() => {
      if (Game.paused) return;
      this.patrol();
    }, 1000 / 25);
  }

  /**
   * Moves the boss one step and turns around at the ends of the patrol range.
   */
  patrol() {
    this.x += this.patrolStep * this.patrolDirection;
    if (this.x >= this.patrolStartX + this.patrolRange) {
      this.x = this.patrolStartX + this.patrolRange;
      this.patrolDirection = -1;
    } else if (this.x <= this.patrolStartX) {
      this.x = this.patrolStartX;
      this.patrolDirection = 1;
    }
  }

  /**
   * Handles a bottle hit on the boss.
   * Plays the hurt sound, counts the hit and updates the boss health bar.
   * The first hit starts the back-and-forth movement. The boss dies after maxHits hits.
   */
  hit() {
    if (this.isDying) return;
    this.gameMatch.control.playEffect("bossHurt");
    this.hitsTaken++;
    this.startPatrol();
    this.gameMatch.statusBars.setEndbossHealth(
      100 - (this.hitsTaken / this.maxHits) * 100,
    );
    if (this.hitsTaken >= this.maxHits) {
      this.die();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Shows the boss health bar and plays the boss sound once
   * when the character comes within the trigger distance.
   * @param {Character} character - The playable character.
   */
  checkReached(character) {
    if (this.gameMatch.statusBars.visbilityEndBossBar) return;
    if (character.x >= this.x - this.triggerDistance) {
      this.gameMatch.statusBars.showEndbossBar();
      this.gameMatch.control.playEffect("showBoss");
    }
  }

  /**
   * Starts the death of the boss.
   * Saves the time of death, stops the movement and the throwing of chicks and ends the match.
   */
  die() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    clearInterval(this.patrolInterval);
    clearTimeout(this.throwTimeout);
    clearInterval(this.throwInterval);
    this.gameMatch.endMatch();
  }

  /**
   * Starts throwing chicks: the first one after 16 seconds, then one every 12 seconds.
   */
  startThrowingChicks() {
    this.throwTimeout = setTimeout(() => {
      this.throwInterval = setInterval(() => this.throwChick(), 6000);
    }, 1000);
  }

  /**
   * Throws a new chick from the boss position into the level and plays the chick sound.
   * Skipped while the game is paused or the boss is dying.
   */
  throwChick() {
    if (Game.paused || this.isDying || !this.gameMatch) return;
    const chick = new SmallChick(this.x, this.y);
    this.gameMatch.level.enemies.push(chick);
    this.gameMatch.control.playEffect("chickJump");
  }
}
