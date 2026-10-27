class TouchControls {
  static MIN_DIAMETER_PX = 56;
  static MAX_DIAMETER_PX = 72;
  static EDGE_MARGIN_PX = 14;
  static BUTTON_GAP_PX = 14;
  static GROUP_ANGLE_DEG = 22;
  static MOVE_BUTTONS = ["left", "right"];
  static HOLD_FLAGS = { left: "left", right: "right", jump: "up" };
  static OPACITY = 0.4;
  static FILL = "#ffc21a";
  static FILL_PRESSED = "#d98f00";
  static RING = "#7a2e0b";
  static ICON_SCALE = { left: 1.1, right: 1.1, jump: 1.1, throw: 1.9 };

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

  getIcon(name) {
    const control = this.game.control;
    const icons = {
      left: control.leftIcon,
      right: control.rightIcon,
      jump: control.jumpIcon,
      throw: this.bottleIcon,
    };
    return icons[name];
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
    const icon = this.getIcon(name);
    if (!icon.naturalWidth) return;
    const size = r * TouchControls.ICON_SCALE[name];
    ctx.drawImage(icon, x - size / 2, y - size / 2, size, size);
  }

  getUnitsPerPx() {
    return Game.VIEW_WIDTH / this.game.viewport.cssWidth;
  }

  getDiameterPx() {
    const preferred = this.game.viewport.cssHeight * 0.2;
    return Math.min(
      Math.max(preferred, TouchControls.MIN_DIAMETER_PX),
      TouchControls.MAX_DIAMETER_PX,
    );
  }

  getButtons() {
    const unit = this.getUnitsPerPx();
    const r = (this.getDiameterPx() / 2) * unit;
    const margin = TouchControls.EDGE_MARGIN_PX * unit;
    const step = 2 * r + TouchControls.BUTTON_GAP_PX * unit;
    const angle = (TouchControls.GROUP_ANGLE_DEG * Math.PI) / 180;
    const dx = step * Math.cos(angle);
    const dy = step * Math.sin(angle);
    const y = Game.VIEW_HEIGHT - margin - r;
    const leftX = margin + r;
    const rightX = Game.VIEW_WIDTH - margin - r;
    return [
      { name: "left", x: leftX, y, r },
      { name: "right", x: leftX + dx, y: y - dy, r },
      { name: "jump", x: rightX, y, r },
      { name: "throw", x: rightX - dx, y: y - dy, r },
    ];
  }

  getButtonAt(pos) {
    return this.getButtons().find(
      (b) => Math.hypot(pos.x - b.x, pos.y - b.y) <= b.r,
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
