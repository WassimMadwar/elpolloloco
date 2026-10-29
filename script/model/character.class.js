class Character extends MovableObj {
  // ===== STOMP RULE: change when a jump kills a chicken here =====
  // Pepe's feet must land in this upper part of the enemy (0.5 = top half).
  static STOMP_ZONE = 0.5;
  // Minimum horizontal overlap between Pepe and the enemy (game units).
  static MIN_STOMP_OVERLAP = 5;
  // ===============================================================
  height = 100;
  y = -10;
  groundY = 32;
  offset = { top: 40, left: 9, right: 9, bottom: 2 };
  gameMatch;
  imageCharWalking = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  imageCharJump = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
  ];
  imageCharDead = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  imageCharHurt = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  imageCharIdle = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  imageCharSleep = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  lastActionTime = new Date().getTime();
  isSnoring = false;

  constructor() {
    super().loadImg("assets/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImgMoving(this.imageCharJump);
    this.loadImgMoving(this.imageCharWalking);
    this.loadImgMoving(this.imageCharDead);
    this.loadImgMoving(this.imageCharHurt);
    this.loadImgMoving(this.imageCharIdle);
    this.loadImgMoving(this.imageCharSleep);
    this.animateCharacterWalking();
    this.applyGravity();
    this.clearIntervalAfterDead();
  }

  /**
   * Stops the character completely.
   * Clears the movement, animation and gravity intervals and ends the snoring sound.
   */
  stop() {
    clearInterval(this.controlInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.gravityInterval);
    this.stopSnoring();
  }

  /**
   * Checks whether the character is dying and stops it once it has fallen out of the view.
   * @returns {boolean} True if the character is dying, otherwise false.
   */
  clearIntervalAfterDead() {
    if (this.isDying) {
      if (this.y > Game.VIEW_HEIGHT) {
        this.stop();
      }
      return true;
    }
    return false;
  }

  /**
   * Starts the character's movement handling and animation loop.
   */
    animateCharacterWalking() {
    this.handleCharacterMovement();
    this.handleCharacterAnimation();
  }

  /**
   * Starts the movement interval (every 100 ms).
   * Moves the character left or right, triggers jumps from the key state
   * and keeps the camera following the character.
   * Skipped while paused, dying or after the end of the match.
   */
  handleCharacterMovement() {
    this.controlInterval = setInterval(() => {
      if (this.clearIntervalAfterDead()) {
        return;
      }
      if (Game.paused || this.gameMatch.matchOver) return;
      this.handelMoveRight();
      this.handelMoveLeft();
      if (this.gameMatch.keyAction.up) {
        this.jump();
      }
      this.updateCamera();
    }, 100);
  }

  /**
   * Moves the character to the right while the right key is pressed
   * and the end of the level has not been reached.
   */
  handelMoveRight() {
    if (
      this.gameMatch.keyAction.right &&
      this.x < this.gameMatch.level.levelEndX
    ) {
      this.moveRight();
      this.updateActivity();
    }
  }

  /**
   * Moves the character to the left while the left key is pressed
   * and the start of the level has not been reached. Mirrors the character image.
   */
  handelMoveLeft() {
    if (this.gameMatch.keyAction.left && this.x > 0) {
      this.x -= 8;
      this.otherDirection = true;
      this.updateActivity();
    }
  }

  /**
   * Saves the current time as the last action of the character.
   * Used to decide when the character falls asleep.
   */
  updateActivity() {
    this.lastActionTime = new Date().getTime();
  }

  /**
   * Checks whether the left or right key is currently pressed.
   * After the end of the match the character never walks.
   * @returns {boolean} True if the character is walking.
   */
  isWalking() {
    if (this.gameMatch.matchOver) return false;
    return this.gameMatch.keyAction.right || this.gameMatch.keyAction.left;
  }

  /**
   * Checks whether the character has been inactive for at least 15 seconds.
   * @returns {boolean} True if the character should show the sleep animation.
   */
  isSleeping() {
    return new Date().getTime() - this.lastActionTime >= 15000;
  }

  /**
   * Starts the animation interval (every 100 ms).
   * Plays the animation that fits the current state and starts or stops
   * the snoring sound together with the sleep animation.
   */
  handleCharacterAnimation() {
    this.animationInterval = setInterval(() => {
      if (this.isDying || Game.paused) {
        this.stopSnoring();
        return;
      }
      const animation = this.getCurrentAnimation();
      this.playAnimation(animation);
      this.updateSnoring(animation === this.imageCharSleep);
    }, 100);
  }

  /**
   * Selects the animation for the current state.
   * Priority: dead, hurt, jumping, walking, sleeping, idle.
   * @returns {string[]} The list of image paths of the selected animation.
   */
  getCurrentAnimation() {
    if (this.isDead()) return this.imageCharDead;
    if (this.isHurt()) return this.imageCharHurt;
    if (this.isAboveGround()) return this.imageCharJump;
    if (this.isWalking()) return this.imageCharWalking;
    if (this.isSleeping()) return this.imageCharSleep;
    return this.imageCharIdle;
  }

  /**
   * Starts or stops the snoring sound depending on the sleep state.
   * @param {boolean} asleep - Whether the sleep animation is currently playing.
   */
  updateSnoring(asleep) {
    if (asleep) {
      this.startSnoring();
    } else {
      this.stopSnoring();
    }
  }

  /**
   * Starts the looping snoring sound, if it is not already playing.
   */
  startSnoring() {
    if (this.isSnoring) return;
    this.isSnoring = true;
    this.gameMatch.control.playEffect("snore");
  }

  /**
   * Stops the snoring sound, if it is currently playing.
   */
  stopSnoring() {
    if (!this.isSnoring) return;
    this.isSnoring = false;
    this.gameMatch.control.stopEffect("snore");
  }

  /**
   * Moves the camera so that it follows the character.
   */
  updateCamera() {
    this.gameMatch.camera_x = -this.x + 50;
  }
  
  /**
   * Lets the character jump if it is standing on the ground.
   * Plays the jump sound and counts as an action (wakes the character up).
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 6;
      this.gameMatch.control.playEffect("jump");
      this.updateActivity();
    }
  }

  /**
   * Reduces the character's energy by 20 after a hit and updates the health bar.
   * Plays the hurt sound, or lets the character die when the energy reaches 0.
   */
  hit() {
    if (this.isDying) return;
    this.energy -= 20;
    if (this.energy <= 0) {
      this.energy = 0;
      this.gameMatch.statusBars.setHealth(0);
      this.dieCahracter();
    } else {
      this.lastHit = new Date().getTime();
      this.gameMatch.control.playEffect("hurt", false);
      this.gameMatch.statusBars.setHealth(this.energy);
    }
  }

  /**
   * Starts the death of the character.
   * Stops snoring, plays the death sound, saves the time of death
   * and lets the character fall out of the view.
   */
  dieCahracter() {
    if (this.isDying) return;
    this.isDying = true;
    this.stopSnoring();
    this.gameMatch.control.playEffect("dead");
    this.deathTime = new Date().getTime();
    this.speedY = 8;
    this.img = this.imageCache[this.imageCharDead[5]];
    this.gameMatch.endMatch();
  }

  /**
   * Checks whether the character lands on top of an enemy.
   * The character must be falling, its feet must be in the upper part of the enemy
   * (see STOMP_ZONE) and both must overlap horizontally (see MIN_STOMP_OVERLAP).
   * @param {MovableObj} enemy - The enemy to check.
   * @returns {boolean} True if the enemy is stomped.
   */
  canStomp(enemy) {
    if (!this.isFalling()) return false;
    const feet = this.getHitbox();
    const target = enemy.getHitbox();
    const overlapX =
      Math.min(feet.right, target.right) - Math.max(feet.left, target.left);
    const zoneBottom =
      target.top + (target.bottom - target.top) * Character.STOMP_ZONE;
    const feetInZone = feet.bottom >= target.top && feet.bottom <= zoneBottom;
    return feetInZone && overlapX >= Character.MIN_STOMP_OVERLAP;
  }
}
