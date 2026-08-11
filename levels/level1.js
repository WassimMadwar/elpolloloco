const level1 = new Level(
  [new Enemy(300), new Enemy(350), new Enemy(400), new Endboss()],
  [
    new Cloud("assets/img/5_background/layers/4_clouds/1.png"),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png"),
    new Cloud("assets/img/5_background/layers/4_clouds/1.png"),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png"),
  ],
  [
    new BackgroundObj("assets/img/5_background/layers/air.png", -300),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      -300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      -300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      -300,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 0),
    new BackgroundObj("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 2),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 2,
    ),
    new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 3),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 3,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 3,
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 3,
    ),
  ],
);
level1;
