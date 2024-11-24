/* Author Xiaotian Fan
*/

// Global Variables
let assetLoader;
let gameStateManager;
let soundProcessor;
let faceTracker;
let dataManager;
let objectSpawner;
let soundManager;
let configMenu;
let globalNotification;
let spaceDust;
let assets;
let gamingZone = {
  width: 0,
  height: 0
};

// A global game object to track overall game state and instances
let game = {
  score: 0,
  player: null,
  objects: [],
  enemy: null,
  laserBeams: [],
  enemyLaser: [],
  enemyLaserFired: 0,
  mDestroyed: 0,
  oDestroyed: 0,
  eDestroyed: 0,
  eventLog: ['', '', '', '', '', ''],
  instructionShowed: false,
  gameWL: null,
  controlMode: 'Humanity',
  cursor: {x: 0, y:0}
};

// The global broadcast dicitonaires to communicate with the other player
let globalBroadcastGet = {
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
  damageState: false,
  readyToPlay: false,
  bkgSelected: 'background1'
}
let globalBroadcastSend = {
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
  damageState: false,
  readyToPlay: false,
  bkgSelected: 'background1'
}
// Interval for sending broadcasts (in milliseconds)
const BROADCAST_INTERVAL = 5; // 5000 ms = 5 seconds

// Global Variables for face detection
let video;
let faces;
let predictedWord;
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };

// Preload function to load all assets before setup() and initialize face model
function preload() {
  try {
    console.log('Initiating assets loader');
    assetLoader = new AssetLoader();
    console.log('Assets loader initiated');
    assetLoader.loadModels();
    console.log('Models Loaded');
    assetLoader.loadTextures();
    console.log('Textures Loaded');
    assetLoader.loadSounds();
    console.log('Sounds Loaded');
    assetLoader.loadFonts();
    console.log('Fonts Loaded');

    // Initializes the FaceMesh model.
    faceMesh = ml5.faceMesh(options);
  } catch (error) {
    // Code to handle the error
    console.error("An error occurred:", error);
  }
}

// Setup function initializes game components after assets are loaded
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  calculateGamingZone();
  frameRate(60);
  noStroke();

  // Initialize Socket.io
  socket = io();

  // Handle connection events
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // Reconnection attempts
  socket.on('reconnect_attempt', () => {
    console.log('Attempting to reconnect');
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
  });

  // Listen for broadcast messages from other clients
  socket.on('broadcast', (data) => {
    // console.log('Received broadcast');s
    try {
      // Ensure the received data is a valid object
      if (typeof data === 'object' && data !== null) {
        globalBroadcastGet = data; // Replace the entire BroadcastGet dictionary
      } else {
        console.warn('Received data is not a valid dictionary:', data);
      }
    } catch (error) {
      console.error('Error processing received data:', error);
    }
  });

  // Set up the periodic sending
  setInterval(sendBroadcast, BROADCAST_INTERVAL);

  // Initializes the video capture and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  
  // Assign assetLoader to global assets variable
  assets = assetLoader;

  // Verify that critical assets are loaded
  if (
    !assets.models.playerShip1 ||
    !assets.textures.background1 ||
    !assets.sounds.backgroundMusic
  ) {
    console.error("Critical assets failed to load. Please check asset paths.");
    noLoop(); // Stop the sketch if assets are missing
    return;
  } else {
    console.log('Assets successfully loaded!');
  }

  // Initialize Sound Manager with loaded sounds
  soundManager = new SoundManager();
  soundManager.loadSounds(assets);

  // Initialize Data Manager and load existing game data
  dataManager = new DataManager();
  dataManager.loadGameData();

  // Initialize Face Tracker for head movement detection
  faceTracker = new FaceTracker();
  faceTracker.init();

  // Initialize Game State Manager to handle game flow
  gameStateManager = new GameStateManager();

  // Access ConfigMenu instance for spaceship and background selections
  configMenu = gameStateManager.states.ConfigMenu;

  // Initialize HUD (Heads-Up Display)
  gameStateManager.states.Gameplay.hud = new HUD();
  
  // Initialize global notification
  globalNotification = new GlobalNotification();
  
  // Instantiate SpaceDust
  spaceDust = new SpaceDust(80); // Adjust the maxParticles as needed
}

function draw() {
  // update and render the current game state
  gameStateManager.update();
  gameStateManager.render();
  
  // Update and render SpaceDust
  push();
  spaceDust.update();
  spaceDust.render();
  pop();
}

// Handle key presses for navigating game states
function keyPressed() {
  if (gameStateManager.currentState instanceof StartScreen) {
     if (key === ' ') {
      gameStateManager.handleInput('keyPressed');
     }
  } else if (gameStateManager.currentState instanceof ControlModeSelect) {
    if (key === 'a') {
      gameStateManager.handleInput('A');
    } else if (key === 'b') {
      gameStateManager.handleInput('B');
    } else if (key === ' ') {
      gameStateManager.handleInput(' ');
    }
  } else if (gameStateManager.currentState instanceof ConfigMenu) {
    // Handle spaceship selection
    if (key === '1') {
      gameStateManager.states.ConfigMenu.handleInput('1');
    } else if (key === '2') {
      gameStateManager.states.ConfigMenu.handleInput('2');
    }
    // Handle background selection
    else if (key === 'a') {
      gameStateManager.states.ConfigMenu.handleInput('a');
    } else if (key === 'b') {
      gameStateManager.states.ConfigMenu.handleInput('b');
    } else if (key === 'c') {
      gameStateManager.states.ConfigMenu.handleInput('c');
    } else if (key === 'd') {
      gameStateManager.states.ConfigMenu.handleInput('d');
    } else if (key === ' ') {
      gameStateManager.states.ConfigMenu.handleInput('keyPressed');
    }
  // Introduction Page
  } else if (gameStateManager.currentState instanceof Instruction) {
    if (key === ' ') {
      gameStateManager.handleInput('keyPressed');
    }
  } else if (gameStateManager.currentState instanceof WaitForPlayer) {
    if (key === ' ') {
      gameStateManager.handleInput(' ');
    }
  } else if (gameStateManager.currentState instanceof Gameplay) {
    if (key === 'Q' || key === 'q') {
      gameStateManager.handleInput('Q');
    } else if (key === 'X' || key === 'x') {
      gameStateManager.handleInput('X');
    }
  } else if (gameStateManager.currentState instanceof EndScreen) {
    if (key === 'H' || key === 'h') {
      gameStateManager.handleInput('H');
    } else if (key === 'P' || key === 'p') {
      gameStateManager.handleInput('C');
    } else if (key === ' ') {
      gameStateManager.handleInput(' ');
    }
  }
}

// Handle mouse presses
function mousePressed(enableMouseControl = false) {
  if (enableMouseControl === true) {
    if (gameStateManager.currentState instanceof StartScreen) {
      gameStateManager.handleInput('keyPressed');
    } else if (gameStateManager.currentState instanceof ConfigMenu) {
      gameStateManager.handleInput('keyPressed');
    } else if (gameStateManager.currentState instanceof Instruction) {
      gameStateManager.handleInput('keyPressed');
    } else if (gameStateManager.currentState instanceof EndScreen) {
      gameStateManager.handleInput('keyPressed');
    }
  }
}

// Function to send the BroadcastSend dictionary
function sendBroadcast() {

  // Update BroadcastSend dictionary
  let BroadcastSend = globalBroadcastSend;

  // Send the entire dictionary to the server to broadcast to other clients
  socket.emit('broadcast', BroadcastSend);
  // console.log('Sent broadcast:', BroadcastSend);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function calculateGamingZone() {
  // Calculate canvas size to maintain 4:3 aspect ratio
  let desiredAspect = 1 / 1;

  if (windowWidth / windowHeight > desiredAspect) {
    // Window is wider
    gamingZone.height = windowHeight
    gamingZone.width = gamingZone.height * desiredAspect;
  } else {
    // Window is taller
    gamingZone.width = windowWidth;
    gamingZone.height = gamingZone.width / desiredAspect;
  }
}

// Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGamingZone();
}

// The rest two functions comes from https://editor.p5js.org/mangtronix/full/t4G0erH1B
function keyTyped() {
  // $$$ For some reason on Chrome/Mac you may have to press f twice to toggle. Works correctly on Firefox/Mac
  if (key === 'f') {
    toggleFullscreen();
  }
  // uncomment to prevent any default behavior
  // return false;i
}

// Toggle fullscreen state. Must be called in response
// to a user event (i.e. keyboard, mouse click)
function toggleFullscreen() {
  let fs = fullscreen(); // Get the current state
  fullscreen(!fs); // Flip it!
}
