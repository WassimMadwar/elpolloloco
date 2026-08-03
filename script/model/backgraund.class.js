class BackgroundObj extends MovableObj {
    constructor(imgPath,bgX,bgY) {
        super();
        this.loadImg(imgPath);
        this.x = bgX;
        this.y = bgY;
    }
    // constructor(imgPath) {
    //     super();
    //     this.loadImg(imgPath);
    //     // this.x = bgX;
    //     // this.y = bgY;
    // }
}