export class GameState {
  constructor() {
    this.countries = [];
    this.currentTurn = 1;
    this.turnDuration = 'month';
    this.worldMarket = {
      oil: 80,
      gas: 40,
      coal: 100,
      uranium: 120,
      grain: 200,
      steel: 1500,
      chips: 5000
    };
  }

  getCountry(id) {
    return this.countries.find(c => c.id === id);
  }

  nextTurn() {
    this.currentTurn++;
    this.simulateMarket();
  }

  simulateMarket() {
    for (const resource in this.worldMarket) {
      const change = 1 + (Math.random() - 0.5) * 0.1;
      this.worldMarket[resource] *= change;
    }
  }
}