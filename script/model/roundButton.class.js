class RoundButton {
  static FILL = "#ffc21a";
  static FILL_PRESSED = "#d98f00";
  static RING = "#7a2e0b";
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
  static SPEAKER_SHAPE = [
    [-0.5, -0.17],
    [-0.25, -0.17],
    [0.02, -0.42],
    [0.02, 0.42],
    [-0.25, 0.17],
    [-0.5, 0.17],
  ];

  /**
   * Draws a round button that fills a square area (used for the menu and control icons).
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {string} name - The icon of the button (play, pause, settings, sound, mute, replay, exit, left, right, jump).
   * @param {number} x - The left edge of the area.
   * @param {number} y - The top edge of the area.
   * @param {number} size - The width and height of the area.
   */
  static drawInBox(ctx, name, x, y, size) {
    const r = size / 2 / 1.05;
    RoundButton.drawCircle(ctx, x + size / 2, y + size / 2, r);
    RoundButton.drawIcon(ctx, name, x + size / 2, y + size / 2, r);
  }

  /**
   * Draws the filled circle of a button with its ring.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {number} x - The x position of the center.
   * @param {number} y - The y position of the center.
   * @param {number} r - The radius.
   * @param {boolean} [pressed=false] - If true, the circle is drawn darker.
   */
  static drawCircle(ctx, x, y, r, pressed = false) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = pressed ? RoundButton.FILL_PRESSED : RoundButton.FILL;
    ctx.fill();
    ctx.lineWidth = r * 0.1;
    ctx.strokeStyle = RoundButton.RING;
    ctx.stroke();
  }

  /**
   * Draws the icon of a button in the ring color, scaled to the button.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {string} name - The name of the icon.
   * @param {number} x - The x position of the button center.
   * @param {number} y - The y position of the button center.
   * @param {number} r - The radius of the button.
   */
  static drawIcon(ctx, name, x, y, r) {
    if (name in RoundButton.ARROW_ANGLE) {
      RoundButton.drawArrow(ctx, x, y, r, RoundButton.ARROW_ANGLE[name]);
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(r, r);
    ctx.fillStyle = RoundButton.RING;
    ctx.strokeStyle = RoundButton.RING;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    RoundButton.ICONS[name](ctx);
    ctx.restore();
  }

  /**
   * Draws a filled arrow in the ring color, scaled to the button and rotated in its direction.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {number} x - The x position of the button center.
   * @param {number} y - The y position of the button center.
   * @param {number} r - The radius of the button.
   * @param {number} angle - The direction of the arrow in radians (0 = right).
   */
  static drawArrow(ctx, x, y, r, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(r, r);
    RoundButton.fillShape(ctx, RoundButton.ARROW_SHAPE);
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = RoundButton.RING;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Fills a closed shape made of points in the ring color.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {number[][]} points - The corner points of the shape.
   */
  static fillShape(ctx, points) {
    ctx.beginPath();
    points.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.closePath();
    ctx.fillStyle = RoundButton.RING;
    ctx.fill();
  }

  /**
   * Draws a line between two points.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {number} x1 - The x position of the start.
   * @param {number} y1 - The y position of the start.
   * @param {number} x2 - The x position of the end.
   * @param {number} y2 - The y position of the end.
   */
  static line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  /**
   * The icon drawings, in button units (the button has the radius 1, centered at 0, 0).
   */
  static ICONS = {
    play(ctx) {
      RoundButton.fillShape(ctx, [
        [-0.28, -0.45],
        [0.5, 0],
        [-0.28, 0.45],
      ]);
    },
    pause(ctx) {
      ctx.fillRect(-0.38, -0.42, 0.26, 0.84);
      ctx.fillRect(0.12, -0.42, 0.26, 0.84);
    },
    sound(ctx) {
      RoundButton.fillShape(ctx, RoundButton.SPEAKER_SHAPE);
      ctx.lineWidth = 0.1;
      [0.2, 0.4].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(0.08, 0, radius, -0.85, 0.85);
        ctx.stroke();
      });
    },
    mute(ctx) {
      RoundButton.fillShape(ctx, RoundButton.SPEAKER_SHAPE);
      ctx.lineWidth = 0.12;
      RoundButton.line(ctx, 0.2, -0.2, 0.55, 0.2);
      RoundButton.line(ctx, 0.2, 0.2, 0.55, -0.2);
    },
    replay(ctx) {
      const radius = 0.4;
      const end = Math.PI * 1.25;
      ctx.lineWidth = 0.13;
      ctx.beginPath();
      ctx.arc(0, 0, radius, -Math.PI * 0.45, end);
      ctx.stroke();
      const px = radius * Math.cos(end);
      const py = radius * Math.sin(end);
      const tx = -Math.sin(end);
      const ty = Math.cos(end);
      RoundButton.fillShape(ctx, [
        [px + tx * 0.24, py + ty * 0.24],
        [px - ty * 0.2, py + tx * 0.2],
        [px + ty * 0.2, py - tx * 0.2],
      ]);
    },
    exit(ctx) {
      ctx.lineWidth = 0.12;
      ctx.beginPath();
      ctx.moveTo(0.05, -0.45);
      ctx.lineTo(0.45, -0.45);
      ctx.lineTo(0.45, 0.45);
      ctx.lineTo(0.05, 0.45);
      ctx.stroke();
      ctx.save();
      ctx.translate(-0.12, 0);
      ctx.rotate(Math.PI);
      ctx.scale(0.75, 0.75);
      RoundButton.fillShape(ctx, RoundButton.ARROW_SHAPE);
      ctx.restore();
    },
    settings(ctx) {
      for (let i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 4);
        ctx.fillRect(-0.1, -0.52, 0.2, 0.3);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 0.36, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 0.14, 0, Math.PI * 2);
      ctx.fillStyle = RoundButton.FILL;
      ctx.fill();
    },
  };

  /**
   * Draws a keyboard key with rounded corners and a label in the button colors.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   * @param {string} label - The text on the key.
   * @param {number} x - The left edge of the key.
   * @param {number} y - The top edge of the key.
   * @param {number} width - The width of the key.
   * @param {number} height - The height of the key.
   */
  static drawKey(ctx, label, x, y, width, height) {
    const lineWidth = height * 0.1;
    ctx.beginPath();
    ctx.roundRect(
      x + lineWidth / 2,
      y + lineWidth / 2,
      width - lineWidth,
      height - lineWidth,
      height * 0.3,
    );
    ctx.fillStyle = RoundButton.FILL;
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = RoundButton.RING;
    ctx.stroke();
    ctx.fillStyle = RoundButton.RING;
    ctx.font = `bold ${height * 0.62}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + width / 2, y + height / 2 + 0.3);
    ctx.textAlign = "left";
  }
}
