export class DemographicsSimulator {
  static simulate(countries) {
    for (const country of countries) {
      this.updatePopulation(country);
      this.urbanization(country);
      this.incomeDistribution(country);
      this.qualityOfLife(country);
    }
  }

  static updatePopulation(country) {
    const demo = country.demographics || {};

    const births = country.population * (demo.birth_rate || 1) / 1000;
    const deaths = country.population * (demo.death_rate || 1) / 1000;
    const migration = demo.migration || 0;

    const growth = births - deaths + migration;
    country.population += Math.floor(growth);

    demo.working_age = (country.population * 0.65);
    demo.retirees = (country.population * 0.15);

    country.demographics = demo;
  }

  static urbanization(country) {
    const demo = country.demographics || {};
    const urban = demo.urbanization || 50;

    if (urban > 60 && country.gdp > 1000000000000) {
      demo.urbanization = Math.min(95, urban + 0.2);
    }

    if (urban < 80 && country.sectors.industry?.production > country.sectors.agriculture?.production) {
      demo.urbanization += 0.1;
    }

    country.demographics = demo;
  }

  static incomeDistribution(country) {
    const demo = country.demographics || {};
    const dist = demo.income_distribution || { poor: 30, middle: 50, rich: 20 };

    const growth = country.gdp > 10000000000000 ? 'rich' :
                   country.gdp > 1000000000000 ? 'middle' : 'poor';

    if (growth === 'rich') {
      dist.rich += 0.1;
      dist.poor -= 0.05;
    } else if (growth === 'poor') {
      dist.poor += 0.1;
      dist.rich -= 0.05;
    }

    dist.poor = Math.max(5, Math.min(80, dist.poor));
    dist.middle = Math.max(20, Math.min(70, 100 - dist.poor - dist.rich));
    dist.rich = Math.max(5, Math.min(50, 100 - dist.poor - dist.middle));

    country.demographics.income_distribution = dist;

    const inequality = dist.rich - dist.poor;
    country.stability -= inequality * 0.05;
  }

  static qualityOfLife(country) {
    const demo = country.demographics || {};

    let qol = 50;
    qol += (country.sectors.healthcare?.budget || 0) / 1000000000;
    qol += (demo.education_level || 0) * 0.3;
    qol += (demo.urbanization || 50) * 0.2;
    qol -= (demo.income_distribution?.poor || 30) * 0.5;

    country.qualityOfLife = Math.max(0, Math.min(100, qol));

    if (country.qualityOfLife > 70) {
      country.stability += 1;
      demo.migration += 10000;
    } else if (country.qualityOfLife < 40) {
      country.stability -= 2;
      demo.migration -= 20000;
    }
  }
}