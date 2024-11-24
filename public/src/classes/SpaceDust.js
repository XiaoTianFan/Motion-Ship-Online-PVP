class SpaceDust {
  constructor(maxParticles = 50) {
    this.maxParticles = maxParticles;
    this.particles = [];
    this.spawnRate = 2; // Number of particles to spawn each frame
    this.initParticles();
  }

  // Initializes the particles array with empty particles.
  initParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  /*
  Creates a single dust particle with random properties.
  @returns {Object} A particle with position, velocity, size, and lifespan.
  */
  createParticle() {
    return {
      pos: createVector(random(-gamingZone.width / 2, gamingZone.width / 2), random(-gamingZone.height / 2, gamingZone.height / 2), -random(1000, 1500)),
      vel: createVector(0, 0, random(80, 100)), // random Z speed
      size: random(2, 4),
      lifespan: random(50, 200) // Frames the particle will live
    };
  }

  // Updates all particles: moves them forward and resets them if necessary.
  update() {
    for (let i = 0; i < this.maxParticles; i++) {
      let p = this.particles[i];
      p.pos.add(p.vel);
      p.lifespan --;

      // If the particle has passed the player or its lifespan ended, reset it
      if (p.pos.z > 300 || p.lifespan <= 0) {
        this.particles[i] = this.createParticle();
      }
    }
  }

   // Renders all particles onto the screen.
  render() {
    push();
    // Enable additive blending for a glowing effect
    blendMode(ADD);
    for (let p of this.particles) {
      push();
      translate(p.pos.x, p.pos.y, p.pos.z);
      noStroke();
      fill(255, 255, 255, map(p.lifespan, 0, 200, 50, 255)); // Fade out based on lifespan
      sphere(p.size);
      pop();
    }
    blendMode(BLEND); // Reset to default blending
    pop();
  }
}