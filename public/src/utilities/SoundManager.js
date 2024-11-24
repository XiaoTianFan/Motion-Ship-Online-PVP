class SoundManager {
  // Handles playing and managing sound effects and music.
  constructor() {
    this.sounds = {};
  }

  loadSounds(assets) {
    this.sounds.laserFire = assets.sounds.laserFire;
    this.sounds.destruction = assets.sounds.destruction;
    this.sounds.collision = assets.sounds.collision;
    this.sounds.gameOver = assets.sounds.gameOver;
    this.sounds.backgroundMusic = assets.sounds.backgroundMusic;
    this.sounds.backgroundMusic1 = assets.sounds.backgroundMusic1;
    this.sounds.backgroundMusic2 = assets.sounds.backgroundMusic2;
    this.sounds.backgroundMusic3 = assets.sounds.backgroundMusic3;
    this.sounds.backgroundMusic4 = assets.sounds.backgroundMusic4;
  }

  playSound(soundName, loop = false) {
    if (this.sounds[soundName]) {
      if (loop) {
        if (!this.sounds[soundName].isPlaying()) {
          this.sounds[soundName].loop();
          // console.log('Sound is looping!');
        }
      } else {
        this.sounds[soundName].play();
        // console.log('Sound is playing!');
      }
    }
  }

  stopSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].stop();
      console.log('Sound has stopped!');
    }
  }
}
