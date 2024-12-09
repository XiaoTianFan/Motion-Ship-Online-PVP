class RobotHandController {
    constructor() {
      this.lastUpdateTime = millis();
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
      // Stop function if no serial connections
      if (!serialActive) return;

      let currentTime = millis();

      const keys = ['w', 'a', 's', 'd', 'space', 'x'];
      const angles = [30, 50, 50, 55, 70, 70]; // Different angles for each key
    
      for (let i = 0; i < 6; i++) {
        if (game.aiKeysPressed[keys[i]] === true) {
          if (fingerAngles[i] != angles[i]) {
            fingerAngles[i] = angles[i];
          } 
        }
      }

      // Send data every second
      if (frameCount % 120 === 0) {
        this.sendAngles(fingerAngles);
        
        // Schedule Release
        setTimeout(() => {
          console.log('reached')
          this.sendAngles(fingerDefaultAngles);
        }, 2000 / 2);
      }
      
      this.lastUpdateTime = currentTime;
      
    }

    // Send Current Angles to Arduino via Serial
    sendAngles(angles) {
      if (serialActive) {
        let message = angles.join(",") + "\n";
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