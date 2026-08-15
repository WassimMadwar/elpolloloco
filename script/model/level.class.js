class Level {
  enemies;
  clouds;
  backgrounds;
  coins;
  levelEndX =1800;
  constructor(enemies, clouds, backgrounds, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgrounds = backgrounds;
    this.coins = coins;
  }
}
