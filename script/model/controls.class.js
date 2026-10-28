class Control {
  static SOUND_EFFECTS = {
    jump: "assets/sounds/jumpCharacter.mp3",
    hurt: "assets/sounds/hartcharactr.wav",
    dead: "assets/sounds/deadChracter.wav",
    coin: "assets/sounds/tackeCoin.wav",
    takeBottle: "assets/sounds/takeBottele.wav",
    throwBottle: "assets/sounds/throwBottele.wav",
    chickJump: "assets/sounds/jumpSmallchick.mp3",
    showBoss: "assets/sounds/showBoss.wav",
    bossHurt: "assets/sounds/hartEndBoss.mp3",
    snore: "assets/sounds/snor.mp3",
  };
  static LOOPING_EFFECTS = ["snore"];
  static HIT_PADDING = 4;

  muted = Control.loadMuted();
  sounds = [];
  effects = {};
  gameMatch;
  ctx;
  renderCanvas;
  speakerIcon = new Image();
  muteIcon = new Image();
  exitIcon = new Image();
  reloadIcon = new Image();
  playIcon = new Image();
  iconSize = 15;
  padding = 5;
  gap = 5;
  gameStarted = false;
  pauseMenuOpen = false;
  startBgImg = new Image();
  jumpIcon = new Image();
  rightIcon = new Image();
  leftIcon = new Image();
  throwIcon = new Image();

  constructor() {
    this.speakerIcon.src = "assets/img/control/speaker_15x151.png";
    this.muteIcon.src = "assets/img/control/mute_15x151.png";
    this.exitIcon.src = "assets/img/control/exit_15x15.png";
    this.reloadIcon.src = "assets/img/control/replay_15x15.png";
    this.playIcon.src = "assets/img/control/play_15x15.png";
    this.startBgImg.src =
      "assets/img/9_intro_outro_screens/start/startscreen_2.png";
    this.jumpIcon.src = "assets/img/control/jump.png";
    this.rightIcon.src = "assets/img/control/right_15x15.png";
    this.leftIcon.src = "assets/img/control/prev_arrow_15x15.png";
    this.throwIcon.src = "assets/img/control/space_60x15.png";
    this.bgMusic = this.createSound("assets/sounds/soundBackground.mp3", 0.3);
    this.bgMusic.loop = true;
    this.startMusic();
    this.loadEffects();
  }

  startMatch() {}
  endMatch() {}
  pauseMatch() {}
  resultMatch() {}

  static loadMuted() {
    try {
      return localStorage.getItem("elPolloLocoMuted") === "true";
    } catch (e) {
      return false;
    }
  }

  saveMuted() {
    try {
      localStorage.setItem("elPolloLocoMuted", this.muted);
    } catch (e) {}
  }

  createSound(src, volume = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    this.registerSound(audio);
    return audio;
  }

  registerSound(audio) {
    audio.muted = this.muted;
    this.sounds.push(audio);
  }

  loadEffect(name, src, volume = 0.3) {
    this.effects[name] = this.createSound(src, volume);
  }

  loadEffects() {
    Object.entries(Control.SOUND_EFFECTS).forEach(([name, src]) =>
      this.loadEffect(name, src),
    );
    Control.LOOPING_EFFECTS.forEach((name) => {
      this.effects[name].loop = true;
    });
  }

  stopEffect(name) {
    const effect = this.effects[name];
    effect.pause();
    effect.currentTime = 0;
  }

  playEffect(name, restart = true) {
    const effect = this.effects[name];
    if (!restart && !effect.paused && !effect.ended) return;
    effect.currentTime = 0;
    effect.play().catch(() => {});
  }

  startMusic() {
    this.bgMusic.play().catch(() => this.playMusicOnFirstInput());
  }

  playMusicOnFirstInput() {
    const events = ["pointerdown", "keydown"];
    const resume = () => {
      events.forEach((e) => window.removeEventListener(e, resume));
      this.bgMusic.play().catch(() => {});
    };
    events.forEach((e) => window.addEventListener(e, resume));
  }

  swwitchSound() {
    this.muted = !this.muted;
    this.saveMuted();
    this.sounds.forEach((sound) => {
      sound.muted = this.muted;
    });
  }

  togglePauseMenu() {
    this.pauseMenuOpen = !this.pauseMenuOpen;
    Game.paused = this.pauseMenuOpen;
  }

  isInArea(pos, left, top, right, bottom) {
    const p = Control.HIT_PADDING;
    return (
      pos.x >= left - p &&
      pos.x <= right + p &&
      pos.y >= top - p &&
      pos.y <= bottom + p
    );
  }

  getLabelWidth(label) {
    this.ctx.font = "8px Arial";
    return this.ctx.measureText(label).width;
  }

  isLabelRowHit(pos, x, y, label) {
    const right = x + this.iconSize + 4 + this.getLabelWidth(label);
    return this.isInArea(pos, x, y, right, y + this.iconSize);
  }

  isSoundRowHit(pos, iconX, y) {
    const left = iconX - 4 - this.getLabelWidth("Sound");
    return this.isInArea(pos, left, y, iconX + this.iconSize, y + this.iconSize);
  }

  drawStartScreen() {
    this.drawImageCover(this.startBgImg, Game.VIEW_WIDTH, Game.VIEW_HEIGHT);
    this.drawStartPanel();
  }

  drawImageCover(img, width, height) {
    if (!img.naturalWidth) return;
    const scale = Math.max(
      width / img.naturalWidth,
      height / img.naturalHeight,
    );
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (img.naturalWidth - sourceWidth) / 2;
    const sourceY = (img.naturalHeight - sourceHeight) / 2;
    this.ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      width,
      height,
    );
  }

  getStartPanelWidth() {
    return Game.VIEW_WIDTH;
  }

  getStartPanelHeight() {
    return Game.VIEW_HEIGHT;
  }

  getStartPanelX() {
    return (Game.VIEW_WIDTH - this.getStartPanelWidth()) / 2;
  }

  getStartPanelY() {
    return (Game.VIEW_HEIGHT - this.getStartPanelHeight()) / 2;
  }

  getStartRowX() {
    return this.getStartPanelX() + 6;
  }

  getStartRowY(index) {
    return this.getStartPanelY() + index * 8;
  }

  drawStartPanel() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(
      this.getStartPanelX(),
      this.getStartPanelY(),
      this.getStartPanelWidth(),
      this.getStartPanelHeight(),
    );
    this.drawStartPanelRows();
  }

  drawStartPanelRows() {
    const y = this.getStartRowY(1);
    if (this.gameStarted) {
      this.drawPauseTopRow(y);
    } else {
      this.drawIconLabelRow(
        this.playIcon,
        "Start Match",
        this.getStartRowX(),
        y,
      );
      this.drawSoundRow(y);
    }
    this.drawMovementRow(this.getMovementRowY());
  }

  getPauseRowItemX(index) {
    const segmentWidth = (Game.VIEW_WIDTH - 20) / 4;
    return 10 + segmentWidth * index;
  }

  drawPauseTopRow(y) {
    this.drawIconLabelRow(this.playIcon, "Resume", this.getPauseRowItemX(0), y);
    this.drawIconLabelRow(
      this.reloadIcon,
      "Restart",
      this.getPauseRowItemX(1),
      y,
    );
    this.drawIconLabelRow(this.exitIcon, "Exit", this.getPauseRowItemX(2), y);
    this.drawIconLabelRow(
      this.getSoundIcon(),
      "Sound",
      this.getPauseRowItemX(3),
      y,
    );
  }

  getSoundIcon() {
    return this.muted ? this.muteIcon : this.speakerIcon;
  }

  getSpeakerRowX() {
    return Game.VIEW_WIDTH - this.iconSize - this.padding;
  }

  drawSoundRow(y) {
    const iconX = this.getSpeakerRowX();
    this.ctx.drawImage(
      this.getSoundIcon(),
      iconX,
      y,
      this.iconSize,
      this.iconSize,
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Sound", iconX - 4, y + this.iconSize / 2);
    this.ctx.textAlign = "left";
  }

  getMovementRowY() {
    return Game.VIEW_HEIGHT - this.iconSize - 5;
  }

  drawIconLabelRow(
    icon,
    label,
    x,
    y,
    iconWidth = this.iconSize,
    iconHeight = this.iconSize,
  ) {
    this.ctx.drawImage(icon, x, y, iconWidth, iconHeight);
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + iconWidth + 4, y + iconHeight / 2);
  }

  drawMovementRow(y) {
    const startX = 10;
    const segmentWidth = (Game.VIEW_WIDTH - 50) / 4;
    this.drawIconLabelRow(this.leftIcon, "Left", startX, y);
    this.drawIconLabelRow(this.jumpIcon, "Jump", startX + segmentWidth, y);
    this.drawIconLabelRow(
      this.rightIcon,
      "Right",
      startX + segmentWidth * 2,
      y,
    );
    this.drawIconLabelRow(
      this.throwIcon,
      "Throw Bottle",
      startX + segmentWidth * 3,
      y + 2,
      45,
      11.3,
    );
  }

  handleStartScreenClick(pos) {
    if (this.gameStarted) {
      this.handlePauseTopRowClick(pos);
      return;
    }
    this.handlePreGameTopRowClick(pos);
  }

  handlePreGameTopRowClick(pos) {
    const y = this.getStartRowY(1);
    if (this.isLabelRowHit(pos, this.getStartRowX(), y, "Start Match")) {
      this.gameMatch.startGame();
      return;
    }
    if (this.isSoundRowHit(pos, this.getSpeakerRowX(), y)) {
      this.swwitchSound();
    }
  }

  handlePauseTopRowClick(pos) {
    const y = this.getStartRowY(1);
    if (this.isLabelRowHit(pos, this.getPauseRowItemX(0), y, "Resume")) {
      this.togglePauseMenu();
      return;
    }
    if (this.isLabelRowHit(pos, this.getPauseRowItemX(1), y, "Restart")) {
      this.gameMatch.restartGame();
      return;
    }
    if (this.isLabelRowHit(pos, this.getPauseRowItemX(2), y, "Exit")) {
      this.gameMatch.exitToStartScreen();
      return;
    }
    if (this.isLabelRowHit(pos, this.getPauseRowItemX(3), y, "Sound")) {
      this.swwitchSound();
    }
  }
}
