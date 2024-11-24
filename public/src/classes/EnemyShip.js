class EnemyShip {
  constructor(model, texture) {
    this.model = model;
    this.texture = texture;
    this.x = 0;
    this.y = 0;
    this.z = -1800 // Start off-screen
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.state = null; // flag for taking damage
    this.health = 100;
    this.energy = 100;
    this.maxEnergy = 100;
    this.energyRegenRate = 0.1; // Energy regenerates over time
    this.laserCooldown = 100; // milliseconds
    this.lastLaserTime = null;
    this.colliderRadius = 40; // Example radius for collision detection
    this.destroyCountdown = 90;
    this.tacticEngineStart = null;
    this.tacticEngineOn = false;
    this.tacticEngineUsed = false;
    this.toDestroy = false;
  }

  update() {
    this.toDestroy = globalBroadcastGet.toDestroy;

    this.health = globalBroadcastGet.health;
    this.energy = globalBroadcastGet.energy;

    if (this.toDestroy === false) {
      this.x = globalBroadcastGet.x;
      this.y = globalBroadcastGet.y;
      
      // Update rotation based on head movement
      this.rotationX = globalBroadcastGet.rotationX;
      this.rotationY = globalBroadcastGet.rotationY;
      this.rotationZ = globalBroadcastGet.rotationZ;
      
      if (globalBroadcastGet.tacticEngineOn === true && this.tacticEngineUsed === false) {
        this.tacticEngine()
      }

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
    }
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rotateX(this.rotationX);
    rotateY(PI);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

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
        fill('red');
      }
    } else {
      fill('red');
    }

    // stroke(1);
    noStroke();
    shininess(90);
    model(this.model);
    pop(); 
  }
  
  canFire() {
    let currentTime = millis();
    return (currentTime - this.lastLaserTime) > this.laserCooldown;
  }
  
  fireLaser() {
    if (this.canFire()) {
      this.lastLaserTime = millis();
      // Play laser sound
      soundManager.playSound('laserFire');
      // Create and return a new EnemyLaser instance
      return new EnemyLaser(this.x, this.y, this.z);
    }
    return null;
  }

  isOutOfBounds() {
    return this.z > 310; // Assuming camera is at z = 0
  }

  tacticEngine() {
    if (this.tacticEngineUsed === false) {
      console.log('Enemy Tactic Engine ON!');
      game.eventLog.push('Enemy Tactic Engine ON!');
      this.tacticEngineStart = millis();
      this.tacticEngineOn = true;
      this.tacticEngineUsed = true;
      if (this.model === assets.models.enemyShip2) {
        globalNotification.update('Enemy Infinite Energy For 15 SEC!');
      } else {
        globalNotification.update('Enemy Indestructible For 15 SEC!');
      }
    } else {
      console.log('Enemy Tactic Engine Already Used!');
    }
  }

  takeDamage(amount) {
    game.eventLog.push('Enemy got hit!');
    this.state = 'takingDamage';
    // this.health -= amount;
    if (this.health <= 0) {
      this.toDestroy = true;
    }
    soundManager.playSound('collision');
    return false;
  }

  destroy() {
    game.gameWL = true;
    game.eventLog.push('Enemy destroyed!');
    // Play destruction sound
    soundManager.playSound('destruction');
    // Additional destruction effects can be added here
    this.toDelete = true;
    // Increase score or handle other game logic
    game.score += 500;
    game.eDestroyed ++;
    gameStateManager.changeState('EndScreen');
  }
}