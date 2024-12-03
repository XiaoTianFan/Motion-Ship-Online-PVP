class RobotHandController {
    constructor() {
      //
    }

    init() {
        //
      }
    
    update() {
      // Update finger bends to Arduino
      this.updateFingerAngles();
    }

    // Update Fingers according to the virtual keys
    updateFingerAngles() {
      // Stop function if no serial connection
      if (!serialActive) return;
    
      const keys = ['w', 'a', 's', 'd', 'x', 'space'];
      const angles = [30, 30, 30, 50, 60, 60]; // Different angles for each key
    
      for (let i = 0; i < 6; i++) {
        if (game.aiKeysPressed[keys[i]] === true) {
          if (fingerAngles[i] != angles[i]) {
            fingerAngles[i] = angles[i];
          } 
        } else {
        fingerAngles[i] = 0;
        }
      }
      this.sendAngles();
    }

    // Send Current Angles to Arduino via Serial
    sendAngles() {
      if (serialActive) {
        let message = fingerAngles.join(",") + "\n";
        writeSerial(message);
        console.log("Sent to Arduino:", message.trim());
      }
    }
}

/*
function readSerial(data) {
  // Handle incoming data from Arduino
  // For this project, we primarily send data to Arduino
}
  */