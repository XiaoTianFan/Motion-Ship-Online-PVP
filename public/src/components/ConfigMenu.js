class ConfigMenu {
  constructor() {
    this.background = null;
    this.selectedShip = 'playerShip1';
    this.selectedBackground = 'background1';
    this.backgroundTexture = assets.textures[this.selectedBackground];
  }

  init() {
    // Mark state starting time
    this.startTime = millis();

    if (game.controlMode === 'Humanity' && faceMeshFlag === false) {
      // Initializes the video capture and hide it
      video = createCapture(VIDEO);
      video.size(640, 480);
      video.hide();
      // Start detecting faces from the webcam video
      faceMesh.detectStart(video, gotFaces);
      faceMeshFlag = true;
    } else if (game.controlMode === 'Robot' && serialFlag === false) {
      // Initialize or Re-initialize Serial Connection
      setUpSerial(9600).then(() => {
      serialActive = true;
      serialFlag = true;
      console.log("Serial connection established.");
    }).catch(err => {
      console.error("Serial connection failed:", err);
    });
    }
    
    // Initialize Face Tracker for head movement detection
    faceTracker = new FaceTracker();
    faceTracker.init();

    // Initialize default selections 
    if (game.controlMode === 'Robot' || game.controlMode === 'RobotWithoutHands') {
      this.selectedShip = random(['playerShip1', 'playerShip2']);
    }
    else {
      this.selectedShip = 'playerShip1'; // Default selection
    }
    this.selectedBackground = 'background1'; // Default selection
    this.bkgHistory = ['background1'];
    this.selectedEnemyShip = 'playerShip1';
    
    // Initialize background
    this.background = new Background(this.backgroundTexture);
    
    console.log('ConfigMenu loaded!');
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
      bkgSelected: this.selectedBackground,
      modelSelected: this.selectedShip,
      currentComponent: 'ConfigMenu'
    }

    if (typeof globalBroadcastGet.bkgSelected === "string" & this.bkgHistory[this.bkgHistory.length - 1] !== globalBroadcastGet.bkgSelected) {
      this.selectedBackground = globalBroadcastGet.bkgSelected
      this.bkgHistory.push(this.selectedBackground)
    }

    this.backgroundTexture = assets.textures[this.selectedBackground];
    this.background.texture = this.backgroundTexture;

    if ((game.controlMode === 'Robot' || game.controlMode === 'RobotWithoutHands') && (globalBroadcastGet.currentComponent === 'Instruction' || globalBroadcastGet.currentComponent === 'WaitForPlayer')) {
      gameStateManager.changeState('WaitForPlayer');
    }
  }

  render() {
    this.background.render();
    ambientLight(100);
    directionalLight(255, 255, 255, 0, 1, -0.8);
    
    // Ship models
    push();
    translate(-width / 6, 0, 300);
    rotateY(-PI / 12);
    rotateZ(PI / 4);
    if (this.selectedShip === 'playerShip1') {
      fill('blue');
    } else {
      fill('grey');
    }
    noStroke();
    shininess(80);
    model(assets.models.playerShip1);
    pop();
    push();
    translate(width / 6, 0, 300);
    rotateY(PI / 12);
    rotateZ(-PI / 4);
    if (this.selectedShip === 'playerShip2') {
      fill('blue');
    } else {
      fill('grey');
    }
    noStroke();
    shininess(80);
    model(assets.models.playerShip2);
    pop();
    
    
    // Instruction
    push();
    translate(0, -height / 3.5, 0);
    textAlign(CENTER, CENTER);
    textFont(assets.fonts.ps2p);
    fill(255);
    textSize(windowWidth / 40);
    text("Press Keys to Customize Your Mission", 0, -height / 30 * 2);

    // Spaceship Selection
    textSize(windowWidth / 40);
    text("Press 1 or 2 To Prepare Your Spaceship", 0, height / 30 * 2);

    textSize(windowWidth / 46);
    // Display spaceship options (for simplicity, using text prompts)
    fill(this.selectedShip === 'playerShip1' ? 'yellow' : 'white');
    text("1.     X-WING Jet", 0, height / 30 * 4);
    fill(this.selectedShip === 'playerShip2' ? 'yellow' : 'white');
    text("2. Justice League", 0, height / 30 * 5.5);

    // Background Selection
    fill(255);
    textSize(windowWidth / 45);
    text("Press A/B/C/D To Select The Target Galaxy", 0, height / 30 * 10);

    textSize(windowWidth / 46);
    // Display background options
    fill(this.selectedBackground === 'background1' ? 'yellow' : 'white');
    text("A.  Caldari", 0, height / 30 * 12);
    fill(this.selectedBackground === 'background2' ? 'yellow' : 'white');
    text("B. Minmatar", 0, height / 30 * 13.5);
    fill(this.selectedBackground === 'background3' ? 'yellow' : 'white');
    text("C.    Amarr", 0, height / 30 * 15);
    fill(this.selectedBackground === 'background4' ? 'yellow' : 'white');
    text("D. Gallente", 0, height / 30 * 16.5);

    // Prompt to start game
    textSize(windowWidth / 42);
    fill(255);
    if (game.instructionShowed === false) {
      text("Press SPACE To Read The Instruction", 0, height / 30 * 20);
    } else {
      text("Press SPACE To Start", 0, height / 30 * 20);
    }
    
    pop();
  }

  handleInput(input) {
    if (input === '1') {
      this.selectedShip = 'playerShip1';
    } else if (input === '2') {
      this.selectedShip = 'playerShip2';
    } else if (input === 'a') {
      this.selectedBackground = 'background1';
    } else if (input === 'b') {
      this.selectedBackground = 'background2';
    } else if (input === 'c') {
      this.selectedBackground = 'background3';
    } else if (input === 'd') {
      this.selectedBackground = 'background4';
    } else if (input === 'keyPressed') {
      if (millis() - this.startTime > stateBufferTime) {
        if (game.instructionShowed === true) {
          gameStateManager.changeState('WaitForPlayer');
        } else {
          gameStateManager.changeState('Instruction');
        }
      }
    } 
    console.log('Config changed!');
  }
}