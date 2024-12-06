class EnemyLaser {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.speed = 200; // Speed along negative Z-axis
    this.colliderRadius = 70; // Small radius for collision detection
    this.toDelete = false;
  }

  update() {
    this.z += this.speed;
    if (this.z > 400) { 
      this.toDelete = true;
    }
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(PI / 2);
    emissiveMaterial(255, 0, 255);
    fill(255, 0, 255);
    noStroke(255,255,255);
    cylinder(4, 150); 
    pop();
  }

  checkCollision() {
    if (CollisionDetector.checkSphereCollision(this, game.player)) {
      game.player.takeDamage(0);
      this.toDelete = true;
    }
  }
}