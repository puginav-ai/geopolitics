export class SoftPowerSimulator {
  static simulate(countries) {
    for (const country of countries) {
      this.updateSoftPower(country, countries);
      this.culturalPenetration(country, countries);
      this.mediaInfluence(country, countries);
    }
  }

  static updateSoftPower(country, countries) {
    const sp = country.softpower || {};
    
    const gdpShare = country.gdp / 25000000000000;
    sp.base = gdpShare * 50;
    
    const tech = country.technologies || {};
    sp.tech = (tech.ai + tech.space) * 2;
    
    sp.sports = sp.sports_power || 0;
    
    sp.education = sp.education_appeal || 0;
    
    country.softpower = sp;
    country.softPower = (sp.base || 0) + (sp.tech || 0) + (sp.sports || 0) + (sp.education || 0);
  }

  static culturalPenetration(country, countries) {
    const sp = country.softpower || {};
    const cultural = sp.cultural_presence || 0;
    
    for (const other of countries) {
      if (other.id === country.id) continue;
      if (!other.relations) continue;
      if (!other.relations[country.id]) continue;
      
      other.relations[country.id].cultural_influence = cultural;
      other.relations[country.id].score += cultural * 0.02;
    }
  }

  static mediaInfluence(country, countries) {
    const sp = country.softpower || {};
    const media = sp.media_influence || 0;
    
    for (const other of countries) {
      if (other.id === country.id) continue;
      if (!other.relations) continue;
      if (!other.relations[country.id]) continue;
      
      if (media > 30) {
        other.stability += (Math.random() - 0.5) * 2;
      }
    }
  }

  static investInCulture(country, amount) {
    if (!country.softpower) country.softpower = {};
    country.softpower.cultural_presence = Math.min(100, (country.softpower.cultural_presence || 0) + amount * 0.001);
  }

  static hostEvent(country, eventType) {
    const sp = country.softpower || {};
    
    if (eventType === 'olympics') {
      sp.sports_power = Math.min(100, (sp.sports_power || 0) + 20);
      country.softPower += 15;
    } else if (eventType === 'summit') {
      sp.diplomatic_power = Math.min(100, (sp.diplomatic_power || 0) + 15);
    }
  }
}