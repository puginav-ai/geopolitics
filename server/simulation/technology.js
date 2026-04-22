export class TechnologySimulator {
  static simulateTech(countries) {
    for (const country of countries) {
      this.developTech(country);
      this.techEffects(country);
    }
  }

  static developTech(country) {
    const tech = country.technologies;
    if (!tech) return;

    const techLevel = Object.values(tech).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) / 6;
    
    if (Math.random() < 0.1 + techLevel * 0.02) {
      const fields = ['ai', 'nuclear_energy', 'semiconductors', 'space', 'renewables', 'cyber'];
      const field = fields[Math.floor(Math.random() * fields.length)];
      if (typeof tech[field] === 'number' && tech[field] < 10) {
        tech[field] += 0.1;
      }
    }
  }

  static techEffects(country) {
    const tech = country.technologies;
    if (!tech) return;

    if (tech.ai > 5) {
      country.sectors.industry.production *= 1 + (tech.ai - 5) * 0.02;
    }

    if (tech.semiconductors > 3) {
      country.sectors.industry.production *= 1 + (tech.semiconductors - 3) * 0.03;
    }

    if (tech.renewables > 3) {
      country.sectors.energy.capacity.renewables *= 1 + (tech.renewables - 3) * 0.05;
    }

    if (tech.nuclear_energy > 2) {
      country.sectors.energy.capacity.nuclear *= 1 + (tech.nuclear_energy - 2) * 0.04;
    }

    if (tech.space > 4) {
      country.softPower = (country.softPower || 0) + 5;
    }
  }

  static canDevelop(country, tech, targetLevel) {
    const currentLevel = country.technologies?.[tech] || 0;
    if (currentLevel >= targetLevel) return { can: false, reason: 'Already at target level' };

    const cost = (targetLevel - currentLevel) * 10000000000;
    if (country.gdp * 0.001 < cost) return { can: false, reason: 'Insufficient GDP for R&D investment' };

    return { can: true, cost };
  }
}