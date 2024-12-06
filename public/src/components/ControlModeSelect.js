class ControlModeSelect {
    constructor() {
      //
    }
  
    init() {
      // Mark state starting time
      this.startTime = millis();
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
      textSize(windowWidth / 42);
      text("Select Your Control Mode (Press Keyboard)", 0, height / 30 * -2);
      textSize(windowWidth / 46);
      // Display control options
      fill(game.controlMode === 'Humanity' ? 'yellow' : 'white');
      text("A.    Motion", 0, height / 30 * 0);
      /*
      fill(game.controlMode === 'Android' ? 'yellow' : 'white');
      text("B.  Keyboard", 0, height / 30 * 2);
      fill(game.controlMode === 'Robot' ? 'yellow' : 'white');
      text("C.   Robot", 0, height / 30 * 2);
      */

      fill(255);
      textSize(windowWidth / 48);
      text("Press SPACE To Config Your Mission", 0, height / 30 * 2);
      pop();

      // Render Notification
      globalNotification.render();
    }
  
    handleInput(input) {
      if (input === 'A') {
        game.controlMode = 'Humanity';
      } else if (input === 'B') {
        game.controlMode = 'Android';
      } else if (input === 'C') {
        game.controlMode = 'Robot';
      } else if (input === 'D') {
        game.controlMode = 'RobotWithoutHands';
      } else if (input === ' ') {
        if (game.controlMode != null && this.startTime - millis() > stateBufferTime) {
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
        } else {
          globalNotification.update('Please Select Control Mode!');
        }
      }
    }
  }