class ObjectSpawner {
  constructor() {
    this.spawnInterval = 2000; // Initial spawn every 2 seconds
    this.lastSpawnTime = millis();
  }

  update() {
    let currentTime = millis();
    if (currentTime - this.lastSpawnTime > this.spawnInterval) {
      this.spawnObject();
      this.lastSpawnTime = currentTime;

      // Optionally decrease interval over time to increase difficulty
      if (this.spawnInterval > 150) {
        this.spawnInterval -= 25;
      }
    }

    // Update all objects
    for (let obj of game.objects) {
      obj.update();
    }
    game.enemy.update();

    // Remove objects that are out of bounds or marked for deletion
    game.objects = game.objects.filter(obj => !obj.isOutOfBounds() && !obj.toDelete);
  }

  render() {
    for (let obj of game.objects) {
      obj.render();
    }
    game.enemy.render();
  }

  spawnObject() {
    let rand = random();
    if (rand < 0.5) { // 40% Meteoroid
      let meteoroidModel = random(['meteoroid1', 'meteoroid2', 'meteoroid3', 'meteoroid4']);
      let meteoroid = new Meteoroid(assets.models[meteoroidModel], assets.textures.meteoroid);
      game.objects.push(meteoroid);
    }  else { // 30% Energy Ore
      let energyOreModel = random(['meteoroid1', 'meteoroid2', 'meteoroid3', 'meteoroid4']);
      let energyOre = new EnergyOre(assets.models[energyOreModel], assets.textures.energyOre);
      game.objects.push(energyOre);
    }
  }

  checkCollisions() {
    // && game.player.models === assets.models.playerShip1
    // console.log(game.player.model);
    for (let obj of game.objects) {
      if (CollisionDetector.checkSphereCollision(obj, game.player)) {
        // Collision detected between player and object
        if (game.player.tacticEngineOn === true && game.player.model === assets.models.playerShip1) {
          obj.destroy();
        } else {
          soundManager.playSound('collision');
          game.player.takeDamage(0);
          // game.player.toDestroy = true;
          // REMOVE THIS COMMENT /////////////////////////////////////////
        }
      }
    }
  }
}