class Background {
  constructor(texture) {
    this.texture = texture;
    this.xOffset = 0;
    this.yOffset = 0;
    this.playerPreviousX = null;
    this.playerPreviousY = null;
    this.parallaxFactor = 250; // Adjust for parallax strength
  }

  update(playerX, playerY) {
    let playerMovementX = playerX - this.playerPreviousX;
    let playerMovementY = playerY - this.playerPreviousY;
    
    // Calculate the background offset
    this.xOffset += playerMovementX * this.parallaxFactor;
    this.yOffset += playerMovementY * this.parallaxFactor;
    
    this.playerPreviousX = playerX;
    this.playerPreviousY = playerY; 
  }

  render() {
    push();
    translate(-this.xOffset, -this.yOffset, -5000); // Positioned far in the background
    noStroke();
    texture(this.texture);
    // Render a large plane to cover the background area
    plane(width * 7.5, height * 7.5);
    pop();
  }
}