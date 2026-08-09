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
  // currentImg = 0;
  imageCharDead = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];
  constructor() {
    super().loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImgMoving(this.imageCharJump);
    this.loadImgMoving(this.imageCharWalking);
    this.loadImgMoving(this.imageCharDead);
    this.animateCharacterWalking();
    this.applyGravity();
  }

  animateCharacterWalking() {
    setInterval(() => {
      if (
        this.gameMatch.keyAction.right &&
        this.x < this.gameMatch.level.levelEndX
      ) {
        this.moveRight();
      }
      if (this.gameMatch.keyAction.left && this.x > 0) {
        this.x -= 8;
        this.otherDirection = true;
      }
      if (this.gameMatch.keyAction.up) {
        this.jump();
      }
      this.gameMatch.camera_x = -this.x + 50;
    }, 100);

    setInterval(() => {
      if (this.isDead()) {
        console.log("kokoo");
        this.playAnimation(this.imageCharDead);
      }
      if (this.isAboveGround()) {
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

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 6;
    }
  }
}
