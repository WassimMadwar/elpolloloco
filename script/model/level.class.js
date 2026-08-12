class Level {
  enemies;
  clouds;
  backgrounds;
  levelEndX =1800;
  constructor(enemies, clouds, backgrounds) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgrounds = backgrounds;
  }
}
