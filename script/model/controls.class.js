class Control {
  muted = false;
  sounds = [];
  gameMatch;
  ctx;
  renderCanvas;
  panelOpen = false;
  speakerIcon = new Image();
  muteIcon = new Image();
  replayIcon = new Image();
  playIcon = new Image();
  iconSize = 15;
  padding = 5;
  gap = 5;
  gameStarted = false;
  startBgImg = new Image();
  jumpIcon = new Image();
  rightIcon = new Image();
  leftIcon = new Image();
  throwIcon = new Image();

  constructor() {
    this.speakerIcon.src = "assets/img/control/speaker_15x15.png";
    this.muteIcon.src = "assets/img/control/mute_15x15.png";
    this.replayIcon.src = "assets/img/control/replay_15x15.png";
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

  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  closePanel() {
    this.panelOpen = false;
  }

  getPanelWidth() {
    return this.padding * 2 + this.iconSize * 2 + this.gap;
  }

  getPanelHeight() {
    return this.padding * 2 + this.iconSize;
  }

  getPanelX(anchorRightX) {
    return anchorRightX - this.getPanelWidth();
  }

  getSoundIconX(panelX) {
    return panelX + this.padding;
  }

  getReplayIconX(panelX) {
    return this.getSoundIconX(panelX) + this.iconSize + this.gap;
  }

  drawPanel(ctx, anchorRightX, anchorY) {
    if (!this.panelOpen) return;
    const x = this.getPanelX(anchorRightX);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(x, anchorY, this.getPanelWidth(), this.getPanelHeight());
    this.drawPanelIcons(ctx, x, anchorY);
  }

  drawPanelIcons(ctx, panelX, panelY) {
    const soundIcon = this.muted ? this.muteIcon : this.speakerIcon;
    const y = panelY + this.padding;
    ctx.drawImage(soundIcon, this.getSoundIconX(panelX), y, this.iconSize, this.iconSize);
    ctx.drawImage(this.replayIcon, this.getReplayIconX(panelX), y, this.iconSize, this.iconSize);
  }

  handlePanelClick(pos, anchorRightX, anchorY) {
    if (!this.panelOpen) return false;
    const panelX = this.getPanelX(anchorRightX);
    const y = anchorY + this.padding;
    if (this.isHit(pos, this.getSoundIconX(panelX), y)) {
      this.swwitchSound();
      return true;
    }
    if (this.isHit(pos, this.getReplayIconX(panelX), y)) {
      this.gameMatch.restartGame();
      return true;
    }
    return false;
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
    const x = this.getStartRowX();
    // this.drawIconLabelRow(this.speakerIcon, "Sound", x, this.getStartRowY(0));
    this.drawIconLabelRow(this.playIcon, "Start Match", x, this.getStartRowY(1));
    this.drawMovementRow(this.getMovementRowY());
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
    this.drawIconLabelRow(this.throwIcon, "Throw", startX + segmentWidth * 3, y);
  }

  handleStartScreenClick(pos) {
    const x = this.getStartRowX();
    if (this.isHit(pos, x, this.getStartRowY(1))) {
      this.gameMatch.startGame();
      return;
    }
    if (this.isHit(pos, x, this.getStartRowY(0))) {
      this.swwitchSound();
    }
  }
}
