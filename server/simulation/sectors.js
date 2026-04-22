export class SectorSimulator {
  static simulateSectors(countries) {
    for (const country of countries) {
      this.simulateAgriculture(country);
      this.simulateIndustry(country);
      this.simulateEnergy(country);
      this.simulateServices(country);
      this.calculateGDP(country);
    }
  }

  static simulateAgriculture(country) {
    const ag = country.sectors.agriculture;
    const techBonus = 1 + (ag.technology_level * 0.1);
    ag.production = ag.land * ag.yield_per_hectare * techBonus * (0.9 + Math.random() * 0.2);
    ag.jobs = Math.floor(ag.production / 50000);
  }

  static simulateIndustry(country) {
    const ind = country.sectors.industry;
    const automationBonus = 1 + (ind.automation_level * 0.02);
    ind.production = ind.factories * ind.output_per_factory * automationBonus * (0.9 + Math.random() * 0.2);
    ind.jobs = Math.floor(ind.production / 80000);
  }

  static simulateEnergy(country) {
    const energy = country.sectors.energy;
    energy.production = energy.capacity.coal * 0.4 + energy.capacity.gas * 0.5 +
                        energy.capacity.nuclear * 0.9 + energy.capacity.renewables * 0.3;
    energy.consumption = energy.production * (0.9 + Math.random() * 0.2);
  }

  static simulateServices(country) {
    const svc = country.sectors.services;
    svc.productivity = 30000 * (1 + Math.random() * 0.1);
  }

  static calculateGDP(country) {
    const ag = country.sectors.agriculture?.production || 0;
    const ind = country.sectors.industry?.production || 0;
    const energy = country.sectors.energy?.production || 0;
    const svc = country.gdp * (country.sectors.services?.gdp_share || 50) / 100;

    country.gdp = ag + ind + energy + svc;
  }
}