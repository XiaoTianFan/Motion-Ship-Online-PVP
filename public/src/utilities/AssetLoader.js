class AssetLoader {
  constructor() {
    this.models = {};
    this.textures = {};
    this.sounds = {};
    this.fonts = {};
    this.assetsLoaded = false;
  }

  loadModels() {
    this.models.playerShip1 = loadModel('gameAssets/models/playerShip1.obj', true);
    this.models.playerShip2 = loadModel('gameAssets/models/playerShip2.obj', true);
    this.models.enemyShip1 = loadModel('gameAssets/models/enemyShip1.obj', true);
    this.models.enemyShip2 = loadModel('gameAssets/models/enemyShip2.obj', true);
    this.models.meteoroid1 = loadModel('gameAssets/models/meteoroid1.obj', true);
    this.models.meteoroid2 = loadModel('gameAssets/models/meteoroid2.obj', true);
    this.models.meteoroid3 = loadModel('gameAssets/models/meteoroid3.obj', true);
    this.models.meteoroid4 = loadModel('gameAssets/models/meteoroid4.obj', true);
  }

  loadTextures() {
    // Load non-background textures normally
    this.textures.meteoroid = loadImage('gameAssets/textures/meteoroid.jpg');
    this.textures.energyOre = loadImage('gameAssets/textures/energyOre.png');
    this.textures.windowView = loadImage('gameAssets/textures/windowView.png');
    this.textures.windowViewB = loadImage('gameAssets/textures/windowViewB.png');
    this.textures.windowViewR = loadImage('gameAssets/textures/windowViewR.png');
    this.textures.windowViewL = loadImage('gameAssets/textures/windowViewL.png');
    this.textures.windowViewT = loadImage('gameAssets/textures/windowViewT.png');

    // Load background textures with vignette
    this.loadBackgroundWithVignette('background1', 'gameAssets/textures/backgrounds/BKG1.png');
    this.loadBackgroundWithVignette('background2', 'gameAssets/textures/backgrounds/BKG2.png');
    this.loadBackgroundWithVignette('background3', 'gameAssets/textures/backgrounds/BKG3.png');
    this.loadBackgroundWithVignette('background4', 'gameAssets/textures/backgrounds/BKG4.png');
  }

  loadSounds() {
    this.sounds.backgroundMusic = loadSound('gameAssets/sounds/spaceshipAmbience.mp3');
    this.sounds.backgroundMusic.setVolume(0.2);
    this.sounds.backgroundMusic1 = loadSound('gameAssets/sounds/cosmicRumble.mp3');
    this.sounds.backgroundMusic2 = loadSound('gameAssets/sounds/starryBattles.mp3');
    this.sounds.backgroundMusic3 = loadSound('gameAssets/sounds/starlitBattleground.mp3');
    this.sounds.backgroundMusic4 = loadSound('gameAssets/sounds/celestialRush.mp3');
    this.sounds.laserFire = loadSound('gameAssets/sounds/laserFire.mp3');
    this.sounds.laserFire.setVolume(0.2);
    this.sounds.destruction = loadSound('gameAssets/sounds/destruction.mp3');
    this.sounds.collision = loadSound('gameAssets/sounds/collision.mp3');
    this.sounds.collision.setVolume(0.2);
    this.sounds.gameOver = loadSound('gameAssets/sounds/gameOver.mp3');
  }
  
  loadFonts() {
    this.fonts.ps2p = loadFont('gameAssets/fonts/PressStart2P-Regular.ttf');
  }
  
  loadBackgroundWithVignette(key, path) {
    loadImage(path, (img) => {
      const vignettedImg = this.applyVignette(img);
      this.textures[key] = vignettedImg;
    });
  }

  applyVignette(img) {
    // Create a graphics buffer the same size as the image
    let gfx = createGraphics(img.width, img.height);
    gfx.clear();

    // Parameters for the vignette
    let centerX = img.width / 2;
    let centerY = img.height / 2;
    let maxDiameter = max(img.width, img.height) * 1.25;

    gfx.noFill();
    gfx.background(0, 0, 0, 0); // Ensure transparency

    gfx.blendMode(BLEND);

    // Draw multiple concentric ellipses to create a radial gradient
    for (let r = maxDiameter / 2; r > 0; r -= 20) {
      // Adjust alpha based on radius
      let alpha = map(r, 0, maxDiameter / 2, 40, 0); // intensity: darkest part = 50, larger the darker
      gfx.noStroke();
      gfx.fill(0, 0, 0, alpha);
      gfx.ellipse(centerX, centerY, r, r);
    }

    // Convert gfx (p5.Graphics) to p5.Image
    let vignetteImage = gfx.get();

    // Create a copy of the original image to avoid modifying it directly
    let processedImg = img.get();

    // Blend the vignette image onto the processed image using MULTIPLY mode
    processedImg.blend(vignetteImage, 0, 0, vignetteImage.width, vignetteImage.height, 0, 0, processedImg.width, processedImg.height, MULTIPLY);

    return processedImg;
  }
}