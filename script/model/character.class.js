class Character extends MovableObj {
  height = 100;
  y = 30;
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
  }

  animateCharacterWalking() {

    setInterval(() => {
      if (this.gameMatch.keyAction.right ) {
        this.x += 8;
        this.otherDirection = false;
      }
      if (this.gameMatch.keyAction.left) {
        this.x -= 8;
        this.otherDirection = true;
      }
      this.gameMatch.camera_x = -this.x + 100;
    }, 100);

    setInterval(() => {
      if (this.gameMatch.keyAction.right || this.gameMatch.keyAction.left) {
        let path = this.imageCharWalking[this.currentImg];
      this.img = this.imageCache[path];
      this.updateCurrentImg();
      }
    }, 100);

  }

  updateCurrentImg() {
    this.currentImg++;
    if (this.currentImg >= this.imageCharWalking.length) {
      this.currentImg = 0;
    }
  }
  jump() {}
}
