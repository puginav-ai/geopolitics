export class DiplomacySimulator {
  static simulateDiplomacy(countries, worldMarket) {
    for (const country of countries) {
      this.updateRelations(country, countries);
      this.handleSanctions(country, countries);
      this.handleTradeAgreements(country, worldMarket);
      this.softPower(country, countries);
    }
  }

  static updateRelations(country, countries) {
    for (const otherId of Object.keys(country.relations || {})) {
      const other = countries.find(c => c.id === otherId);
      if (!other) continue;

      const rel = country.relations[otherId];
      
      const gdpRatio = country.gdp / other.gdp;
      if (rel.trade_agreement) {
        rel.score += gdpRatio * 0.5;
      }
      
      if (rel.sanctions && rel.sanctions.length > 0) {
        rel.score -= 5 * rel.sanctions.length;
      }
      
      if (country.military.budget > other.military.budget * 1.2) {
        rel.score -= 2;
      }
      
      rel.score += (country.stability - 50) * 0.05;
      
      rel.score = Math.max(-100, Math.min(100, rel.score));
    }
  }

  static handleSanctions(country, countries) {
    for (const otherId of Object.keys(country.relations || {})) {
      const rel = country.relations[otherId];
      if (!rel.sanctions || rel.sanctions.length === 0) continue;

      const other = countries.find(c => c.id === otherId);
      if (!other) continue;

      if (rel.sanctions.includes('export')) {
        country.sectors.industry.production *= 0.98;
      }
      if (rel.sanctions.includes('tech')) {
      }
    }
  }

  static handleTradeAgreements(country, worldMarket) {
    if (!country.relations) return;
    
    for (const otherId of Object.keys(country.relations)) {
      const rel = country.relations[otherId];
      if (!rel.trade_agreement) continue;
      
      country.sectors.industry.production *= 1.02;
    }
  }

  static softPower(country, countries) {
    for (const otherId of Object.keys(country.relations || {})) {
      const rel = country.relations[otherId];
      if (rel.cultural_influence) {
        rel.score += rel.cultural_influence * 0.02;
      }
    }
  }

  static proposeAgreement(countryId, targetId, type) {
    return { status: 'proposed', type };
  }
}
