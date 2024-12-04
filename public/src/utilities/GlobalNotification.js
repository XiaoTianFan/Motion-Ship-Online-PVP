class GlobalNotification {
  constructor() {
    this.text = null;
    this.displayTime = null;
    this.displaying = false;
  }

  update(text) {
    this.text = text;
    this.displayTime = millis();
    this.displaying = true;
  }

  render() {
    let currentTime = millis();
    if (this.displaying === true && currentTime - this.displayTime < 3000) {
      if (gameStateManager.currentState instanceof ControlModeSelect) {
        push();
        translate(0, 0, 400);
        fill('yellow');
        textFont(assets.fonts.ps2p);
        textSize(width / 64);
        textAlign(CENTER, CENTER);
        text(this.text, 0, 0);
      } else {
        push();
        translate(0, 0, 400);
        fill(245, 245, 245, 245);
        textFont(assets.fonts.ps2p);
        textSize(gamingZone.width / 96);
        textAlign(CENTER, CENTER);
        text(this.text, 0, 0);
      }
    } else {
      this.displaying = false;
    }
  }
}