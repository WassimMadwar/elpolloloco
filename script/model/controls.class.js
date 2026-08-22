class Control {
  muted = false;
  sounds = [];

  constructor() {}
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
}
