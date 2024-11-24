class FaceTracker {
  constructor() {
    this.video = null;
    this.facemesh = null;
    this.detected = false;
    this.positions = { x: 0, y: 0 };
  }

  init() {
    this.getHeadPosition();
  }
  
  /**
   * Retrieves the current head position.
   * @returns {Object} An object containing normalized x and y positions.
   */
  getHeadPosition() {
    if (faces) {
      if (faces.length > 0) {
        this.detected = true;
        // Assuming the first detected face is the player's
        let keypoints = faces[0].keypoints;

        // Select a specific keypoint for head position, keypoint [1] for the nose tip
        let noseTip = keypoints[1];

        // Extract x and y positions of the nose tip
        let noseX = noseTip.x; // X-coordinate
        let noseY = noseTip.y; // Y-coordinate

        // Normalize positions to range [-1, 1]
        this.positions.x = map(noseX, 0, video.width, -1, 1);
        this.positions.y = map(noseY, 0, video.height, -1, 1);
      }
    } else {
      // If no face is detected, reset positions
      this.detected = false;
      this.positions.x = 0;
      this.positions.y = 0;
      console.log('No face tracked');
    }
    
    return this.positions;
  }
}