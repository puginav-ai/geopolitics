export class EventsSimulator {
  constructor() {
    this.eventTypes = {
      economic: [
        { id: 'oil_crash', name: 'Oil Price Crash', effect: (country) => { country.sectors.energy.production *= 0.8; } },
        { id: 'tech_boom', name: 'Technology Boom', effect: (country) => { country.sectors.industry.production *= 1.15; } },
        { id: 'recession', name: 'Global Recession', effect: (country) => { country.gdp *= 0.95; country.stability -= 5; } },
        { id: 'inflation', name: 'High Inflation', effect: (country) => { country.stability -= 3; } }
      ],
      political: [
        { id: 'protests', name: 'Mass Protests', effect: (country) => { country.stability -= 10; } },
        { id: 'coup', name: 'Military Coup', effect: (country) => { country.stability -= 20; country.military.budget *= 1.3; } },
        { id: 'election', name: 'Election Year', effect: (country) => { country.stability += 3; } },
        { id: 'scandal', name: 'Political Scandal', effect: (country) => { country.stability -= 8; } }
      ],
      military: [
        { id: 'war', name: 'War Outbreak', effect: (country, target) => { country.stability -= 15; country.military.budget *= 1.2; } },
        { id: 'invasion', name: 'Border Invasion', effect: (country) => { country.stability -= 10; } },
        { id: 'cyber_attack', name: 'Cyber Attack', effect: (country) => { country.sectors.industry.production *= 0.9; } }
      ],
      natural: [
        { id: 'earthquake', name: 'Earthquake', effect: (country) => { country.stability -= 5; country.gdp *= 0.98; } },
        { id: 'drought', name: 'Drought', effect: (country) => { country.sectors.agriculture.production *= 0.85; } },
        { id: 'pandemic', name: 'Pandemic', effect: (country) => { country.stability -= 10; } }
      ]
    };
  }

  generateEvents(countries, worldState) {
    const events = [];
    
    for (const country of countries) {
      if (country.stability < 30 && Math.random() < 0.3) {
        const politicalEvents = this.eventTypes.political.filter(e => e.id === 'protests');
        if (politicalEvents.length > 0) {
          const event = politicalEvents[0];
          event.effect(country);
          events.push({ country: country.id, type: 'political', ...event });
        }
      }
      
      if (Math.random() < 0.1) {
        const economicEvents = this.eventTypes.economic;
        const event = economicEvents[Math.floor(Math.random() * economicEvents.length)];
        event.effect(country);
        events.push({ country: country.id, type: 'economic', ...event });
      }
      
      if (Math.random() < 0.05) {
        const naturalEvents = this.eventTypes.natural;
        const event = naturalEvents[Math.floor(Math.random() * naturalEvents.length)];
        event.effect(country);
        events.push({ country: country.id, type: 'natural', ...event });
      }
    }
    
    return events;
  }

  getActiveEvents() {
    return this.activeEvents || [];
  }
}

export const eventsSimulator = new EventsSimulator();
