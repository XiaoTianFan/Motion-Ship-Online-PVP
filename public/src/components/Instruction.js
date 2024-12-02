class Instruction {
  constructor() {
    this.instructions = null;
  }

  init() {
    game.instructionShowed = true;
    if (game.controlMode === 'Humanity') {
      this.instructions = "=========CENTER YOUR FACE=========\n\nCommands\n\nHead Motion : Spaceship Direction\nSPACE : Fire Laser\nX : Tactic Engine (One Time)\nQ : Give Up Current Mission\n\n\nGame Objective\n\n1. Destroy Your Enemy\n2. Avoid Clashing With Meteoroids\n\n\nPress SPACE To Start";
    } else if (game.controlMode === 'Android') {
      this.instructions = "==========KNOW YOUR KEYS==========\n\nCommands\n\nW/A/S/D : Spaceship Direction\nSPACE : Fire Laser\nX : Tactic Engine (One Time)\nQ : Give Up Current Mission\n\n\nGame Objective\n\n1. Destroy Your Enemy\n2. Avoid Clashing With Meteoroids\n\n\nPress SPACE To Start";
    } else {
      this.instructions = "=========ARE YOU A ROBOT=========\n\=========ARE YOU A ROBOT=========\n\n=========ARE YOU A ROBOT=========\n=========ARE YOU A ROBOT=========\n=========ARE YOU A ROBOT=========\n=========ARE YOU A ROBOT=========\n\n\n=========ARE YOU A ROBOT=========\n\n=========ARE YOU A ROBOT=========\n=========ARE YOU A ROBOT=========\n\n\n=========ARE YOU A ROBOT=========";
    }
  }

  update() {
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
      bkgSelected: configMenu.selectedBackground,
      modelSelected: configMenu.selectedShip,
      currentComponent: 'Instruction'
    }
  }

  render() {
    background(10);
    if (game.controlMode === 'Humanity') {
      // translate(-windowWidth / 2, -windowHeight / 2, 0);
      // Code of this for loop comes from https://editor.p5js.org/ml5/sketches/lCurUW1TT
      // Draw all the tracked face points
      for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        for (let j = 0; j < face.keypoints.length; j++) {
          let keypoint = face.keypoints[j];
          fill(0, 255, 0);
          noStroke();
          circle(map(keypoint.x, 0, video.width, -width / 2, width / 2), 
                map(keypoint.y, 0, video.height, -height / 2, height / 2), 
                5);
        }
      }
    }
    push();
    
    pop();
    push();
    translate(-windowWidth / 2 + windowWidth / 2 * 0.3, 0, 0);
    textAlign(LEFT, CENTER);
    textFont(assets.fonts.ps2p);
    fill(245);
    textSize(windowWidth / 48);
    text(this.instructions, 0, 0);
    pop();
  }

  handleInput(input) {
    if (input === 'keyPressed') {
        gameStateManager.changeState('WaitForPlayer');
    }
  }
}