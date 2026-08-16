const level1 = new Level(
  [new Enemy(), new Enemy(), new Enemy(),new Enemy(),new Enemy(),new Enemy(), new Endboss()],
  [
    new Cloud("assets/img/5_background/layers/4_clouds/1.png", 0),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png", 225),
    new Cloud("assets/img/5_background/layers/4_clouds/1.png", 450),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png", 775),
    new Cloud("assets/img/5_background/layers/4_clouds/1.png", 900),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png", 1225),
    new Cloud("assets/img/5_background/layers/4_clouds/1.png", 1550),
    new Cloud("assets/img/5_background/layers/4_clouds/2.png", 1875),
    new Cloud("assets/img/5_background/layers/4_clouds/1.png", 2150),
      new Cloud("assets/img/5_background/layers/4_clouds/2.png", 2675),
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
      "assets/img/5_background/layers/3_third_layer/1.png",
      300 * 2
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/1.png",
      300 * 2
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/1.png",
      300 * 2
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
        new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 3),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 3
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 3
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 3
    ),
        new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 4),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/1.png",
      300 * 4
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/1.png",
      300 * 4
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/1.png",
      300 * 4
    ),
        new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 5),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/2.png",
      300 * 5
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/2.png",
      300 * 5
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/2.png",
      300 * 5
    ),
            new BackgroundObj("assets/img/5_background/layers/air.png", 300 * 6),
    new BackgroundObj(
      "assets/img/5_background/layers/3_third_layer/1.png",
      300 * 6
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/2_second_layer/1.png",
      300 * 6
    ),
    new BackgroundObj(
      "assets/img/5_background/layers/1_first_layer/1.png",
      300 * 6
    ),
  ],
  [
    new Coin(750, 90),
    new Coin(861, 30),
    new Coin(972, 90),
    new Coin(1083,30),
    new Coin(1194, 90),
    new Coin(1305, 30),
    new Coin(1416, 90),
    new Coin(1528, 30),
    new Coin(1639, 90),
    new Coin(1750, 30),
  ],
);
level1;
