export class ClimateSimulator {
  constructor() {
    this.weatherEvents = [];
    this.climateEffects = {
      'heat_wave': { duration: 3, effect: (country) => { country.sectors.agriculture.production *= 0.9; } },
      'cold_wave': { duration: 2, effect: (country) => { country.sectors.energy.consumption *= 1.2; } },
      'drought': { duration: 6, effect: (country) => { country.sectors.agriculture.production *= 0.7; country.sectors.energy.consumption *= 1.1; } },
      'flood': { duration: 2, effect: (country) => { country.infrastructure?.railways && (country.infrastructure.railways *= 0.95); country.stability -= 3; } },
      'storm': { duration: 1, effect: (country) => { country.sectors.energy.capacity.wind *= 0.9; } },
      'wildfire': { duration: 3, effect: (country) => { country.sectors.agriculture.production *= 0.85; } }
    };
  }

  simulate(countries) {
    this.activeEffects = this.activeEffects || [];
    
    this.activeEffects = this.activeEffects.filter(effect => {
      effect.duration--;
      if (effect.effect) {
        effect.effect(effect.countryData);
      }
      return effect.duration > 0;
    });
    
    for (const country of countries) {
      if (Math.random() < 0.02) {
        const effects = Object.keys(this.climateEffects);
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        const effectData = this.climateEffects[randomEffect];
        
        this.activeEffects.push({
          type: randomEffect,
          country: country.id,
          countryData: country,
          duration: effectData.duration,
          effect: effectData.effect
        });
        
        this.weatherEvents.push({
          turn: 0,
          type: randomEffect,
          country: country.id
        });
      }
    }
    
    this.climateChange(countries);
  }

  climateChange(countries) {
    this.globalTemperature = (this.globalTemperature || 0) + 0.01;
    
    if (this.globalTemperature > 1) {
      for (const country of countries) {
        if (country.lat > 60 || country.lat < -60) {
          country.sectors.agriculture.production *= 1.01;
        } else {
          country.sectors.agriculture.production *= 0.995;
          country.stability -= 0.1;
        }
      }
    }
  }

  getActiveWeather() {
    return this.activeEffects || [];
  }
}

export const climateSimulator = new ClimateSimulator();
