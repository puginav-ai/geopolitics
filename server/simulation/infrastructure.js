export class InfrastructureSimulator {
  static simulate(countries) {
    for (const country of countries) {
      this.updateInfrastructure(country);
      this.logisticsEfficiency(country);
      this.buildProjects(country);
    }
  }

  static updateInfrastructure(country) {
    const inf = country.infrastructure || {};

    inf.railways = Math.max(0, (inf.railways || 0) - 50);
    inf.highways = Math.max(0, (inf.highways || 0) - 100);

    const gridEfficiency = (inf.electricity_grid || 50) / 100;
    country.sectors.energy.consumption *= (2 - gridEfficiency);

    country.infrastructure = inf;
  }

  static logisticsEfficiency(country) {
    const inf = country.infrastructure || {};

    let score = 0;
    score += (inf.railways || 0) / 1000;
    score += (inf.highways || 0) / 2000;
    score += (inf.ports || 0) * 5;
    score += (inf.airports || 0) * 2;

    const efficiency = Math.min(100, score / 10);
    country.logisticsEfficiency = efficiency;

    if (efficiency > 50) {
      const bonus = 1 + (efficiency - 50) * 0.002;
      country.sectors.industry.production *= bonus;
    }
  }

  static buildProjects(country) {
    const inf = country.infrastructure || {};

    const infraBudget = country.budget?.infrastructure || 0;

    if (infraBudget > 10000000000) {
      inf.railways += Math.floor(infraBudget / 10000000000) * 100;
      inf.highways += Math.floor(infraBudget / 5000000000) * 200;
    }

    if (country.relations) {
      for (const targetId of Object.keys(country.relations)) {
        const rel = country.relations[targetId];
        if (rel.trade_agreement && rel.pipeline) {
          inf.pipelines += 500;
        }
      }
    }

    country.infrastructure = inf;
  }

  static calculateTradeCapacity(country) {
    const inf = country.infrastructure || {};

    const portCapacity = (inf.ports || 0) * 1000;
    const railCapacity = (inf.railways || 0) * 10;

    return Math.min(portCapacity, railCapacity);
  }
}