/* 
  Robot Hand Control
*/

// Array to hold current angles of each finger
let fingerAngles = [0, 0, 0, 0, 40, 30]; // Index, Middle, Ring, Pinky, Index2, Ring2
// [30, 60, 70, 70, 90, 60] angles of fingers when bent

// Finger Names
const fingerNames = ["Index", "Middle", "Ring", "Pinky", "Index2", "Ring2"];

// Servo Control Pins (matches Arduino pins)
const servoPins = [3, 4, 5, 6, 7, 8];

// Buttons and Sliders for Interactive Mode
let buttons = [];
let sliders = [];

// Mode State: 'automatic' or 'interactive'
let currentMode = 'interactive';

// Automatic Bending Variables
const bendInterval = 500; // Time between bends (milliseconds)
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
  for(let i = 0; i < 6; i++) {
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
  for(let i = 0; i < 6; i++) {
    // Create a slider for each finger
    let slider = createSlider(0, 180, 90);
    slider.position(200, 80 + i * 40);
    sliders.push(slider);
    
    // Create a button for each finger
    let btn = createButton(`Bend ${fingerNames[i]}`);
    btn.position(350, 80 + i*40);
    btn.mousePressed(() => bendFinger(i));
    btn.style('display', currentMode === 'interactive' ? 'block' : 'none');
    buttons.push(btn);
    
    // Label for slider
    let label = createSpan(` Angle: `);
    label.position(200, 60 + i * 40);
    let angleDisplay = createSpan(`${slider.value()}°`);
    angleDisplay.position(300, 60 + i * 40);
    // Update angle display as slider moves
    slider.input(() => {
      angleDisplay.html(`${slider.value()}°`);
    });
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
    sliders.forEach(slider => slider.show());
  } else {
    buttons.forEach(btn => btn.style('display', 'none'));
    sliders.forEach(slider => slider.hide());
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
    fingerAngles[currentFinger] = 30; // Bend to 90 degrees
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
  const bendAngle = sliders[fingerIndex].value();
  const releaseAngle = 0;
  
  // Bend the selected finger
  fingerAngles[fingerIndex] = bendAngle;
  sendAngles();
  
  // Release after 1 second
  setTimeout(() => {
    fingerAngles[fingerIndex] = releaseAngle;
    sendAngles();
  }, 500);
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

/*
#include <Servo.h>

// Define servo objects for each finger
Servo indexServo;
Servo middleServo;
Servo ringServo;
Servo pinkyServo;
Servo indexServo2;
Servo ringServo2;

// Define servo pins
const int indexPin = 3;
const int middlePin = 4;
const int ringPin = 5;
const int pinkyPin = 6;
const int indexPin2 = 7;
const int ringPin2 = 8;

// Array to hold servo objects for easy access
Servo servos[6];

// Blink LED while waiting for serial data
const int ledPin = LED_BUILTIN;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Attach servos to their respective pins
  servos[0].attach(indexPin);
  servos[1].attach(middlePin);
  servos[2].attach(ringPin);
  servos[3].attach(pinkyPin);
  servos[4].attach(indexPin2);
  servos[5].attach(ringPin2);
  
  // Initialize all servos to 0 degrees (open position)
  for(int i = 0; i < 6; i++) {
    servos[i].write(0);
    delay(100);
  }
  
  // Initialize LED pin
  pinMode(ledPin, OUTPUT);
  
  // Handshake: Wait for p5.js to send initial data
  while (Serial.available() <= 0) {
    digitalWrite(ledPin, HIGH); // LED on while waiting
    Serial.println("0,0,0,0,0,0"); // Send initial positions
    delay(300);
    digitalWrite(ledPin, LOW);
    delay(50);
  }
}

void loop() {
  // Check if data is available from p5.js
  while (Serial.available()) {
    digitalWrite(ledPin, HIGH); // LED on while receiving data
    
    // Read the incoming line
    String data = Serial.readStringUntil('\n');
    data.trim(); // Remove any trailing whitespace
    
    // Split the data by commas
    int angles[6];
    int currentIndex = 0;
    int lastComma = -1;
    for(int i = 0; i < data.length(); i++) {
      if(data[i] == ',') {
        angles[currentIndex++] = data.substring(lastComma + 1, i).toInt();
        lastComma = i;
      }
    }
    // Last value after the final comma
    angles[currentIndex] = data.substring(lastComma + 1).toInt();
    
    // Update servo positions
    for(int i = 0; i < 6; i++) {
      servos[i].write(angles[i]); // Set servo to desired angle
    }
    
    // Send back current sensor readings or status if needed
    // For now, echo back the angles
    Serial.print(angles[0]);
    for(int i = 1; i < 6; i++) {
      Serial.print(",");
      Serial.print(angles[i]);
    }
    Serial.println();
    
    digitalWrite(ledPin, LOW); // Turn off LED after processing
  }
}
*/
