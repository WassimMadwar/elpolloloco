class  Endboss extends MovableObj {
    x= 200;
    y= 50;
    imgEnemyWalking = [
        "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/img/4_enemie_boss_chicken/2_alert/G12.png",

    ]
    constructor(parameters) {
        super();
        this.loadImg("assets/img/4_enemie_boss_chicken/2_alert/G5.png");
        this.loadImgMoving(this.imgEnemyWalking);
    }
}