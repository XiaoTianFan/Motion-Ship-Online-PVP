class EnergyOre {
  constructor(model, texture) {
    this.model = model;
    this.texture = texture;
    this.x = random(-gamingZone.width / 3, gamingZone.width / 3);
    this.y = random(-gamingZone.height / 3, gamingZone.height / 3);
    this.z = random(-5000, -5400); // Start off-screen
    this.size = random(30, 180); // Size variation
    this.colliderRadius = 90 * this.size / 120;
    this.seed = random();
    this.health = this.size / 5; // Health proportional to size
    this.state = null;
  }

  update() {
    this.z += 20; // Base speed towards the player
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rotateX( - 2 * this.seed * radians(frameCount / 2));
    rotateY( + 2 * this.seed * radians(frameCount / 2));
    rotateZ( - this.seed * radians(frameCount / 2));
    scale(this.size / 90); // Scale based on size
    if (this.state == 'takingDamage') {
      emissiveMaterial(255, 255, 255);
      this.state = null;
    } else {
      emissiveMaterial(100, 255, 255);
    }
    texture(this.texture);
    shininess(100);
    model(this.model);
    pop();
  }

  isOutOfBounds() {
    return this.z > 310;
  }

  takeDamage(amount) {
    this.health -= amount;
    this.state = 'takingDamage';
    if (this.health <= 0) {
      this.activateEnergyReplenish();
      this.destroy();
      return true; // Indicates that the energy ore was destroyed
    }
    soundManager.playSound('collision');
    return false;
  }

  activateEnergyReplenish() {
    // Replenish player's energy based on size
    if (game.player) {
      game.player.collectEnergy(this);
    }
  }

  destroy() {
    game.eventLog.push('Ore destroyed!');
    // Play destruction sound
    soundManager.playSound('destruction');
    // Increase score or handle other game logic
    game.score += 100; // Example score increment
    game.oDestroyed ++;
    this.toDelete = true;
  }
}