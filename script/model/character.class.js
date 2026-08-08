class Character extends MovableObj {
  height = 100;
  y = -10;
  gameMatch;
  imageCharWalking = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  currentImg = 0;


  constructor() {
    super().loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImgMoving(this.imageCharWalking);
    this.animateCharacterWalking();
    this.applyGravity();
  }

  animateCharacterWalking() {
    setInterval(() => {
      if (
        this.gameMatch.keyAction.right &&
        this.x < this.gameMatch.level.levelEndX
      ) {
        this.x += 8;
        this.otherDirection = false;
      }
      if (this.gameMatch.keyAction.left && this.x > 0) {
        this.x -= 8;
        this.otherDirection = true;
      }
      this.gameMatch.camera_x = -this.x + 50;
    }, 100);

    setInterval(() => {
      if (this.gameMatch.keyAction.right || this.gameMatch.keyAction.left) {
        this.playAnimation(this.imageCharWalking);
      }
    }, 100);
  }

  jump() {}
}
