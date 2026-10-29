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
    glassBreak: "assets/sounds/glassbreaking.mp3",
    smallDeath: "assets/sounds/smalldeath.mp3",
  };
  static LOOPING_EFFECTS = ["snore"];
  static HIT_PADDING = 4;

  muted = Control.loadMuted();
  sounds = [];
  effects = {};
  gameMatch;
  ctx;
  renderCanvas;
  iconSize = 15;
  padding = 5;
  gap = 5;
  gameStarted = false;
  pauseMenuOpen = false;
  startBgImg = new Image();

  constructor() {
    this.startBgImg.src =
      "assets/img/9_intro_outro_screens/start/startscreen_2.png";
    this.bgMusic = this.createSound("assets/sounds/soundBackground.mp3", 0.3);
    this.bgMusic.loop = true;
    this.startMusic();
    this.loadEffects();
  }

  /**
   * Reads the saved mute setting from the local storage.
   * @static
   * @returns {boolean} True if the sound was muted last time, otherwise false.
   */
  static loadMuted() {
    try {
      return localStorage.getItem("elPolloLocoMuted") === "true";
    } catch (e) {
      return false;
    }
  }

  /**
   * Saves the current mute setting in the local storage.
   */
  saveMuted() {
    try {
      localStorage.setItem("elPolloLocoMuted", this.muted);
    } catch (e) {}
  }

  /**
   * Creates a new audio object and registers it for the mute setting.
   * @param {string} src - The path of the sound file.
   * @param {number} [volume=1] - The volume between 0 and 1.
   * @returns {HTMLAudioElement} The created audio object.
   */
  createSound(src, volume = 1) {
    const audio = new Audio(src);
    audio.volume = volume;
    this.registerSound(audio);
    return audio;
  }

  /**
   * Applies the current mute setting to a sound and adds it to the list of all sounds.
   * @param {HTMLAudioElement} audio - The sound to register.
   */
  registerSound(audio) {
    audio.muted = this.muted;
    this.sounds.push(audio);
  }

  /**
   * Loads a single sound effect and stores it under its name.
   * @param {string} name - The name used to play the effect later.
   * @param {string} src - The path of the sound file.
   * @param {number} [volume=0.3] - The volume between 0 and 1.
   */
  loadEffect(name, src, volume = 0.3) {
    this.effects[name] = this.createSound(src, volume);
  }

  /**
   * Loads all sound effects from SOUND_EFFECTS
   * and enables looping for the effects listed in LOOPING_EFFECTS.
   */
  loadEffects() {
    Object.entries(Control.SOUND_EFFECTS).forEach(([name, src]) =>
      this.loadEffect(name, src),
    );
    Control.LOOPING_EFFECTS.forEach((name) => {
      this.effects[name].loop = true;
    });
  }

  /**
   * Stops a sound effect and rewinds it to the beginning.
   * @param {string} name - The name of the effect.
   */
  stopEffect(name) {
    const effect = this.effects[name];
    effect.pause();
    effect.currentTime = 0;
  }

  /**
   * Plays a sound effect from the beginning.
   * @param {string} name - The name of the effect.
   * @param {boolean} [restart=true] - If false, the effect is not restarted while it is still playing.
   */
  playEffect(name, restart = true) {
    const effect = this.effects[name];
    if (!restart && !effect.paused && !effect.ended) return;
    effect.currentTime = 0;
    effect.play().catch(() => {});
  }

  /**
   * Starts the background music.
   * If the browser blocks autoplay, the music starts with the first user input.
   */
  startMusic() {
    this.bgMusic.play().catch(() => this.playMusicOnFirstInput());
  }

  /**
   * Waits for the first click, touch or key press and then starts the background music.
   */
  playMusicOnFirstInput() {
    const events = ["pointerdown", "keydown"];
    const resume = () => {
      events.forEach((e) => window.removeEventListener(e, resume));
      this.bgMusic.play().catch(() => {});
    };
    events.forEach((e) => window.addEventListener(e, resume));
  }

  /**
   * Switches all sounds between muted and unmuted and saves the setting.
   */
  swwitchSound() {
    this.muted = !this.muted;
    this.saveMuted();
    this.sounds.forEach((sound) => {
      sound.muted = this.muted;
    });
  }

  /**
   * Opens or closes the pause menu and pauses or resumes the game.
   */
  togglePauseMenu() {
    this.pauseMenuOpen = !this.pauseMenuOpen;
    Game.paused = this.pauseMenuOpen;
  }

  /**
   * Checks whether a position lies inside an area, including the extra HIT_PADDING.
   * @param {{x: number, y: number}} pos - The position in game units.
   * @param {number} left - The left edge of the area.
   * @param {number} top - The top edge of the area.
   * @param {number} right - The right edge of the area.
   * @param {number} bottom - The bottom edge of the area.
   * @returns {boolean} True if the position is inside the area.
   */
  isInArea(pos, left, top, right, bottom) {
    const p = Control.HIT_PADDING;
    return (
      pos.x >= left - p &&
      pos.x <= right + p &&
      pos.y >= top - p &&
      pos.y <= bottom + p
    );
  }

  /**
   * Measures the width of a label in the menu font.
   * @param {string} label - The text to measure.
   * @returns {number} The width of the text in game units.
   */
  getLabelWidth(label) {
    this.ctx.font = "8px Arial";
    return this.ctx.measureText(label).width;
  }

  /**
   * Checks whether a position hits a menu entry made of an icon and a label on its right.
   * @param {{x: number, y: number}} pos - The position in game units.
   * @param {number} x - The x position of the icon.
   * @param {number} y - The y position of the icon.
   * @param {string} label - The label next to the icon.
   * @returns {boolean} True if the icon or the label was hit.
   */
  isLabelRowHit(pos, x, y, label) {
    const right = x + this.iconSize + 4 + this.getLabelWidth(label);
    return this.isInArea(pos, x, y, right, y + this.iconSize);
  }

  /**
   * Checks whether a position hits the sound entry on the start screen
   * (label on the left, icon on the right).
   * @param {{x: number, y: number}} pos - The position in game units.
   * @param {number} iconX - The x position of the sound icon.
   * @param {number} y - The y position of the sound icon.
   * @returns {boolean} True if the icon or the label was hit.
   */
  isSoundRowHit(pos, iconX, y) {
    const left = iconX - 4 - this.getLabelWidth("Sound");
    return this.isInArea(pos, left, y, iconX + this.iconSize, y + this.iconSize);
  }

  /**
   * Draws the start screen: the background image and the start panel.
   */
  drawStartScreen() {
    this.drawImageCover(this.startBgImg, Game.VIEW_WIDTH, Game.VIEW_HEIGHT);
    this.drawStartPanel();
  }

  /**
   * Draws an image so that it fills the given area without distortion.
   * Parts of the image that do not fit are cut off evenly on both sides.
   * @param {HTMLImageElement} img - The image to draw.
   * @param {number} width - The width of the area.
   * @param {number} height - The height of the area.
   */
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

  /**
   * Returns the width of the start panel.
   * @returns {number} The width in game units.
   */
  getStartPanelWidth() {
    return Game.VIEW_WIDTH;
  }

  /**
   * Returns the height of the start panel.
   * @returns {number} The height in game units.
   */
  getStartPanelHeight() {
    return Game.VIEW_HEIGHT;
  }

  /**
   * Returns the x position of the start panel (centered horizontally).
   * @returns {number} The x position in game units.
   */
  getStartPanelX() {
    return (Game.VIEW_WIDTH - this.getStartPanelWidth()) / 2;
  }

  /**
   * Returns the y position of the start panel (centered vertically).
   * @returns {number} The y position in game units.
   */
  getStartPanelY() {
    return (Game.VIEW_HEIGHT - this.getStartPanelHeight()) / 2;
  }

  /**
   * Returns the x position where the rows of the start panel begin.
   * @returns {number} The x position in game units.
   */
  getStartRowX() {
    return this.getStartPanelX() + 6;
  }

  /**
   * Returns the y position of a row in the start panel.
   * @param {number} index - The number of the row.
   * @returns {number} The y position in game units.
   */
  getStartRowY(index) {
    return this.getStartPanelY() + index * 8;
  }

  /**
   * Draws the semi-transparent panel and its rows
   * (used on the start screen and in the pause menu).
   */
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

  /**
   * Draws the top row and the help row of the panel.
   * Before the match: Start Match and Sound. During the match: the pause menu entries.
   */
  drawStartPanelRows() {
    const y = this.getStartRowY(1);
    if (this.gameStarted) {
      this.drawPauseTopRow(y);
    } else {
      this.drawIconLabelRow(
        "play",
        "Start Match",
        this.getStartRowX(),
        y,
      );
      this.drawSoundRow(y);
    }
    this.drawMovementRow(this.getMovementRowY());
  }

  /**
   * Returns the x position of an entry in the pause menu row.
   * @param {number} index - The position of the entry.
   * @param {number} count - The number of entries in the row.
   * @returns {number} The x position in game units.
   */
  getPauseRowItemX(index, count) {
    const segmentWidth = (Game.VIEW_WIDTH - 20) / count;
    return 10 + segmentWidth * index;
  }

  /**
   * Returns the entries of the pause menu: Resume, Restart, Exit and Sound.
   * After the end of the match (won or lost) there is no Resume entry.
   * @returns {{icon: string, label: string, action: Function}[]} The menu entries.
   */
  getPauseMenuItems() {
    const items = [
      { icon: "replay", label: "Restart", action: () => this.gameMatch.restartGame() },
      { icon: "exit", label: "Exit", action: () => this.gameMatch.exitToStartScreen() },
      { icon: this.getSoundIcon(), label: "Sound", action: () => this.swwitchSound() },
    ];
    if (!this.gameMatch.matchOver) {
      items.unshift({ icon: "play", label: "Resume", action: () => this.togglePauseMenu() });
    }
    return items;
  }

  /**
   * Draws the pause menu entries, evenly spread over the row.
   * @param {number} y - The y position of the row.
   */
  drawPauseTopRow(y) {
    const items = this.getPauseMenuItems();
    items.forEach((item, index) => {
      const x = this.getPauseRowItemX(index, items.length);
      this.drawIconLabelRow(item.icon, item.label, x, y);
    });
  }

  /**
   * Returns the icon that matches the current mute setting.
   * @returns {string} The name of the mute icon or the sound icon.
   */
  getSoundIcon() {
    return this.muted ? "mute" : "sound";
  }

  /**
   * Returns the x position of the sound icon on the start screen (right edge).
   * @returns {number} The x position in game units.
   */
  getSpeakerRowX() {
    return Game.VIEW_WIDTH - this.iconSize - this.padding;
  }

  /**
   * Draws the sound entry of the start screen: the label and the sound icon on its right.
   * @param {number} y - The y position of the row.
   */
  drawSoundRow(y) {
    const iconX = this.getSpeakerRowX();
    RoundButton.drawInBox(
      this.ctx,
      this.getSoundIcon(),
      iconX,
      y,
      this.iconSize,
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "right";
    this.ctx.fillText("Sound", iconX - 4, y + this.iconSize / 2);
    this.ctx.textAlign = "left";
  }

  /**
   * Returns the y position of the help row at the bottom of the panel.
   * @returns {number} The y position in game units.
   */
  getMovementRowY() {
    return Game.VIEW_HEIGHT - this.iconSize - 5;
  }

  /**
   * Draws a round icon button with a white label on its right.
   * @param {string} icon - The name of the icon (see RoundButton).
   * @param {string} label - The text next to the icon.
   * @param {number} x - The x position of the icon.
   * @param {number} y - The y position of the icon.
   */
  drawIconLabelRow(icon, label, x, y) {
    RoundButton.drawInBox(this.ctx, icon, x, y, this.iconSize);
    this.drawLabel(label, x + this.iconSize + 4, y + this.iconSize / 2);
  }

  /**
   * Draws a white label, vertically centered on a position.
   * @param {string} label - The text to draw.
   * @param {number} x - The left edge of the text.
   * @param {number} y - The vertical center of the text.
   */
  drawLabel(label, x, y) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "8px Arial";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x, y);
  }

  /**
   * Draws the help row with the controls: Left, Jump, Right and Throw Bottle.
   * @param {number} y - The y position of the row.
   */
  drawMovementRow(y) {
    const startX = 10;
    const segmentWidth = (Game.VIEW_WIDTH - 50) / 4;
    this.drawIconLabelRow("left", "Left", startX, y);
    this.drawIconLabelRow("jump", "Jump", startX + segmentWidth, y);
    this.drawIconLabelRow("right", "Right", startX + segmentWidth * 2, y);
    this.drawThrowKey(startX + segmentWidth * 3, y);
  }

  /**
   * Draws the Space key with the label "Throw Bottle" on its right.
   * @param {number} x - The x position of the key.
   * @param {number} y - The y position of the row.
   */
  drawThrowKey(x, y) {
    const width = 45;
    const height = 11.3;
    const keyY = y + (this.iconSize - height) / 2;
    RoundButton.drawKey(this.ctx, "Space", x, keyY, width, height);
    this.drawLabel("Throw Bottle", x + width + 4, y + this.iconSize / 2);
  }

  /**
   * Handles a click on the start screen or in the pause menu.
   * @param {{x: number, y: number}} pos - The click position in game units.
   */
  handleStartScreenClick(pos) {
    if (this.gameStarted) {
      this.handlePauseTopRowClick(pos);
      return;
    }
    this.handlePreGameTopRowClick(pos);
  }

  /**
   * Handles a click on the start screen: starts the match or switches the sound.
   * @param {{x: number, y: number}} pos - The click position in game units.
   */
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

  /**
   * Handles a click in the pause menu and runs the action of the clicked entry.
   * @param {{x: number, y: number}} pos - The click position in game units.
   */
  handlePauseTopRowClick(pos) {
    const y = this.getStartRowY(1);
    const items = this.getPauseMenuItems();
    const clicked = items.find((item, index) =>
      this.isLabelRowHit(pos, this.getPauseRowItemX(index, items.length), y, item.label),
    );
    if (clicked) clicked.action();
  }
}
