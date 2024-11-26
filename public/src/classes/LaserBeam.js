class LaserBeam {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speed = 200; // Speed along negative Z-axis
    this.colliderRadius = 70; 
    this.toDelete = false;
  }

  update() {
    this.z -= this.speed;
    if (this.z < -4500) { 
      this.toDelete = true;
    }
  }

  render() {
    // Render a simple laser beam
    push();
    translate(this.x, this.y, this.z);
    rotateX(PI / 2);
    emissiveMaterial(0, 255, 255);
    fill(0, 255, 255);
    noStroke(255,255,255);
    cylinder(2.5, 150);
    pop();
  }

  checkCollision(objects, enemy) {
    for (let obj of [...objects, enemy]) {
      if (CollisionDetector.checkSphereCollision(this, obj)) {
        // Apply damage to the object
        let destroyed = obj.takeDamage(5); // damage value
        if (destroyed) {
          // Increase score based on object type
          if (obj instanceof EnemyShip) {
            game.score += 200;
          } else if (obj instanceof Meteoroid) {
            game.score += 50;
          } else if (obj instanceof EnergyOre) {
            game.score += 100;
          }
        }
        this.toDelete = true; // Laser beam is destroyed upon hitting an object
        break;
      }
    }
  }
}