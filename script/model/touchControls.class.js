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

  isActive() {
    const control = this.game.control;
    if (!control.gameStarted || control.pauseMenuOpen || Game.paused) {
      return false;
    }
    return !this.game.getGameResult();
  }

  isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
  }

  draw(ctx) {
    if (!this.isTouchDevice() || !this.isActive()) return;
    ctx.save();
    ctx.globalAlpha = TouchControls.OPACITY;
    this.getButtons().forEach((button) => this.drawButton(ctx, button));
    ctx.restore();
  }

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

  drawIcon(ctx, name, x, y, r) {
    if (name in TouchControls.ARROW_ANGLE) {
      this.drawArrow(ctx, x, y, r, TouchControls.ARROW_ANGLE[name]);
      return;
    }
    if (!this.bottleIcon.naturalWidth) return;
    const size = r * TouchControls.BOTTLE_SCALE;
    ctx.drawImage(this.bottleIcon, x - size / 2, y - size / 2, size, size);
  }

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

  getUnitsPerPx() {
    return Game.VIEW_WIDTH / this.game.viewport.cssWidth;
  }

  isPhone() {
    const root = document.documentElement;
    const shortSide = Math.min(root.clientWidth, root.clientHeight);
    return shortSide < TouchControls.PHONE_MAX_HEIGHT_PX;
  }

  getDiameterPx() {
    return this.isPhone()
      ? TouchControls.PHONE_DIAMETER_PX
      : TouchControls.TABLET_DIAMETER_PX;
  }

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

  getButtonAt(pos) {
    return this.getButtons().find(
      (b) => Math.hypot(pos.x - b.x, pos.y - b.y) <= b.tapR,
    );
  }

  isButtonAt(pos) {
    return this.isActive() && !!this.getButtonAt(pos);
  }

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

  onDown(e) {
    if (e.pointerType !== "touch" || !this.isActive()) return;
    const button = this.getButtonAt(this.game.getCanvasClickPosition(e));
    if (!button) return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.activePointers.set(e.pointerId, button.name);
    this.press(button.name);
  }

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

  onUp(e) {
    const name = this.activePointers.get(e.pointerId);
    if (!name) return;
    this.activePointers.delete(e.pointerId);
    this.release(name);
  }

  isMoveSwitch(from, to) {
    const moves = TouchControls.MOVE_BUTTONS;
    return moves.includes(from) && moves.includes(to);
  }

  isPressed(name) {
    return [...this.activePointers.values()].includes(name);
  }

  press(name) {
    if (name === "throw") {
      this.keys.throwRequested = true;
      return;
    }
    this.keys[TouchControls.HOLD_FLAGS[name]] = true;
  }

  release(name) {
    const flag = TouchControls.HOLD_FLAGS[name];
    if (!flag || this.isPressed(name)) return;
    this.keys[flag] = false;
  }

  releaseAll() {
    const names = [...this.activePointers.values()];
    this.activePointers.clear();
    names.forEach((name) => this.release(name));
  }
}
