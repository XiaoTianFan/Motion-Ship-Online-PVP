class StartScreen {
  // Displays the start screen with title, introduction, and start prompt.
  constructor() {
    this.title = "Motion Ships";
    this.intro = "PLEASE ALLOW CAM/MIC USAGE!";
    this.prompt = "Press F To Fullscreen\nPress SPACE To Proceed";
  }

  init() {
    // Any initialization if necessary
  }

  update() {
    // No dynamic elements to update
  }

  render() {
    background(10);
    push();
    // translate(0, 0, 0); 
    textAlign(CENTER, CENTER);
    textFont(assets.fonts.ps2p);
    fill(245);
    textSize(windowWidth / 24);
    text(this.title, 0, -width / 16);
    textSize(windowWidth / 56);
    text(this.intro, 0, 0);
    text(this.prompt, 0, width / 16);
    pop();
  }

  handleInput(input) {
    if (input === 'keyPressed') {
        gameStateManager.changeState('ControlModeSelect');
        globalBroadcastSend = {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          health: 100,
          energy: 100,
          tacticEngineOn: false,
          laserCooldown: 100, // milliseconds
          lastLaserTime: 0,
          colliderRadius: 30, // Example radius for collision detection
          destroyCountdown: 90,
          toDestroy: false,
          laserFired: 0,
          readyToPlay: false,
          bkgSelected: 'background1'
        }
    }
  }
}