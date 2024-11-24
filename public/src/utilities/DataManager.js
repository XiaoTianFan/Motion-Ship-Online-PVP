class DataManager {
  constructor(storageKey = 'motionShipsData') {
    this.storageKey = storageKey;
    this.gameData = {
      gamesPlayed: 0,
      highScore: 0
    };
    this.loadGameData();
  }

  saveGameData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.gameData));
  }

  loadGameData() {
    let data = localStorage.getItem(this.storageKey);
    if (data) {
      this.gameData = JSON.parse(data);
    } else {
      this.saveGameData();
    }
  }

  updateGamesPlayed() {
    this.gameData.gamesPlayed += 1;
    this.saveGameData();
  }

  updateHighScore(newScore) {
    if (newScore > this.gameData.highScore) {
      this.gameData.highScore = newScore;
      this.saveGameData();
    }
  }

  getGamesPlayed() {
    return this.gameData.gamesPlayed;
  }

  getHighScore() {
    return this.gameData.highScore;
  }
}