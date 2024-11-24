class Meteoroid {
  constructor(model, texture) {
    this.model = model;
    this.texture = texture;
    this.x = random(-gamingZone.width / 3, gamingZone.width / 3);
    this.y = random(-gamingZone.height / 3, gamingZone.height / 3);
    this.z = random(-5000, -5400);
    this.size = random(30, 200); // Size variation
    this.colliderRadius = 90 * this.size / 120;
    this.seed = random();
    this.health = this.size / 10; // Health proportional to size
    this.state = null;
    
    /*
    // Get the bounding box of the model
    let bbox = this.model.calculateBoundingBox();
    console.log(bbox);
    */
  }

  update() {
    this.z += 20; // Base speed towards the player    
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rotateX( - this.seed * radians(frameCount / 2));
    rotateY( + 2 * this.seed * radians(frameCount / 2));
    rotateZ( - 2 * this.seed * radians(frameCount / 2));
    scale(this.size / 100); // Scale based on size
    if (this.state == 'takingDamage') {
      emissiveMaterial(252, 252, 252);
      this.state = null;
    }
    texture(this.texture);
    model(this.model);
    pop();
  }

  isOutOfBounds() {
    return this.z > 310;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
      return true; // Indicates that the meteoroid was destroyed
    }
    soundManager.playSound('collision');
    this.state = 'takingDamage';
    return false;
  }

  destroy() {
    game.eventLog.push('Meteoroid destroyed!');
    // Play destruction sound
    soundManager.playSound('destruction');
    // Replenish player's energy if desired or handle game logic
    game.score += 50; // Example score increment
    game.mDestroyed ++;
    this.toDelete = true;
  }
}