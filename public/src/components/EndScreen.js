class EndScreen {
  // Displays the end game screen with the final score and options.
  constructor() {
    this.score = 0;
    this.prompt = "Press H to Home Page\nPress P to Replan Your Mission\nPress SPACE to Restart Your Mission";
    this.gameData = dataManager; // Reference to DataManager
    this.initTime = millis();
  }

  init() {
    globalBroadcastSend = {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      health: 100,
      energy: 100,
      tacticEngineOn: false,
      laserCooldown: 100, // milliseconds
      lastLaserTime: 0,
      colliderRadius: 30, // Example radius for collision detection
      destroyCountdown: 90,
      toDestroy: true,
      laserFired: 0,
      readyToPlay: false,
      currentComponent: 'EndScreen'
    }

    // reset laser count
    game.enemyLaserFired = 0;
    game.player.laserFired = 0;

    this.score = game.score;
    // Update high score if necessary
    dataManager.updateHighScore(this.score);
    // Reset game and spawnInterval
    game.objects = [];
    game.score = 0;
    game.enemies = [];
    game.enemyLaser = [];
    game.mDestroyed = 0;
    game.oDestroyed = 0;
    game.eDestroyed = 0;
    objectSpawner.spawnInterval = 2000;
    // Stop the sound
    soundManager.stopSound('backgroundMusic');
    if (configMenu.selectedBackground === 'background1') {
      soundManager.stopSound('backgroundMusic1'); 
    } else if (configMenu.selectedBackground === 'background2') {
      soundManager.stopSound('backgroundMusic2');
    } else if (configMenu.selectedBackground === 'background3') {
      soundManager.stopSound('backgroundMusic3');
    } else if (configMenu.selectedBackground === 'background4') {
      soundManager.stopSound('backgroundMusic4');
    }
    soundManager.playSound('gameOver');
  }

  update() {
    globalBroadcastSend = {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      health: 100,
      energy: 100,
      tacticEngineOn: false,
      laserCooldown: 100, // milliseconds
      lastLaserTime: 0,
      colliderRadius: 30, // Example radius for collision detection
      destroyCountdown: 90,
      toDestroy: true,
      laserFired: 0,
      readyToPlay: false,
      currentComponent: 'EndScreen'
    }

    if (game.controlMode === 'Robot' || game.controlMode === 'RobotWithoutHands') {
      if (globalBroadcastGet.currentComponent === 'ConfigMenu') {
        gameStateManager.changeState('ConfigMenu');
      } else if (globalBroadcastGet.currentComponent === 'WaitForPlayer') {
        gameStateManager.changeState('WaitForPlayer');
      }
    }
  }

  render() {
    background(10);
    push();
    textAlign(CENTER, CENTER);
    textFont(assets.fonts.ps2p);
    fill(255);
    textSize(windowWidth / 32);
    if (game.gameWL === false) {
      text("Mission Failed!", 0, -width / 30 * 2.1);
    } else if (game.gameWL === true || game.gameWL === null) {
      text("Mission Completed!", 0, -width / 30 * 2.1);
    }
    textSize(windowWidth / 64);
    text(`Games Played: ${this.gameData.getGamesPlayed()}`, 0, -width / 30 * 1);
    text(`Highest Score: ${this.gameData.getHighScore()}`, 0, 0);
    text(`Your Score: ${this.score}`, 0, width / 30 * 1);
    textAlign(CENTER, TOP);
    textSize(windowWidth / 64);
    text(this.prompt, 0, width / 30 * 2);
    pop();
  }

  handleInput(input) {
    let currentTime = millis();
    if (currentTime - this.initTime > 500) {
      if (input === 'H') { // Restart
        gameStateManager.changeState('StartScreen');
      } else if (input === 'C' || input === 'keyPressed') { // Reconfigure
        gameStateManager.changeState('ConfigMenu');
      } else if (input === ' ') {
        gameStateManager.changeState('WaitForPlayer');
      }
    }
  }
}