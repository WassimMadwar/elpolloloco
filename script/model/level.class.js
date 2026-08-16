class Level {
  enemies;
  clouds;
  backgrounds;
  coins;
  bottles;
  levelEndX =1800;
  constructor(enemies, clouds, backgrounds, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgrounds = backgrounds;
    this.coins = coins;
    this.bottles = bottles;
  }
}
