export class AISimulator {
  static simulate(countries, playerCountryId) {
    for (const country of countries) {
      if (country.id === playerCountryId) continue;
      
      this.economicAI(country, countries);
      this.diplomaticAI(country, countries);
      this.militaryAI(country, countries);
      this.techAI(country);
    }
  }

  static economicAI(country, countries) {
    if (country.stability < 40) {
      country.taxRate = Math.max(10, (country.taxRate || 20) - 1);
    } else if (country.stability > 70) {
      country.taxRate = Math.min(40, (country.taxRate || 20) + 0.5);
    }
    
    const budget = country.budget || { defense: 0, healthcare: 0, education: 0, infrastructure: 0, social: 0 };
    const total = Object.values(budget).reduce((a, b) => a + b, 0);
    
    const hostile = Object.values(country.relations || {}).filter(r => r.score < -30).length;
    if (hostile > 0) {
      country.budget.defense = total * 0.25;
    }
  }

  static diplomaticAI(country, countries) {
    if (!country.relations) return;
    
    for (const otherId of Object.keys(country.relations)) {
      const rel = country.relations[otherId];
      const other = countries.find(c => c.id === otherId);
      
      if (!other) continue;
      
      const gdpRatio = country.gdp / other.gdp;
      if (gdpRatio > 0.5 && gdpRatio < 2) {
        rel.score += 0.5;
      }
      
      if ((country.id.includes('usa') && other.id.includes('uk')) ||
          (country.id.includes('russia') && other.id.includes('china'))) {
        rel.score += 1;
      }
      
      if (rel.score > 30 && !rel.trade_agreement) {
        rel.trade_agreement = Math.random() < 0.1;
      }
      
      if (rel.score < -50 && (!rel.sanctions || rel.sanctions.length === 0)) {
        if (Math.random() < 0.2) {
          rel.sanctions = ['export', 'finance'];
        }
      }
    }
  }

  static militaryAI(country, countries) {
    const mil = country.military;
    if (!mil) return;
    
    const threats = Object.values(country.relations || {}).filter(r => r.score < -40).length;
    if (threats > 0) {
      mil.budget = Math.min(country.gdp * 0.05, mil.budget * 1.02);
      mil.readiness = Math.min(95, mil.readiness + 0.5);
    }
    
    const techLevel = country.technologies?.ai || 3;
    if (mil.budget > country.gdp * 0.03) {
      if (mil.army?.tanks > 0) {
        mil.army.tank_quality = (mil.army.tank_quality || 3) + techLevel * 0.1;
      }
    }
  }

  static techAI(country) {
    const tech = country.technologies;
    if (!tech) return;
    
    const priorities = ['ai', 'semiconductors', 'cyber'];
    for (const t of priorities) {
      if (tech[t] < 6 && country.gdp > 500000000000) {
        tech[t] = Math.min(10, (tech[t] || 0) + 0.05);
      }
    }
    
    if (country.military?.nuclear?.warheads > 0) {
      tech.nuclear_energy = Math.max(tech.nuclear_energy || 0, 4);
    }
  }
}