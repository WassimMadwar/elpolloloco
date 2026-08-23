class Character extends MovableObj {
  height = 100;
  y = -10;
  groundY = 32;
  gameMatch;
  imageCharWalking = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  imageCharJump = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
  ];
  imageCharDead = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  imageCharHurt = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  imageCharIdle = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  imageCharSleep = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  lastActionTime = new Date().getTime();

  constructor() {
    super().loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImgMoving(this.imageCharJump);
    this.loadImgMoving(this.imageCharWalking);
    this.loadImgMoving(this.imageCharDead);
    this.loadImgMoving(this.imageCharHurt);
    this.loadImgMoving(this.imageCharIdle);
    this.loadImgMoving(this.imageCharSleep);
    this.animateCharacterWalking();
    this.applyGravity();
    this.clearIntervalAfterDead();
  }

  stop() {
    clearInterval(this.controlInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);
  }

  clearIntervalAfterDead() {
    if (this.isDying) {
      if (this.y > this.gameMatch.renderCanvas.height) {
        this.stop();
      }
      return true;
    }
    return false;
  }

    animateCharacterWalking() {
    this.handleCharacterMovement();
    this.handleCharacterAnimation();
  }

  handleCharacterMovement() {
    this.controlInterval = setInterval(() => {
      if (this.clearIntervalAfterDead()) {
        return;
      }
      if (Game.paused) return;
      this.handelMoveRight();
      this.handelMoveLeft();
      if (this.gameMatch.keyAction.up) {
        this.jump();
      }
      this.updateCamera();
    }, 100);
  }

  handelMoveRight() {
    if (
      this.gameMatch.keyAction.right &&
      this.x < this.gameMatch.level.levelEndX
    ) {
      this.moveRight();
      this.updateActivity();
    }
  }

  handelMoveLeft() {
    if (this.gameMatch.keyAction.left && this.x > 0) {
      this.x -= 8;
      this.otherDirection = true;
      this.updateActivity();
    }
  }

  updateActivity() {
    this.lastActionTime = new Date().getTime();
  }

  isWalking() {
    return this.gameMatch.keyAction.right || this.gameMatch.keyAction.left;
  }

  isSleeping() {
    return new Date().getTime() - this.lastActionTime >= 15000;
  }

  handleCharacterAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.isDying) {
        return;
      }
      if (Game.paused) return;
      if (this.isDead()) {
        this.playAnimation(this.imageCharDead);
      } else if (this.isHurt()) {
        this.playAnimation(this.imageCharHurt);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.imageCharJump);
      } else if (this.isWalking()) {
        this.playAnimation(this.imageCharWalking);
      } else if (this.isSleeping()) {
        this.playAnimation(this.imageCharSleep);
      } else {
        this.playAnimation(this.imageCharIdle);
      }
    }, 100);
  }

  updateCamera() {
    this.gameMatch.camera_x = -this.x + 50;
  }
  
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 6;
      this.updateActivity();
    }
  }

  hit() {
    if (this.isDying) return;
    this.energy -= 20;
    if (this.energy <= 0) {
      this.energy = 0;
      this.gameMatch.statusBars.setHealth(0);
      this.dieCahracter();
    } else {
      this.lastHit = new Date().getTime();
      this.gameMatch.statusBars.setHealth(this.energy);
    }
  }

  dieCahracter() {
    if (this.isDying) return;
    this.isDying = true;
    this.deathTime = new Date().getTime();
    this.speedY = 8;
    this.img = this.imageCache[this.imageCharDead[5]];
  }

  getHitboxY() {
    return this.y + 40;
  }

  getHitboxHeight() {
    return 60;
  }
}
