class Control {
  muted = false;
  sounds = [];
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
    this.speakerIcon.src = "assets/img/control/speaker_15x15.png";
    this.muteIcon.src = "assets/img/control/mute_15x15.png";
    this.exitIcon.src = "assets/img/control/exit_15x15.png";
    this.reloadIcon.src = "assets/img/control/replay_15x15.png";
    this.playIcon.src = "assets/img/control/play_15x15.png";
    this.startBgImg.src = "assets/img/9_intro_outro_screens/start/startscreen_2.png";
    this.jumpIcon.src = "assets/img/control/jump.png";
    this.rightIcon.src = "assets/img/control/right_15x15.png";
    this.leftIcon.src = "assets/img/control/prev_arrow_15x15.png";
    this.throwIcon.src = "assets/img/control/space_60x15.png";
  }

  startMatch() {}
  endMatch() {}
  pauseMatch() {}
  resultMatch() {}

  registerSound(audio) {
    audio.muted = this.muted;
    this.sounds.push(audio);
  }

  swwitchSound() {
    this.muted = !this.muted;
    this.sounds.forEach((sound) => {
      sound.muted = this.muted;
    });
  }

  togglePauseMenu() {
    this.pauseMenuOpen = !this.pauseMenuOpen;
    Game.paused = this.pauseMenuOpen;
  }

  isHit(pos, x, y) {
    return (
      pos.x >= x &&
      pos.x <= x + this.iconSize &&
      pos.y >= y &&
      pos.y <= y + this.iconSize
    );
  }

  drawStartScreen() {
    this.ctx.drawImage(
      this.startBgImg,
      0,
      0,
      this.renderCanvas.width,
      this.renderCanvas.height,
    );
    this.drawStartPanel();
  }

  getStartPanelWidth() {
    return this.renderCanvas.width ;
  }

  getStartPanelHeight() {
    return this.renderCanvas.height ;
  }

  getStartPanelX() {
    return (this.renderCanvas.width - this.getStartPanelWidth()) / 2;
  }

  getStartPanelY() {
    return (this.renderCanvas.height - this.getStartPanelHeight()) / 2;
  }

  getStartRowX() {
    return this.getStartPanelX() + 6;
  }

  getStartRowY(index) {
    return this.getStartPanelY()  + index * 8;
  }

  drawStartPanel() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
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
      this.drawIconLabelRow(this.playIcon, "Start Match", this.getStartRowX(), y);
      this.drawSoundRow(y);
    }
    this.drawMovementRow(this.getMovementRowY());
  }

  getPauseRowItemX(index) {
    const segmentWidth = (this.renderCanvas.width - 20) / 4;
    return 10 + segmentWidth * index;
  }

  drawPauseTopRow(y) {
    this.drawIconLabelRow(this.playIcon, "Resume", this.getPauseRowItemX(0), y);
    this.drawIconLabelRow(this.reloadIcon, "Restart", this.getPauseRowItemX(1), y);
    this.drawIconLabelRow(this.exitIcon, "Exit", this.getPauseRowItemX(2), y);
    this.drawIconLabelRow(this.getSoundIcon(), "Sound", this.getPauseRowItemX(3), y);
  }

  getSoundIcon() {
    return this.muted ? this.muteIcon : this.speakerIcon;
  }

  getSpeakerRowX() {
    return this.renderCanvas.width - this.iconSize - this.padding;
  }

  drawSoundRow(y) {
    const iconX = this.getSpeakerRowX();
    this.ctx.drawImage(this.getSoundIcon(), iconX, y, this.iconSize, this.iconSize);
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Sound", iconX - 4, y + this.iconSize / 2);
    this.ctx.textAlign = "left";
  }

  getMovementRowY() {
    return this.renderCanvas.height - this.iconSize - 4;
  }

  drawIconLabelRow(icon, label, x, y) {
    this.ctx.drawImage(icon, x, y, this.iconSize, this.iconSize);
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + this.iconSize + 4, y + this.iconSize / 2);
  }

  drawMovementRow(y) {
    const startX = 10;
    const segmentWidth = (this.renderCanvas.width - 20) / 4;
    this.drawIconLabelRow(this.leftIcon, "Left", startX, y);
    this.drawIconLabelRow(this.jumpIcon, "Jump", startX + segmentWidth, y);
    this.drawIconLabelRow(this.rightIcon, "Right", startX + segmentWidth * 2, y);
    this.drawIconLabelRow(this.throwIcon, "Throw Bottle", startX + segmentWidth * 3, y);
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
    if (this.isHit(pos, this.getStartRowX(), y)) {
      this.gameMatch.startGame();
      return;
    }
    if (this.isHit(pos, this.getSpeakerRowX(), y)) {
      this.swwitchSound();
    }
  }

  handlePauseTopRowClick(pos) {
    const y = this.getStartRowY(1);
    if (this.isHit(pos, this.getPauseRowItemX(0), y)) {
      this.togglePauseMenu();
      return;
    }
    if (this.isHit(pos, this.getPauseRowItemX(1), y)) {
      this.gameMatch.restartGame();
      return;
    }
    if (this.isHit(pos, this.getPauseRowItemX(2), y)) {
      this.gameMatch.exitToStartScreen();
      return;
    }
    if (this.isHit(pos, this.getPauseRowItemX(3), y)) {
      this.swwitchSound();
    }
  }
}
