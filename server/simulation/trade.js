export class TradeSimulator {
  constructor() {
    this.tradeRoutes = [];
    this.shippingLanes = {
      'suez': { controlledBy: null, traffic: 0 },
      'panama': { controlledBy: null, traffic: 0 },
      'malacca': { controlledBy: null, traffic: 0 }
    };
  }

  simulateTrade(countries, worldMarket) {
    this.updateShippingLanes(countries);
    this.processTradeFlows(countries, worldMarket);
    this.updateResourcePrices(countries, worldMarket);
  }

  updateShippingLanes(countries) {
    for (const country of countries) {
      if (country.military.navail > 100) {
        this.shippingLanes.suez.traffic += 10;
        this.shippingLanes.panama.traffic += 10;
        this.shippingLanes.malacca.traffic += 10;
      }
    }
  }

  processTradeFlows(countries, worldMarket) {
    for (const country of countries) {
      const resources = ['oil', 'gas', 'coal', 'uranium', 'grain', 'steel', 'chips'];

      for (const resource of resources) {
        const production = this.getProduction(country, resource);
        const consumption = this.getConsumption(country, resource);

        country.sectors.trade = country.sectors.trade || {};
        country.sectors.trade[resource] = {
          production,
          consumption,
          export: Math.max(0, production - consumption * 1.2),
          import: Math.max(0, consumption * 1.2 - production),
          price: worldMarket[resource] || 100
        };
      }
    }
  }

  getProduction(country, resource) {
    if (resource === 'grain') return country.sectors.agriculture?.production || 0;
    if (resource === 'oil') return country.energy?.oil_production || 0;
    if (resource === 'steel') return country.sectors.industry?.production * 0.1 || 0;
    return country.sectors.industry?.production || 0;
  }

  getConsumption(country, resource) {
    const pop = country.population || 1000000;
    const base = pop * 0.001;

    if (resource === 'grain') return base * 100;
    if (resource === 'steel') return country.sectors.industry?.production * 0.05 || 0;
    return base * 10;
  }

  updateResourcePrices(countries, worldMarket) {
    for (const resource of Object.keys(worldMarket)) {
      let totalSupply = 0;
      let totalDemand = 0;

      for (const country of countries) {
        const trade = country.sectors.trade?.[resource];
        if (trade) {
          totalSupply += trade.export;
          totalDemand += trade.import;
        }
      }

      if (totalDemand > totalSupply * 1.2) {
        worldMarket[resource] *= 1.05;
      } else if (totalSupply > totalDemand * 1.2) {
        worldMarket[resource] *= 0.95;
      }
    }
  }

  getTradeRoutes() {
    return this.tradeRoutes;
  }

  addTradeRoute(from, to, resource, volume) {
    this.tradeRoutes.push({ from, to, resource, volume, active: true });
  }
}

export const tradeSimulator = new TradeSimulator();