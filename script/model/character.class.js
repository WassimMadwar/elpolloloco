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
    // "assets/img/2_character_pepe/3_jump/J-31.png",
    // "assets/img/2_character_pepe/3_jump/J-36.png",
    // "assets/img/2_character_pepe/3_jump/J-37.png",
    // "assets/img/2_character_pepe/3_jump/J-38.png",
    // "assets/img/2_character_pepe/3_jump/J-39.png",
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

  constructor() {
    super().loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImgMoving(this.imageCharJump);
    this.loadImgMoving(this.imageCharWalking);
    this.loadImgMoving(this.imageCharDead);
    this.loadImgMoving(this.imageCharHurt);
    this.animateCharacterWalking();
    this.applyGravity();
    this.clearIntervalAfterDead();
  }

  clearIntervalAfterDead() {
    if (this.isDying) {
      if (this.y > this.gameMatch.renderCanvas.height) {
        clearInterval(this.controlInterval);
        clearInterval(this.animationInterval);
        clearInterval(this.gravityInterval);
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
    }
  }

  handelMoveLeft() {
    if (this.gameMatch.keyAction.left && this.x > 0) {
      this.x -= 8;
      this.otherDirection = true;
    }
  }

  handleCharacterAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.isDying) {
        return;
      }
      if (this.isDead()) {
        this.playAnimation(this.imageCharDead);
      } else if (this.isHurt()) {
        this.playAnimation(this.imageCharHurt);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.imageCharJump);
      }
      if (
        (!this.isAboveGround() && this.gameMatch.keyAction.right) ||
        this.gameMatch.keyAction.left
      ) {
        this.playAnimation(this.imageCharWalking);
      }
    }, 100);
  }

  updateCamera() {
    this.gameMatch.camera_x = -this.x + 50;
  }
  
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 6;
    }
  }

  hit() {
    if (this.isDying) return;
    this.energy -= 20;
    if (this.energy <= 0) {
      this.energy = 0;
      this.gameMatch.helthBarChar.setPercentge(0);
      this.dieCahracter();
    } else {
      this.lastHit = new Date().getTime();
      this.gameMatch.helthBarChar.setPercentge(this.energy);
    }
  }

  dieCahracter() {
    if (this.isDying) return;
    this.isDying = true;
    this.speedY = 8;
    this.img = this.imageCache[this.imageCharDead[5]];
  }
}
