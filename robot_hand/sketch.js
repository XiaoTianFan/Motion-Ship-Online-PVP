/* 
  Robot Hand Control
*/

// Array to hold current angles of each finger
let fingerAngles = [0, 0, 0, 0, 0]; // Thumb, Index, Middle, Ring, Pinky

// Finger Names
const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

// Servo Control Pins (matches Arduino pins)
const servoPins = [3, 4, 5, 6, 7];

// Buttons for Interactive Mode
let buttons = [];

// Mode State: 'automatic' or 'interactive'
let currentMode = 'interactive';

// Automatic Bending Variables
const bendInterval = 2000; // Time between bends (milliseconds)
let currentFinger = 0; // Index of the current finger to bend
let lastBendTime = 0;

// UI Elements
let modeDisplay;

function setup() {
  createCanvas(600, 400);
  textSize(18);
  
  // Create UI Elements
  createUI();
  
  // Prompt user to select mode
  // Initial mode is 'interactive'
  displayMode();
}

function draw() {
  background(240);
  
  // Display Mode
  displayMode();
  
  // Display Instructions
  if (!serialActive) {
    fill(0);
    text("Press Space Bar to connect Serial Port", 20, height - 30);
    return;
  }
  
  // Display Finger Angles
  fill(0);
  for(let i = 0; i < 5; i++) {
    text(`${fingerNames[i]}: ${fingerAngles[i]}°`, 40, 100 + i*40);
  }
  
  // Handle Automatic Mode
  if (currentMode === 'automatic') {
    handleAutomaticMode();
  }
}

// Create UI Elements for Interactive Mode
function createUI() {
  // Interactive Mode Buttons
  for(let i = 0; i < 5; i++) {
    let btn = createButton(`Bend ${fingerNames[i]}`);
    btn.position(350, 80 + i*40);
    btn.mousePressed(() => bendFinger(i));
    btn.style('display', currentMode === 'interactive' ? 'block' : 'none');
    buttons.push(btn);
  }
  
  // Mode Display
  modeDisplay = createDiv('');
  modeDisplay.position(20, 20);
  modeDisplay.style('font-size', '20px');
  modeDisplay.style('font-weight', 'bold');
}

// Display Current Mode and Toggle Instructions
function displayMode() {
  modeDisplay.html(`Current Mode: ${capitalize(currentMode)}`);
  
  // Show or Hide Buttons Based on Mode
  if (currentMode === 'interactive') {
    buttons.forEach(btn => btn.style('display', 'block'));
  } else {
    buttons.forEach(btn => btn.style('display', 'none'));
  }
  
  // Instructions
  fill(0);
  text("Press 'A' for Automatic Mode, 'I' for Interactive Mode", 20, height - 60);
  text("Press Space Bar to connect Serial Port", 20, height - 30);
}

// Handle Key Presses for Mode Selection and Serial Connection
function keyPressed() {
  if (key === 'A' || key === 'a') {
    currentMode = 'automatic';
    resetAutomaticMode();
  }
  
  if (key === 'I' || key === 'i') {
    currentMode = 'interactive';
  }
  
  if (key === ' ') {
    // Initialize or Re-initialize Serial Connection
    setUpSerial().then(() => {
      serialActive = true;
      console.log("Serial connection established.");
    }).catch(err => {
      console.error("Serial connection failed:", err);
    });
  }
}

// Handle Automatic Mode Bending
function handleAutomaticMode() {
  let currentTime = millis();
  
  if (currentTime - lastBendTime > bendInterval) {
    // Bend Current Finger
    fingerAngles[currentFinger] = 90; // Bend to 90 degrees
    sendAngles();
    
    // Schedule Release
    setTimeout(() => {
      fingerAngles[currentFinger] = 0; // Release to 0 degrees
      sendAngles();
    }, bendInterval / 2);
    
    // Move to Next Finger
    currentFinger = (currentFinger + 1) % 5;
    
    // Update Last Bend Time
    lastBendTime = currentTime;
  }
}

// Reset Automatic Mode Variables
function resetAutomaticMode() {
  currentFinger = 0;
  lastBendTime = millis();
}

// Bend a Specific Finger (Interactive Mode)
function bendFinger(fingerIndex) {
  if (!serialActive || currentMode !== 'interactive') return;
  
  // Define bend and release angles
  const bendAngle = 90;
  const releaseAngle = 0;
  
  // Bend the selected finger
  fingerAngles[fingerIndex] = bendAngle;
  sendAngles();
  
  // Release after 1 second
  setTimeout(() => {
    fingerAngles[fingerIndex] = releaseAngle;
    sendAngles();
  }, 1000);
}

// Send Current Angles to Arduino via Serial
function sendAngles() {
  if (serialActive) {
    let message = fingerAngles.join(",") + "\n";
    writeSerial(message);
    console.log("Sent to Arduino:", message.trim());
  }
}

// Utility Function to Capitalize First Letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// This function will be called by the wieb-serial library
function readSerial(data) {
  // Handle incoming data from Arduino
  // For this project, we primarily send data to Arduino
  console.log("Received from Arduino:", data);
}

// Arduino Code:
// - Arduino expects a comma-separated list of 5 angles ending with a newline ("\n")
// - Example: "90,0,0,0,0\n" bends the thumb to 90 degrees

