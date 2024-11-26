class ControlModeSelect {
    constructor() {
      //
    }
  
    init() {
      //
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
      }
    }
  
    render() {
      background(10);
      push();
      translate(0, 0, 0);
      textAlign(CENTER, CENTER);
      textFont(assets.fonts.ps2p);
      fill(255);
      textSize(windowWidth / 32);
      text("Select Your Control Mode", 0, height / 30 * -4);
      textSize(windowWidth / 46);
      // Display control options
      fill(game.controlMode === 'Humanity' ? 'yellow' : 'white');
      text("A. Humanity", 0, height / 30 * -2);
      fill(game.controlMode === 'Android' ? 'yellow' : 'white');
      text("B.  Android", 0, height / 30 * 0);
      fill(game.controlMode === 'Robot' ? 'yellow' : 'white');
      text("C.   Robot", 0, height / 30 * 2);

      fill(255);
      textSize(windowWidth / 48);
      text("Press SPACE To Config Your Mission", 0, height / 30 * 4);
      pop();
    }
  
    handleInput(input) {
      if (input === 'A') {
        game.controlMode = 'Humanity';
      } else if (input === 'B') {
        game.controlMode = 'Android';
      } else if (input === 'C') {
        game.controlMode = 'Robot';
        try {
          // setUpSerial();
        } catch (error) {
          console.error("An error occurred setting up serial communication:", error);
        }
        
      } else if (input === ' ') {
        gameStateManager.changeState('ConfigMenu');
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
            readyToPlay: false
        }
      }
    }
  }