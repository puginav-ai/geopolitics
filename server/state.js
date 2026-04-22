import { SectorSimulator } from './simulation/sectors.js';
import { DiplomacySimulator } from './simulation/diplomacy.js';

export class GameState {
  constructor() {
    this.countries = this.loadCountries();
    this.currentTurn = 1;
    this.turnDuration = 'month';
    this.worldMarket = this.initMarket();
  }

  loadCountries() {
    const fs = require('fs');
    const data = fs.readFileSync('./data/countries.json', 'utf8');
    return JSON.parse(data);
  }

  initMarket() {
    return {
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

  processTurn(playerActions) {
    for (const action of playerActions) {
      this.applyAction(action);
    }

    SectorSimulator.simulateSectors(this.countries);
    DiplomacySimulator.simulateDiplomacy(this.countries, this.worldMarket);

    this.simulateAICountries();
    this.simulateMarket();
    this.checkCrises();

    this.currentTurn++;
  }

  applyAction(action) {
    const country = this.getCountry(action.countryId);
    if (!country) return;

    switch (action.type) {
      case 'set_interest_rate':
        country.interestRate = action.value;
        break;
      case 'set_tax':
        country.taxRate = action.value;
        break;
    }
  }

  simulateAICountries() {
    for (const country of this.countries) {
      if (!country.isPlayer) {
        country.stability += (Math.random() - 0.5) * 5;
        country.stability = Math.max(0, Math.min(100, country.stability));
      }
    }
  }

  simulateMarket() {
    for (const resource in this.worldMarket) {
      const change = 1 + (Math.random() - 0.5) * 0.1;
      this.worldMarket[resource] = Math.round(this.worldMarket[resource] * change * 100) / 100;
    }
  }

  checkCrises() {
    for (const country of this.countries) {
      if (country.stability < 30 && Math.random() < 0.3) {
        country.crisis = {
          type: 'protest',
          severity: 'high',
          description: 'Mass protests due to economic hardship'
        };
      }
    }
  }
}