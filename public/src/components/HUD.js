class HUD {
  constructor() {
    this.energy = 100;
    this.score = 0;
  }

  update(energy, score) {
    this.energy = energy;
    this.score = score;
  }

  render() {
    // Tactic Engine Countdown
    if (game.player.tacticEngineOn === true) {
      push();
      let tacticEngineWidth = map(15000 - (millis() - game.player.tacticEngineStart), 0, 15000, 0, gamingZone.height / 2 - gamingZone.height / 4 * 0.5);
      translate(0, -gamingZone.height / 4 + gamingZone.height / 4 * 0.3, 400);
      fill(245, 245, 245, 245);
      textFont(assets.fonts.ps2p);
      textSize(gamingZone.height / 110);
      textAlign(CENTER, TOP);
      text(`Tactic Engine Countdown`, 0, 0);
      // Tactic Engine Bar Background
      noStroke();
      fill(0, 255, 255);
      rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, tacticEngineWidth, 5);
      pop();
    } else {
      if (game.player.tacticEngineUsed === false) {
        push();
        translate(0, -gamingZone.height / 4 + gamingZone.height / 4 * 0.3, 400);
        fill(245, 245, 245, 245);
        textFont(assets.fonts.ps2p);
        textSize(gamingZone.height / 110);
        textAlign(CENTER, BOTTOM);
        text(`Tactic Engine Ready`, 0, 0);
        pop();
      } else {
        push();
        translate(0, -gamingZone.height / 4 + gamingZone.height / 4 * 0.3, 400);
        fill(245, 245, 245, 245);
        textFont(assets.fonts.ps2p);
        textSize(gamingZone.height / 110);
        textAlign(CENTER, BOTTOM);
        text(`Tactic Engine Used`, 0, 0);
        pop();
      }
    }
    
    // Enemy Meter Bar Background
    push();
    translate(0, -gamingZone.height / 4 + gamingZone.height / 4 * 0.175, 400);
    fill(245, 245, 245, 245);
    textFont(assets.fonts.ps2p);
    textSize(gamingZone.height / 110);
    textAlign(CENTER, TOP);
    text('Enemy Health', 0, 0);

    noStroke();
    fill(255, 0, 0);
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, gamingZone.height / 2 - gamingZone.height / 4 * 0.5, 5);

    // Enemy Meter Bar Fill
    fill(200, 0, 200);
    let enemyWidth = map(constrain(game.enemy.health, 0, 100), 0, 100, 0, gamingZone.height / 2 - gamingZone.height / 4 * 0.5);
    if (game.enemy.tacticEngineOn === true && game.enemy.model === assets.models.playerShip1) {
      enemyWidth = gamingZone.height / 2 - gamingZone.height / 4 * 0.5;
    }
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, enemyWidth, 5);
    pop();


    // Render Health Label
    push();
    translate(0, gamingZone.height / 4 - gamingZone.height / 4 * 0.375, 400);
    fill(245, 245, 245, 245);
    textFont(assets.fonts.ps2p);
    textSize(gamingZone.height / 110);
    textAlign(CENTER, TOP);
    text('Player Health', 0, 0);

    // Health Meter Bar Background
    noStroke();
    fill(255, 0, 0);
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, gamingZone.height / 2 - gamingZone.height / 4 * 0.5, 5);

    // Health Meter Bar Fill
    fill(0, 185, 60);
    let healthWidth = map(constrain(game.player.health, 0, 100), 0, 100, 0, gamingZone.height / 2 - gamingZone.height / 4 * 0.5);
    if (game.player.tacticEngineOn === true && game.player.model === assets.models.playerShip1) {
      healthWidth = gamingZone.height / 2 - gamingZone.height / 4 * 0.5;
    }
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, healthWidth, 5);
    pop();
    
    
    // Render Energy Meter
    push();
    translate(0, gamingZone.height / 4 - gamingZone.height / 4 * 0.275, 400);
    fill(245, 245, 245, 245);
    textFont(assets.fonts.ps2p);
    textSize(gamingZone.height / 110);
    textAlign(CENTER, TOP);
    text('Laser Energy', 0, 0);

    // Energy Meter Bar Background
    noStroke();
    fill(255, 0, 0);
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, gamingZone.height / 2 - gamingZone.height / 4 * 0.5, 5);

    // Energy Meter Bar Fill
    fill(0, 0, 255);
    let energyWidth = map(this.energy, 0, 100, 0, gamingZone.height / 2 - gamingZone.height / 4 * 0.5);
    if (game.player.tacticEngineOn === true && game.player.model === assets.models.playerShip2) {
      energyWidth = gamingZone.height / 2 - gamingZone.height / 4 * 0.5;
    }
    rect(-gamingZone.height / 4 + gamingZone.height / 4 * 0.25, gamingZone.height / 4 * 0.05, energyWidth, 5);
    pop();
    
    // Render Window
    // Top
    push();
    translate(0, -gamingZone.height / 4 + gamingZone.height / 4 * 0.0763, 400); // width of img / height = 95 / 720 = 0.0763
    noStroke();
    texture(assets.textures.windowViewT);
    plane(gamingZone.width / 2, gamingZone.height / 2 * 0.0763);
    pop();
    // Bottom
    push();
    translate(0, gamingZone.height / 4 - gamingZone.height / 4 * 0.0763, 400); 
    noStroke();
    texture(assets.textures.windowViewB);
    plane(gamingZone.width / 2, gamingZone.height / 2 * 0.0763);
    pop();
    // Right
    push();
    translate(gamingZone.height / 4 - gamingZone.height / 4 * 0.1319, 0, 400); 
    noStroke();
    texture(assets.textures.windowViewR);
    plane(gamingZone.height / 2 * 0.1319, gamingZone.width / 2);
    pop();
    // Left
    push();
    translate(-gamingZone.height / 4 + gamingZone.height / 4 * 0.1319, 0, 400); 
    noStroke();
    texture(assets.textures.windowViewL);
    plane(gamingZone.height / 2 * 0.1319, gamingZone.width / 2);
    pop();
    
    // Render margins
    if (windowWidth > windowHeight) {
      // Right margin
      push();
      translate(gamingZone.width / 4 + (windowWidth - gamingZone.width) / 8, 0, 400);
      noStroke();
      fill(10);
      plane((windowWidth - gamingZone.width) / 4, windowHeight);
      pop();
      // Left margin
      push();
      translate(-gamingZone.width / 4 - (windowWidth - gamingZone.width) / 8, 0, 400);
      noStroke();
      fill(10);
      plane((windowWidth - gamingZone.width) / 4, windowHeight);
      pop();
    } else {
      // Bottom margin
      push();
      translate(0, gamingZone.height / 4 + (windowHeight - gamingZone.height) / 8, 400);
      noStroke();
      fill(10);
      plane(windowWidth, (windowHeight - gamingZone.height) / 4);
      pop();
      // Top margin
      push();
      translate(0, -gamingZone.height / 4 - (windowHeight - gamingZone.height) / 8, 400);
      noStroke();
      fill(10);
      plane(windowWidth, (windowHeight - gamingZone.height) / 4);
      pop();
    }
    
    // Render models 
    if (windowWidth > windowHeight) {
      // Right top
      push();
      translate(gamingZone.width / 8 + (windowWidth - gamingZone.width) / 16, 
                -gamingZone.height / 8 + (windowWidth - gamingZone.width) / 16,
                600);
      rotateX(radians(frameCount / 2));
      rotateY(radians(frameCount / 2));
      rotateZ(radians(frameCount / 2));
      noStroke();
      fill('blue');
      shininess(80);
      scale(((windowWidth - gamingZone.width) / 8) / 400);
      model(assets.models.playerShip1);
      pop();

      // Right bottom
      push();
      translate(gamingZone.width / 8 + (windowWidth - gamingZone.width) / 16, 
                gamingZone.height / 8 - (windowWidth - gamingZone.width) / 16,
                600);
      rotateX(-radians(frameCount / 2));
      rotateY(-radians(frameCount / 2));
      rotateZ(-radians(frameCount / 2));
      noStroke();
      fill('red');
      shininess(80);
      scale(((windowWidth - gamingZone.width) / 8) / 400);
      model(assets.models.enemyShip1);
      pop();
      
      // Left top
      push();
      translate(-gamingZone.width / 8 - (windowWidth - gamingZone.width) / 16, 
                -gamingZone.height / 8 + (windowWidth - gamingZone.width) / 16,
                600);
      rotateX(-radians(frameCount / 2));
      rotateY(-radians(frameCount / 2));
      rotateZ(-radians(frameCount / 2));
      noStroke();
      fill('red');
      shininess(80);
      scale(((windowWidth - gamingZone.width) / 8) / 400);
      model(assets.models.enemyShip2);
      pop();

      // left bottom
      push();
      translate(-gamingZone.width / 8 - (windowWidth - gamingZone.width) / 16, 
                gamingZone.height / 8 - (windowWidth - gamingZone.width) / 16,
                600);
      rotateX(radians(frameCount / 2));
      rotateY(radians(frameCount / 2));
      rotateZ(radians(frameCount / 2));
      noStroke();
      fill('blue');
      shininess(80);
      scale(((windowWidth - gamingZone.width) / 8) / 400);
      model(assets.models.playerShip2);
      pop();
    } else {
      // Right top
      push();
      translate(gamingZone.width / 8 - (windowHeight - gamingZone.height) / 16, 
                -gamingZone.height / 8 - (windowHeight - gamingZone.height) / 16, 
                600);
      rotateX(radians(frameCount / 2));
      rotateY(radians(frameCount / 2));
      rotateZ(radians(frameCount / 2));
      noStroke();
      fill('blue');
      shininess(80);
      scale(((windowHeight - gamingZone.height) / 8) / 400);
      model(assets.models.playerShip1);
      pop();

      // Right bottom
      push();
      translate(gamingZone.width / 8 - (windowHeight - gamingZone.height) / 16, 
                gamingZone.height / 8 + (windowHeight - gamingZone.height) / 16,
                600);
      rotateX(-radians(frameCount / 2));
      rotateY(-radians(frameCount / 2));
      rotateZ(-radians(frameCount / 2));
      noStroke();
      fill('red');
      shininess(80);
      scale(((windowHeight - gamingZone.height) / 8) / 400);
      model(assets.models.enemyShip1);
      pop();
      
      // Left top
      push();
      translate(-gamingZone.width / 8 + (windowHeight - gamingZone.height) / 16, 
                -gamingZone.height / 8 - (windowHeight - gamingZone.height) / 16,
                600);
      rotateX(radians(frameCount / 2));
      rotateY(radians(frameCount / 2));
      rotateZ(radians(frameCount / 2));
      noStroke();
      fill('red');
      shininess(80);
      scale(((windowHeight - gamingZone.height) / 8) / 400);
      model(assets.models.enemyShip2);
      pop();

      // left bottom
      push();
      translate(-gamingZone.width / 8 + (windowHeight - gamingZone.height) / 16, 
                gamingZone.height / 8 + (windowHeight - gamingZone.height) / 16,
                600);
      rotateX(radians(frameCount / 2));
      rotateY(radians(frameCount / 2));
      rotateZ(radians(frameCount / 2));
      noStroke();
      fill('blue');
      shininess(80);
      scale(((windowHeight - gamingZone.height) / 8) / 400);
      model(assets.models.playerShip2);
      pop();
    }
    
    // Render marginal texts
    if (windowWidth > windowHeight) {
      // Right
      push();
      translate(gamingZone.width / 8 + (windowWidth - gamingZone.width) / 16, 0, 600);
      noStroke();
      textAlign(CENTER, CENTER);
      textFont(assets.fonts.ps2p);
      fill(245);
      textSize(((windowWidth - gamingZone.width) / 8) / 24);
      text(`PILOT LOG\n\n${game.eventLog[5]}\n
${game.eventLog[4]}\n
${game.eventLog[3]}\n
${game.eventLog[2]}\n
${game.eventLog[1]}\n
${game.eventLog[0]}\n
            `, 0, 0);
      pop();
      
      // Left
      push();
      translate(-gamingZone.width / 8 - (windowWidth - gamingZone.width) / 16, 0, 600);
      noStroke();
      textAlign(CENTER, CENTER);
      textFont(assets.fonts.ps2p);
      fill(245);
      textSize(((windowWidth - gamingZone.width) / 8) / 24);
      text(`SCORE\n${this.score}\n\n\nDESTROYED\n\nMeteoroid\n${game.mDestroyed}\n\nEnergy Ore\n${game.oDestroyed}\n\nEnemy\n${game.eDestroyed}`, 0, 0);
      pop();
    }
  }
}