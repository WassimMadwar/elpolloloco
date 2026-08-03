class Character extends MovableObj {
  height = 100;
  y = 30;
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
    this.animateCharacter();
  }
  animateCharacter() {
    setInterval(() => {
      let path = this.imageCharWalking[this.currentImg];
      this.img = this.imageCache[path];
      this.updateCurrentImg();
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
