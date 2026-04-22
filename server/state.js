import { SectorSimulator } from './simulation/sectors.js';
import { DiplomacySimulator } from './simulation/diplomacy.js';
import { tradeSimulator } from './simulation/trade.js';
import { eventsSimulator } from './simulation/events.js';
import { TechnologySimulator } from './simulation/technology.js';
import { MilitarySimulator } from './simulation/military.js';
import { SoftPowerSimulator } from './simulation/softpower.js';
import { InfrastructureSimulator } from './simulation/infrastructure.js';
import { DemographicsSimulator } from './simulation/demographics.js';
import { climateSimulator } from './simulation/climate.js';
import { AISimulator } from './simulation/ai.js';

export class GameState {
  constructor() {
    this.countries = this.loadCountries();
    this.currentTurn = 1;
    this.turnDuration = 'month';
    this.worldMarket = this.initMarket();
    this.events = [];
    this.resourceDeposits = this.initResourceDeposits();
    this.globalTemperature = 0;
    this.playerCountryId = null;
    this.organizations = this.initOrganizations();
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

  initResourceDeposits() {
    return {
      'middle_east': { oil: 500, gas: 300, region: 'Middle East', controlledBy: [] },
      'siberia': { oil: 400, gas: 500, region: 'Siberia', controlledBy: ['russia'] },
      'north_sea': { oil: 100, gas: 200, region: 'North Sea', controlledBy: ['uk', 'norway'] },
      'texas': { oil: 150, gas: 100, region: 'Texas', controlledBy: ['usa'] },
      'alaska': { oil: 100, gas: 80, region: 'Alaska', controlledBy: ['usa'] },
      'persian_gulf': { oil: 600, gas: 400, region: 'Persian Gulf', controlledBy: ['saudi_arabia', 'iran', 'iraq'] },
      'sahara': { oil: 50, gas: 100, region: 'North Africa', controlledBy: [] },
      'siberia_east': { oil: 200, gas: 300, region: 'Eastern Siberia', controlledBy: ['russia'] },
      'china_sea': { oil: 150, gas: 100, region: 'South China Sea', controlledBy: ['china'] },
      'brazil_coast': { oil: 200, gas: 100, region: 'Brazil Coast', controlledBy: ['brazil'] },
      'rare_earth_asia': { rare_earth: 500, region: 'China', controlledBy: ['china'] },
      'rare_earth_africa': { rare_earth: 300, region: 'Congo', controlledBy: [] },
      'lithium_samerica': { lithium: 400, region: 'Bolivia/Chile', controlledBy: [] },
      'cobalt_africa': { cobalt: 300, region: 'DR Congo', controlledBy: [] }
    };
  }

  initOrganizations() {
    return {
      'un': {
        name: 'United Nations',
        members: ['russia', 'usa', 'china', 'germany', 'france', 'uk', 'japan', 'india', 'brazil'],
        votes: {},
        security_council: ['usa', 'russia', 'china', 'france', 'uk']
      },
      'nato': {
        name: 'NATO',
        members: ['usa', 'germany', 'france', 'uk'],
        defense_spending: 0.02,
        collective_defense: true
      },
      'eu': {
        name: 'European Union',
        members: ['germany', 'france', 'uk'],
        common_market: true,
        currency: 'eur'
      },
      'opec': {
        name: 'OPEC',
        members: [],
        oil_production_control: true
      },
      'g20': {
        name: 'G20',
        members: ['russia', 'usa', 'china', 'germany', 'france', 'uk', 'japan', 'india', 'brazil', 'australia'],
        economic_coordination: true
      }
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
    tradeSimulator.simulateTrade(this.countries, this.worldMarket);

    const events = eventsSimulator.generateEvents(this.countries, this);
    this.events = events;

    TechnologySimulator.simulateTech(this.countries);

    MilitarySimulator.simulate(this.countries);

    SoftPowerSimulator.simulate(this.countries);

    InfrastructureSimulator.simulate(this.countries);

    DemographicsSimulator.simulate(this.countries);

    climateSimulator.simulate(this.countries);

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
    AISimulator.simulate(this.countries, this.playerCountryId);
  }

  setPlayerCountry(id) {
    this.playerCountryId = id;
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