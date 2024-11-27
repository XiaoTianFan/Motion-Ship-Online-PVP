// ComputerPlayer.js

class ComputerPlayer extends Player {
    constructor(model, texture, difficulty = 1, behaviorPriority = 'attack') {
      super(model, texture);
      this.difficulty = difficulty; // Higher values mean smarter AI
      this.behaviorPriority = behaviorPriority; // 'survival' or 'attack'
      this.enemy = game.enemy; 
      this.lastActionTime = millis();
      this.actionCooldown = map(this.difficulty, 1, 10, 1000, 100); // in milliseconds
      this.actionQueue = []; // Queue of actions to perform
      this.firingRange = 100; // Define firing range threshold
    }
  
    updateAI() {
      this.enemy = game.enemy; 
      
      const currentTime = millis();
      if (currentTime - this.lastActionTime > this.actionCooldown) {
        console.log(`[AI][${this.behaviorPriority.toUpperCase()}] Deciding next action...`);
        this.decideNextAction();
        this.lastActionTime = currentTime;
      }
  
      // Execute actions from the queue
      this.executeActions();
    }
  
    decideNextAction() {
      // Determine behavior based on priority
      if (this.behaviorPriority === 'survival') {
        this.decideSurvivalActions();
      } else if (this.behaviorPriority === 'attack') {
        this.decideAttackActions();
      } else {
        // Default behavior
        this.decideAttackActions();
      }
    }
  
    decideSurvivalActions() {
      console.log(`[AI][SURVIVAL] Assessing survival strategies...`);
      // 1. Detect and handle threats
      let threats = this.detectThreats();
      if (threats.hasThreats) {
        console.log(`[AI][SURVIVAL] Threats detected: ${threats.allThreats.length} threats.`);
        if (threats.hasCriticalObjectThreat) {
          console.log(`[AI][SURVIVAL] Critical object threat detected. Attempting to destroy it.`);
          this.queueAction('fireAt', threats.criticalObject);
        }
        // Evade all detected threats
        let evadeDirection = this.calculateEvasionDirection(threats.allThreats);
        console.log(`[AI][SURVIVAL] Evasion direction: ${JSON.stringify(evadeDirection)}`);
        this.queueMovement(evadeDirection);
      } else {
        console.log(`[AI][SURVIVAL] No immediate threats detected.`);
        // 2. No immediate threats
        if (this.energy < 30) {
          console.log(`[AI][SURVIVAL] Energy low (${this.energy.toFixed(2)}). Seeking energy ore.`);
          // Move towards the closest energyOre to gain energy
          let closestEnergyOre = this.findClosestEnergyOre();
          if (closestEnergyOre) {
            console.log(`[AI][SURVIVAL] Closest energy ore at (${closestEnergyOre.x}, ${closestEnergyOre.y}). Moving towards it.`);
            this.moveTowardsObject(closestEnergyOre);
            this.queueAction('fireAt', closestEnergyOre); // Attempt to destroy it to collect energy
          } else {
            console.log(`[AI][SURVIVAL] No energy ore found. Proceeding to attack.`);
            // Move towards the enemy and attack
            this.moveTowardsEnemy();
            this.queueAction('fire');
          }
        } else {
          console.log(`[AI][SURVIVAL] Energy healthy (${this.energy.toFixed(2)}). Moving towards enemy to attack.`);
          // Move towards the enemy and attack
          this.moveTowardsEnemy();
          this.queueAction('fire');
        }
      }
  
      // 3. Utilize tactic engine if advantageous
      if (this.shouldUseTacticEngineSurvival()) {
        console.log(`[AI][SURVIVAL] Activating tactic engine.`);
        this.queueAction('activateTacticEngine');
      }
    }
  
    decideAttackActions() {
      console.log(`[AI][ATTACK] Assessing attack strategies...`);
      // 1. Detect and handle threats
      let threats = this.detectThreats();
      if (threats.hasThreats) {
        console.log(`[AI][ATTACK] Threats detected: ${threats.allThreats.length} threats.`);
        if (threats.hasCriticalObjectThreat) {
          console.log(`[AI][ATTACK] Critical object threat detected. Attempting to destroy it.`);
          this.queueAction('fireAt', threats.criticalObject);
        }
        // Evade all detected threats
        let evadeDirection = this.calculateEvasionDirection(threats.allThreats);
        console.log(`[AI][ATTACK] Evasion direction: ${JSON.stringify(evadeDirection)}`);
        this.queueMovement(evadeDirection);
      } else {
        console.log(`[AI][ATTACK] No immediate threats detected.`);
        // 2. No immediate threats
        if (this.energy < 30) {
          console.log(`[AI][ATTACK] Energy low (${this.energy.toFixed(2)}). Seeking energy ore.`);
          // Move towards the closest energyOre to gain energy
          let closestEnergyOre = this.findClosestEnergyOre();
          if (closestEnergyOre) {
            console.log(`[AI][ATTACK] Closest energy ore at (${closestEnergyOre.x}, ${closestEnergyOre.y}). Moving towards it.`);
            this.moveTowardsObject(closestEnergyOre);
            this.queueAction('fireAt', closestEnergyOre); // Attempt to destroy it to collect energy
          } else {
            console.log(`[AI][ATTACK] No energy ore found. Proceeding to attack.`);
            // Move towards the enemy and attack
            this.moveTowardsEnemy();
            this.queueAction('fireAt', this.enemy);
          }
        } else {
          console.log(`[AI][ATTACK] Energy healthy (${this.energy.toFixed(2)}). Moving towards enemy to attack.`);
          // Move towards the enemy and attack
          this.moveTowardsEnemy();
          this.queueAction('fireAt', this.enemy);
        }
      }
  
      // 3. Utilize tactic engine if advantageous
      if (this.shouldUseTacticEngineAttack()) {
        console.log(`[AI][ATTACK] Activating tactic engine.`);
        this.queueAction('activateTacticEngine');
      }
    }
  
    executeActions() {
      while (this.actionQueue.length > 0) {
        let action = this.actionQueue.shift();
        switch (action.type) {
          case 'move':
            console.log(`[AI][ACTION] Simulating movement: ${JSON.stringify(action.direction)} for ${action.duration}ms.`);
            this.simulateMovement(action.direction, action.duration);
            break;
          case 'fire':
            console.log(`[AI][ACTION] Simulating fire action.`);
            this.simulateFire();
            break;
          case 'fireAt':
            console.log(`[AI][ACTION] Simulating fire at target: ${action.target.type} at (${action.target.x}, ${action.target.y}).`);
            this.simulateFireAt(action.target);
            break;
          case 'activateTacticEngine':
            console.log(`[AI][ACTION] Simulating tactic engine activation.`);
            this.simulateTacticEngine();
            break;
          default:
            console.log(`[AI][ACTION] Unknown action type: ${action.type}`);
            break;
        }
      }
    }
  
    simulateMovement(direction, duration = 500) {
      // Log the movement simulation
      console.log(`[AI][MOVE] Simulating movement directions: ${JSON.stringify(direction)} for ${duration}ms.`);
  
      // Direction is an object { up: bool, down: bool, left: bool, right: bool }
      // Duration is in milliseconds; map duration to number of frames based on difficulty
      const frames = Math.max(Math.floor((duration / 1000) * 60 / (11 - this.difficulty)), 1); // Higher difficulty, fewer frames
      console.log(`[AI][MOVE] Calculated frames for movement: ${frames}`);
  
      for (let i = 0; i < frames; i++) {
        if (direction.up) game.aiKeysPressed.w = true;
        if (direction.down) game.aiKeysPressed.s = true;
        if (direction.left) game.aiKeysPressed.a = true;
        if (direction.right) game.aiKeysPressed.d = true;
      }
    }
  
    simulateFire() {
      console.log(`[AI][FIRE] Simulating space key press for firing laser.`);
      // Simulate pressing the space key
      game.aiKeysPressed.space = true;
    }
  
    simulateFireAt(target) {
      // Calculate distance to target before deciding to fire
      let distance = dist(this.x, this.y, target.x, target.y);
      console.log(`[AI][FIRE_AT] Distance to target (${target.type}): ${distance.toFixed(2)}.`);
  
      if (distance <= this.firingRange) {
        console.log(`[AI][FIRE_AT] Target within firing range (${this.firingRange}). Firing laser.`);
        // Target is close enough; simulate firing
        this.simulateFire();
      } else {
        console.log(`[AI][FIRE_AT] Target out of firing range (${this.firingRange}). Skipping fire.`);
        // Optional: Implement alternative actions if target is out of range
      }
    }
  
    simulateTacticEngine() {
      console.log(`[AI][TACTIC_ENGINE] Simulating 'x' key press for tactic engine activation.`);
      // Simulate pressing the 'x' key
      game.aiKeysPressed.x = true;
    }
  
    queueMovement(direction) {
      console.log(`[AI][QUEUE] Queuing movement: ${JSON.stringify(direction)}.`);
      this.actionQueue.push({ type: 'move', direction: direction, duration: 500 });
    }
  
    queueAction(actionType, target = null) {
      if (actionType === 'fireAt' && target) {
        console.log(`[AI][QUEUE] Queuing fireAt action for target: ${target.type} at (${target.x}, ${target.y}).`);
        this.actionQueue.push({ type: actionType, target: target });
      } else {
        console.log(`[AI][QUEUE] Queuing action: ${actionType}.`);
        this.actionQueue.push({ type: actionType });
      }
    }
  
    detectThreats() {
      let threatsFound = false;
      let criticalObjectThreat = null;
      let allThreats = [];
  
      const laserThreatRange = 150 * this.difficulty; // Adjustable based on difficulty
      const objectThreatRange = 200 * this.difficulty; // Larger range for objects
  
      // Detect laser threats
      for (let laser of game.enemyLaser) {
        let distance = dist(this.x, this.y, laser.x, laser.y);
        if (distance < laserThreatRange) {
          threatsFound = true;
          allThreats.push(laser);
          console.log(`[AI][DETECT] Laser threat detected at (${laser.x}, ${laser.y}) within range ${laserThreatRange}.`);
        }
      }
  
      // Detect object threats
      for (let obj of game.objects) {
        let distance = dist(this.x, this.y, obj.x, obj.y);
        if (distance < objectThreatRange) {
          // Additionally check z-axis proximity
          if ((obj.z - this.z) < 100) { // Threshold for z-axis proximity
            threatsFound = true;
            criticalObjectThreat = obj;
            allThreats.push(obj);
            console.log(`[AI][DETECT] Critical object threat detected: ${obj.type} at (${obj.x}, ${obj.y}) within range ${objectThreatRange} and z-proximity.`);
          } else {
            threatsFound = true;
            allThreats.push(obj);
            console.log(`[AI][DETECT] Object threat detected: ${obj.type} at (${obj.x}, ${obj.y}) within range ${objectThreatRange}.`);
          }
        }
      }
  
      return {
        hasThreats: threatsFound,
        hasCriticalObjectThreat: criticalObjectThreat !== null,
        criticalObject: criticalObjectThreat,
        allThreats: allThreats
      };
    }
  
    calculateEvasionDirection(threats) {
      // Determine evasion direction based on all threats
      let moveX = 0;
      let moveY = 0;
  
      for (let threat of threats) {
        let angle = atan2(this.y - threat.y, this.x - threat.x);
        moveX += cos(angle);
        moveY += sin(angle);
        console.log(`[AI][EVADE] Calculating evasion for threat at (${threat.x}, ${threat.y}). Angle: ${angle.toFixed(2)} radians.`);
      }
  
      // Normalize and determine direction
      if (moveX > 0.5) moveX = 1;
      else if (moveX < -0.5) moveX = -1;
      else moveX = 0;
  
      if (moveY > 0.5) moveY = 1;
      else if (moveY < -0.5) moveY = -1;
      else moveY = 0;
  
      return {
        up: moveY === 1,
        down: moveY === -1,
        left: moveX === -1,
        right: moveX === 1
      };
    }
  
    findClosestEnergyOre() {
      let energyOres = game.objects.filter(obj => obj.type === 'energyOre'); // Assuming objects have a 'type' property
      if (energyOres.length === 0) {
        console.log(`[AI][ENERGY] No energy ore available to collect.`);
        return null;
      }
  
      let closest = energyOres[0];
      let minDistance = dist(this.x, this.y, closest.x, closest.y);
  
      for (let ore of energyOres) {
        let distance = dist(this.x, this.y, ore.x, ore.y);
        if (distance < minDistance) {
          closest = ore;
          minDistance = distance;
        }
      }
  
      console.log(`[AI][ENERGY] Closest energy ore found at (${closest.x}, ${closest.y}) with distance ${minDistance.toFixed(2)}.`);
      return closest;
    }
  
    moveTowardsObject(target) {
      // Determine direction towards the target object
      let dx = target.x - this.x;
      let dy = target.y - this.y;
  
      let direction = {
        up: dy > 20,
        down: dy < -20,
        left: dx < -20,
        right: dx > 20
      };
  
      console.log(`[AI][MOVE_TO_OBJECT] Moving towards ${target.type} at (${target.x}, ${target.y}). Direction: ${JSON.stringify(direction)}.`);
      this.queueMovement(direction);
    }
  
    moveTowardsEnemy() {
      // Determine direction towards the enemy
      let dx = this.enemy.x - this.x;
      let dy = this.enemy.y - this.y;
  
      let direction = {
        up: dy > 20,
        down: dy < -20,
        left: dx < -20,
        right: dx > 20
      };
  
      console.log(`[AI][MOVE_TO_ENEMY] Moving towards enemy at (${this.enemy.x}, ${this.enemy.y}). Direction: ${JSON.stringify(direction)}.`);
      this.queueMovement(direction);
    }
  
    shouldUseTacticEngineSurvival() {
      // Decide whether to activate tactic engine based on health and energy
      if (!this.tacticEngineUsed) {
        if (this.health < 30 || this.energy < 30) {
          console.log(`[AI][TACTIC_ENGINE] Conditions met for tactic engine activation (Health: ${this.health}, Energy: ${this.energy}).`);
          return true;
        }
      }
      return false;
    }
  
    shouldUseTacticEngineAttack() {
      // Decide whether to activate tactic engine based on attack advantage
      if (!this.tacticEngineUsed) {
        if (this.health < 30 || this.energy < 30) {
          console.log(`[AI][TACTIC_ENGINE] Conditions met for tactic engine activation (Health: ${this.health}, Energy: ${this.energy}).`);
          return true;
        }
        if (this.model === assets.models.playerShip2) {
          // Additional condition: If enemy health is low and need more energy to destroy it
          if (game.enemy.health < 50 && this.energy > 70) {
            console.log(`[AI][TACTIC_ENGINE] Additional condition met for playerShip2: Enemy health is low (${game.enemy.health}).`);
            return true;
          }
        }
      }
      return false;
    }
  
    render() {
      // Optionally, add indicators or different visuals for ComputerPlayer
      super.render();
      // Example: Draw AI status
      push();
      fill(255);
      textFont(assets.fonts.ps2p);
      textSize(12);
      textAlign(LEFT, TOP);
      text(`AI Difficulty: ${this.difficulty}`, this.x - 50, this.y - 60);
      text(`Priority: ${this.behaviorPriority}`, this.x - 50, this.y - 45);
      pop();
    }
  }