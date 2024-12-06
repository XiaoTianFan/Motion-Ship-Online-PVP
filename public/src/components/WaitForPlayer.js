class WaitForPlayer {
    constructor() {
      this.instructions = "=========CENTER YOUR FACE=========\n\nWaiting For The Other Player\n\nPress SPACE To Indicate You Are Ready";
      this.ready = false;
    }
  
    init() {
      // Mark state starting time
      this.startTime = millis();

      // If control mode is robot then set ready
      if (game.controlMode === 'Robot' || game.controlMode === 'RobotWithoutHands') {
        this.ready = true;
        this.instructions = "=========AI MODE ON=========\n\nWaiting For The Other Player\n\nYou Are Ready";
      } else {
        this.ready = false;
      }
    }
  
    update() {
      console.log(globalBroadcastGet.readyToPlay, this.ready);
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
        readyToPlay: this.ready,
        bkgSelected: configMenu.selectedBackground,
        modelSelected: configMenu.selectedShip,
        currentComponent: 'WaitForPlayer'
      }
      
      if (globalBroadcastGet.readyToPlay === true && this.ready === true) {
        this.instructions = "=========CENTER YOUR FACE=========\n\nWaiting For The Other Player\n\nPress SPACE To Indicate You Are Ready";
        gameStateManager.changeState('Gameplay');
      }
    }
  
    render() {
      background(10);
      
      if (game.controlMode != 'Robot' && game.controlMode != 'RobotWithoutHands') {
        push();
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
        pop();
      }
      
      push();
      translate(0, 0, 0);
      textAlign(CENTER, CENTER);
      textFont(assets.fonts.ps2p);
      fill(245);
      textSize(windowWidth / 48);
      text(this.instructions, 0, 0);
      pop();
    }
  
    handleInput(input) {
      if (input === ' ' && millis() - this.startTime > stateBufferTime) {
        this.instructions = "=========CENTER YOUR FACE=========\n\nWaiting For The Other Player\n\nYou Are Ready";
        this.ready = true;
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
            readyToPlay: true,
            bkgSelected: configMenu.selectedBackground,
            modelSelected: configMenu.selectedShip
        }
      }
    }
  }