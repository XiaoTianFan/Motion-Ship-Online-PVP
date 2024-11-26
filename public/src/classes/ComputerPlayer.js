// ComputerPlayer.js

class ComputerPlayer extends Player {
    constructor(model, texture, difficulty = 1, behaviorPriority = 'attack') {
      super(model, texture);
      this.difficulty = difficulty; // Higher values mean smarter AI
      this.behaviorPriority = behaviorPriority; // 'survival' or 'attack'
      this.target = game.enemy; 
      this.lastActionTime = millis();
      this.actionCooldown = map(this.difficulty, 1, 10, 1000, 100); // in milliseconds
      this.actionQueue = []; // Queue of actions to perform
    }
  
    updateAI() {
      const currentTime = millis();
      if (currentTime - this.lastActionTime > this.actionCooldown) {
        this.decideNextAction();
        this.lastActionTime = currentTime;
      }
  
      // Execute actions from the queue
      this.executeActions();
  
      // Regenerate energy as usual
      super.update({ x: this.x, y: this.y });
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
      // Prioritize avoiding threats
      let shouldAvoid = this.detectThreats();
  
      if (shouldAvoid) {
        // Decide direction to evade
        let evadeDirection = this.calculateEvasionDirection();
        this.queueMovement(evadeDirection);
      } else {
        // Move towards energy or tactical advantage
        this.moveTowardsStrategicPosition();
        // Optionally, fire if enemy is in range
        this.queueAction('fire');
      }
  
      // Utilize tactic engine if advantageous
      if (this.shouldUseTacticEngineSurvival()) {
        this.queueAction('activateTacticEngine');
      }
    }
  
    decideAttackActions() {
      // Focus on aggressive strategies
      // Move towards enemy to optimize firing
      this.moveTowardsEnemy();
  
      // Fire lasers if possible
      this.queueAction('fire');
  
      // Utilize tactic engine if advantageous
      if (this.shouldUseTacticEngineAttack()) {
        this.queueAction('activateTacticEngine');
      }
    }
  
    executeActions() {
      while (this.actionQueue.length > 0) {
        let action = this.actionQueue.shift();
        switch (action.type) {
          case 'move':
            this.simulateMovement(action.direction, action.duration);
            break;
          case 'fire':
            this.simulateFire();
            break;
          case 'activateTacticEngine':
            this.simulateTacticEngine();
            break;
          default:
            break;
        }
      }
    }
  
    simulateMovement(direction, duration) {
      // Direction can be an object like { x: 1, y: 0 } representing 'd' key
      // Duration is in milliseconds; since update is frame-based, map duration to number of frames
      const frames = map(this.difficulty, 1, 10, 60, 6); // Higher difficulty, fewer frames
  
      for (let i = 0; i < frames; i++) {
        if (direction.up) game.aiKeysPressed.w = true;
        if (direction.down) game.aiKeysPressed.s = true;
        if (direction.left) game.aiKeysPressed.a = true;
        if (direction.right) game.aiKeysPressed.d = true;
        // Note: This simplistic approach may need refinement for overlapping directions
      }
    }
  
    simulateFire() {
      // Simulate pressing the space key
      game.aiKeysPressed.space = true;
    }
  
    simulateTacticEngine() {
      // Simulate pressing the 'x' key
      game.aiKeysPressed.x = true;
    }
  
    queueMovement(direction) {
      this.actionQueue.push({ type: 'move', direction: direction, duration: 500 });
    }
  
    queueAction(actionType) {
      this.actionQueue.push({ type: actionType });
    }
  
    detectThreats() {
      // Simple threat detection: check if any enemy lasers are within a certain range
      let threats = game.enemyLaser;
      let threatRange = 150 * this.difficulty; // Adjustable based on difficulty
      for (let threat of threats) {
        let distance = dist(this.x, this.y, threat.x, threat.y);
        if (distance < threatRange) {
          return true;
        }
      }
      return false;
    }
  
    calculateEvasionDirection() {
      // Determine the safest direction to evade based on threat positions
      let threats = game.enemyLaser;
      let moveX = 0;
      let moveY = 0;
  
      for (let threat of threats) {
        let angle = atan2(this.y - threat.y, this.x - threat.x);
        moveX += cos(angle);
        moveY += sin(angle);
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
  
    moveTowardsEnemy() {
      // Determine direction towards the enemy
      let dx = game.enemy.x - this.x;
      let dy = game.enemy.y - this.y;
  
      let direction = {
        up: dy > 20,
        down: dy < -20,
        left: dx < -20,
        right: dx > 20
      };
  
      this.queueMovement(direction);
    }
  
    moveTowardsStrategicPosition() {
      // Example: Move towards center or energy power-ups
      let targetX = 0;
      let targetY = 0;
  
      let dx = targetX - this.x;
      let dy = targetY - this.y;
  
      let direction = {
        up: dy > 20,
        down: dy < -20,
        left: dx < -20,
        right: dx > 20
      };
  
      this.queueMovement(direction);
    }
  
    shouldUseTacticEngineSurvival() {
      // Decide whether to activate tactic engine based on health and energy
      if (!this.tacticEngineUsed) {
        if (this.model === assets.models.playerShip1 && this.health < 50) {
          return true; // Activate indestructible mode
        } else if (this.model === assets.models.playerShip2 && this.energy < 50) {
          return true; // Activate infinite energy
        }
      }
      return false;
    }
  
    shouldUseTacticEngineAttack() {
      // Decide whether to activate tactic engine based on attack advantage
      if (!this.tacticEngineUsed) {
        if (this.model === assets.models.playerShip1 && this.health > 80) {
          return true; // Activate indestructible mode for aggressive attacks
        } else if (this.model === assets.models.playerShip2 && this.energy > 80) {
          return true; // Activate infinite energy for sustained attacks
        }
      }
      return false;
    }
  }