// Player.js

class Player {
  constructor(model, texture) { 
    this.model = model;
    this.texture = texture;
    this.x = 0;
    this.y = 0;
    this.z = 280; // Fixed Z-axis
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.health = 100;
    this.energy = 100;
    this.maxEnergy = 100;
    this.energyRegenRate = 0.175; // Energy regenerates over time
    this.laserCooldown = 100; // milliseconds
    this.lastLaserTime = 0;
    this.colliderRadius = 40; // Example radius for collision detection
    this.destroyCountdown = 90;
    this.tacticEngineStart = null;
    this.tacticEngineOn = false;
    this.tacticEngineUsed = false;
    this.toDestroy = false;
    this.state = null; // flag for if taking damage
    this.laserFired = 0;
    this.bornTime = millis();
  }

  update(pos) {
    if (this.toDestroy === false) {
      // Update position based on head movement (-1 to 1 mapped to screen space)
      let targetX = map(pos.x, -1, 1, -width * 1.5, width * 1.5);
      let targetY = map(pos.y, -1, 1, -height * 2, height * 2);
      this.x += (targetX - this.x) * 0.025;
      this.y += (targetY - this.y) * 0.025;
      
      // Constrain the postion within the gaming zone (2.87 approx. 3 calculated from triangular perspective: fovy = 0.5, camZ = 800, shipZ = 280)
      this.x = constrain(this.x, -gamingZone.width / 4, gamingZone.width / 4);
      this.y = constrain(this.y, -gamingZone.height / 4, gamingZone.height / 4);
      
      // Update rotation based on head movement
      this.rotationX = map(-pos.y, -1, 1, -PI / 6, PI / 6);
      this.rotationY = map(pos.x, -1, 1, -PI / 10, PI / 10);
      this.rotationZ = map(pos.x, -1, 1, -PI / 1.5, PI / 1.5);
      this.rotationZ = constrain(this.rotationZ, -PI / 3, PI / 3)
      
      // Tactic engine reset
      if (this.tacticEngineOn === true) {
        let currentTime = millis();
        if (this.model === assets.models.playerShip1) {
          this.health = 100;
        } else {
          this.energy = 100;
        }
        if (currentTime - this.tacticEngineStart > 15000) {
          this.tacticEngineOn = false;
          if (this.model === assets.models.playerShip1) {
            this.health = 100;
          } else {
            this.energy = 100;
          }
        }
      }
      
      // Regenerate energy
      if (this.energy < this.maxEnergy) {
        if (this.energy < 10) {
          this.energy += this.energyRegenRate * 0.5;
        } else {
          this.energy += this.energyRegenRate;
        }
        this.energy = constrain(this.energy, 0, this.maxEnergy);
      }
    }
  }

  render() {
    // Aiming ref line
    push();
    translate(this.x, this.y, this.z - 2000);
    rotateX(PI / 2);
    cylinder(0.5, 4000);
    pop();
    
    // The ship
    push();
    translate(this.x, this.y, this.z);
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);
    if (this.tacticEngineOn === true) {
      if (this.model === assets.models.playerShip1) {
        emissiveMaterial(0, 255, 0);
        fill('green');
      } else {
        emissiveMaterial(0, 255, 255);
        fill(0, 255, 255);
      }
    } else if (this.state == 'takingDamage') {
      emissiveMaterial(252, 252, 252);
      this.state = null;
    }

    if (this.tacticEngineOn === true) {
      if (this.model === assets.models.playerShip1) {
        emissiveMaterial(255, 255, 0);
        fill('green');
      } else {
        emissiveMaterial(255, 0, 255);
        fill(0, 255, 255);
      }
    } else if (this.state == 'takingDamage') {
      emissiveMaterial(252, 252, 252);
      this.state = null;
    }
    
    if (this.toDestroy === true) {
      this.destroyCountdown --;
      if (this.destroyCountdown <= 0) {
        this.destroy();
      }         
      if (this.destroyCountdown % 10 === 0) {
        fill('white');
        emissiveMaterial(255, 255, 255);
      } else {
        fill('blue');
      }
    } else {
      fill('blue');
    }

    // stroke(1);
    noStroke();
    shininess(80);
    model(this.model);
    pop();

    // status to debug
    /*
    push();
    fill(255);
    textFont(assets.fonts.ps2p);
    textSize(12);
    textAlign(LEFT, TOP);
    text(`Player X: ${this.x.toFixed(3)}`+`Y: ${this.y.toFixed(3)}`, this.x - 50, this.y - 75);
    pop();
    */
  }

  canFire() {
    let currentTime = millis();
    if (currentTime - gameStateManager.currentState.startTime > 200) {
      return (currentTime - this.lastLaserTime) > this.laserCooldown && this.energy >= 5;
    } else {
      return false;
    }
  }

  fireLaser() {
    let currentTime = millis();
    if (this.canFire() && (currentTime - this.bornTime > 2000)) {
      this.energy -= 5; // Energy cost per laser
      if (this.energy < 6) {
        globalNotification.update('Ran Out Of Energy!');
      }
      // Play laser sound
      soundManager.playSound('laserFire');
      // update laserfired num
      this.laserFired ++;
      this.lastLaserTime = millis();
      // Create and return a new LaserBeam instancex  
      return new LaserBeam(this.x, this.y, this.z);
    }
    return null;
  }
  
  tacticEngine() {
    if (this.tacticEngineUsed === false) {
      console.log('Tactic Engine ON!');
      game.eventLog.push('Tactic Engine ON!');
      this.tacticEngineStart = millis();
      this.tacticEngineOn = true;
      this.tacticEngineUsed = true;
      if (this.model === assets.models.playerShip2) {
        globalNotification.update('Tactic Engine ON!\nInfinite Energy For 15 SEC!');
      } else {
        globalNotification.update('Tactic Engine ON!\nIndestructible For 15 SEC!');
      }
    } else {
      console.log('Tactic Engine Already Used!');
    }
  }

  collectEnergy(ore) {
    this.energy += ore.size / 1.5; 
    this.energy = constrain(this.energy, 0, this.maxEnergy);
  }

  takeDamage(amount) {
    game.eventLog.push('Ship got hit!');
    this.health -= amount;
    this.state = 'takingDamage';
    if (this.health <= 0) {
      this.toDestroy = true;
    }
    soundManager.playSound('collision');
  }
  
  destroy() {
    // Handle player destruction 
    game.gameWL = false;
    soundManager.playSound('destruction');
    gameStateManager.changeState('EndScreen');
  }
}