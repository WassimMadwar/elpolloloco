class TouchControls {
  // ===== BUTTON SIZE: change the button size here =====
  // Diameter of the visible circle in screen pixels (CSS px).
  static TABLET_DIAMETER_PX = 72;
  static PHONE_DIAMETER_PX = 46;
  // Devices whose shorter screen side is below this value count as phones
  // (phones: up to ~430px, tablets: 768px and more, in any orientation).
  static PHONE_MAX_HEIGHT_PX = 500;
  // Minimum tap area (diameter). Small buttons stay easy to hit with a
  // finger, because the tap area is larger than the drawn circle.
  static MIN_TAP_DIAMETER_PX = 44;
  // Distance to the screen edge and between the two buttons of a group.
  static EDGE_MARGIN_PX = 14;
  static BUTTON_GAP_PX = 14;
  // Angle of each button group (0 = horizontal).
  static GROUP_ANGLE_DEG = 22;
  // =====================================================
  static MOVE_BUTTONS = ["left", "right"];
  static HOLD_FLAGS = { left: "left", right: "right", jump: "up" };
  static OPACITY = 0.4;
  static FILL = "#ffc21a";
  static FILL_PRESSED = "#d98f00";
  static RING = "#7a2e0b";
  static BOTTLE_SCALE = 1.9;
  static ARROW_ANGLE = { right: 0, left: Math.PI, jump: -Math.PI / 2 };
  static ARROW_SHAPE = [
    [-0.5, -0.16],
    [0.05, -0.16],
    [0.05, -0.42],
    [0.55, 0],
    [0.05, 0.42],
    [0.05, 0.16],
    [-0.5, 0.16],
  ];

  game;
  canvas;
  keys;
  activePointers = new Map();
  bottleIcon = new Image();

  constructor(game) {
    this.game = game;
    this.canvas = game.renderCanvas;
    this.keys = game.keyAction;
    this.bottleIcon.src = "assets/img/6_salsa_bottle/salsa_bottle.png";
    this.listen();
  }

  /**
   * Checks whether the touch buttons can be used:
   * only during a running match, not in the pause menu, while paused or on the result screen.
   * @returns {boolean} True if the buttons are active.
   */
  isActive() {
    const control = this.game.control;
    if (!control.gameStarted || control.pauseMenuOpen || Game.paused) {
      return false;
    }
    return !this.game.getGameResult();
  }

  /**
   * Checks whether the device is controlled by touch (phone or tablet).
   * @returns {boolean} True on touch devices.
   */
  isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  /**
   * Draws all touch buttons with the set opacity, but only on touch devices while they are active.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  draw(ctx) {
    if (!this.isTouchDevice() || !this.isActive()) return;
    ctx.save();
    ctx.globalAlpha = TouchControls.OPACITY;
    this.getButtons().forEach((button) => this.drawButton(ctx, button));
    ctx.restore();
  }

  /**
   * Draws one round button with its ring and icon. A pressed button is drawn darker and smaller.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {{name: string, x: number, y: number, r: number}} button - The button to draw.
   */
  drawButton(ctx, button) {
    const pressed = this.isPressed(button.name);
    const r = pressed ? button.r * 0.92 : button.r;
    ctx.beginPath();
    ctx.arc(button.x, button.y, r, 0, Math.PI * 2);
    ctx.fillStyle = pressed ? TouchControls.FILL_PRESSED : TouchControls.FILL;
    ctx.fill();
    ctx.lineWidth = r * 0.1;
    ctx.strokeStyle = TouchControls.RING;
    ctx.stroke();
    this.drawIcon(ctx, button.name, button.x, button.y, r);
  }

  /**
   * Draws the icon of a button: an arrow for left, right and jump, the bottle image for throw.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {string} name - The name of the button.
   * @param {number} x - The x position of the button center.
   * @param {number} y - The y position of the button center.
   * @param {number} r - The radius of the button.
   */
  drawIcon(ctx, name, x, y, r) {
    if (name in TouchControls.ARROW_ANGLE) {
      this.drawArrow(ctx, x, y, r, TouchControls.ARROW_ANGLE[name]);
      return;
    }
    if (!this.bottleIcon.naturalWidth) return;
    const size = r * TouchControls.BOTTLE_SCALE;
    ctx.drawImage(this.bottleIcon, x - size / 2, y - size / 2, size, size);
  }

  /**
   * Draws a filled arrow in the ring color, scaled to the button and rotated in its direction.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {number} x - The x position of the button center.
   * @param {number} y - The y position of the button center.
   * @param {number} r - The radius of the button.
   * @param {number} angle - The direction of the arrow in radians (0 = right).
   */
  drawArrow(ctx, x, y, r, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(r, r);
    ctx.beginPath();
    TouchControls.ARROW_SHAPE.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.closePath();
    ctx.fillStyle = TouchControls.RING;
    ctx.fill();
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = TouchControls.RING;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Returns how many game units one screen pixel is at the current canvas size.
   * @returns {number} The game units per CSS pixel.
   */
  getUnitsPerPx() {
    return Game.VIEW_WIDTH / this.game.viewport.cssWidth;
  }

  /**
   * Checks whether the device is a phone, based on its shorter screen side.
   * @returns {boolean} True on phones, false on tablets.
   */
  isPhone() {
    const root = document.documentElement;
    const shortSide = Math.min(root.clientWidth, root.clientHeight);
    return shortSide < TouchControls.PHONE_MAX_HEIGHT_PX;
  }

  /**
   * Returns the button size for the current device (phone or tablet size).
   * @returns {number} The diameter in screen pixels.
   */
  getDiameterPx() {
    return this.isPhone()
      ? TouchControls.PHONE_DIAMETER_PX
      : TouchControls.TABLET_DIAMETER_PX;
  }

  /**
   * Calculates the position and size of all four buttons.
   * Left and right are placed in the bottom left corner, jump and throw in the bottom right corner,
   * each group at an angle (see GROUP_ANGLE_DEG).
   * @returns {{name: string, x: number, y: number, r: number, tapR: number}[]} The buttons in game units.
   */
  getButtons() {
    const unit = this.getUnitsPerPx();
    const r = (this.getDiameterPx() / 2) * unit;
    const tapR = Math.max(r, (TouchControls.MIN_TAP_DIAMETER_PX / 2) * unit);
    const margin = TouchControls.EDGE_MARGIN_PX * unit;
    const step = 2 * r + TouchControls.BUTTON_GAP_PX * unit;
    const angle = (TouchControls.GROUP_ANGLE_DEG * Math.PI) / 180;
    const dx = step * Math.cos(angle);
    const dy = step * Math.sin(angle);
    const y = Game.VIEW_HEIGHT - margin - r;
    const leftX = margin + r;
    const rightX = Game.VIEW_WIDTH - margin - r;
    return [
      { name: "left", x: leftX, y, r, tapR },
      { name: "right", x: leftX + dx, y: y - dy, r, tapR },
      { name: "jump", x: rightX, y, r, tapR },
      { name: "throw", x: rightX - dx, y: y - dy, r, tapR },
    ];
  }

  /**
   * Finds the button whose tap area contains a position.
   * @param {{x: number, y: number}} pos - The position in game units.
   * @returns {(Object|undefined)} The button, or undefined if no button was hit.
   */
  getButtonAt(pos) {
    return this.getButtons().find(
      (b) => Math.hypot(pos.x - b.x, pos.y - b.y) <= b.tapR,
    );
  }

  /**
   * Checks whether an active touch button is at a position.
   * @param {{x: number, y: number}} pos - The position in game units.
   * @returns {boolean} True if a button is there.
   */
  isButtonAt(pos) {
    return this.isActive() && !!this.getButtonAt(pos);
  }

  /**
   * Adds the pointer listeners to the canvas and releases all buttons
   * when the window loses focus or the page is hidden.
   */
  listen() {
    this.canvas.addEventListener("pointerdown", (e) => this.onDown(e));
    this.canvas.addEventListener("pointermove", (e) => this.onMove(e));
    this.canvas.addEventListener("pointerup", (e) => this.onUp(e));
    this.canvas.addEventListener("pointercancel", (e) => this.onUp(e));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("blur", () => this.releaseAll());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.releaseAll();
    });
  }

  /**
   * Handles a finger touching the canvas: presses the button under the finger.
   * Mouse input is ignored.
   * @param {PointerEvent} e - The pointer event.
   */
  onDown(e) {
    if (e.pointerType !== "touch" || !this.isActive()) return;
    const button = this.getButtonAt(this.game.getCanvasClickPosition(e));
    if (!button) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.activePointers.set(e.pointerId, button.name);
    this.press(button.name);
  }

  /**
   * Handles a moving finger: switches between left and right when the finger slides
   * from one movement button to the other.
   * @param {PointerEvent} e - The pointer event.
   */
  onMove(e) {
    const current = this.activePointers.get(e.pointerId);
    if (!current) return;
    if (!this.isActive()) return this.releaseAll();
    const button = this.getButtonAt(this.game.getCanvasClickPosition(e));
    if (!button || button.name === current) return;
    if (!this.isMoveSwitch(current, button.name)) return;
    this.activePointers.set(e.pointerId, button.name);
    this.release(current);
    this.press(button.name);
  }

  /**
   * Handles a finger leaving the canvas: releases its button.
   * @param {PointerEvent} e - The pointer event.
   */
  onUp(e) {
    const name = this.activePointers.get(e.pointerId);
    if (!name) return;
    this.activePointers.delete(e.pointerId);
    this.release(name);
  }

  /**
   * Checks whether a finger slides from one movement button to the other.
   * @param {string} from - The name of the current button.
   * @param {string} to - The name of the new button.
   * @returns {boolean} True if both are movement buttons (left or right).
   */
  isMoveSwitch(from, to) {
    const moves = TouchControls.MOVE_BUTTONS;
    return moves.includes(from) && moves.includes(to);
  }

  /**
   * Checks whether any finger is currently holding a button.
   * @param {string} name - The name of the button.
   * @returns {boolean} True if the button is pressed.
   */
  isPressed(name) {
    return [...this.activePointers.values()].includes(name);
  }

  /**
   * Presses a button: requests a throw, or sets the matching key flag (left, right or up).
   * @param {string} name - The name of the button.
   */
  press(name) {
    if (name === "throw") {
      this.keys.throwRequested = true;
      return;
    }
    this.keys[TouchControls.HOLD_FLAGS[name]] = true;
  }

  /**
   * Releases a button and clears its key flag, unless another finger still holds it.
   * @param {string} name - The name of the button.
   */
  release(name) {
    const flag = TouchControls.HOLD_FLAGS[name];
    if (!flag || this.isPressed(name)) return;
    this.keys[flag] = false;
  }

  /**
   * Releases all pressed buttons, so the character never keeps moving on its own.
   */
  releaseAll() {
    const names = [...this.activePointers.values()];
    this.activePointers.clear();
    names.forEach((name) => this.release(name));
  }
}
