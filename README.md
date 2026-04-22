# GeoPoliticSim

A realistic geopolitical simulation game where you manage a country's politics, economy, diplomacy, and military.

## Features

- **10 Playable Countries**: Russia, USA, China, Germany, France, UK, Japan, India, Brazil, Australia
- **Economic Simulation**: Agriculture, Industry, Energy, Services sectors with realistic interdependencies
- **Diplomacy**: Relations, trade agreements, sanctions, alliances, soft power
- **Military**: Army, Navy, Air Force, Nuclear weapons, readiness system
- **Technology**: AI, Semiconductors, Space, Nuclear Energy, Cyber warfare
- **Global Trade**: Resource markets, shipping lanes, trade routes
- **Events & Crises**: Economic crashes, wars, natural disasters, political events
- **Infrastructure**: Railways, highways, ports, pipelines, logistics
- **Demographics**: Population growth, urbanization, income distribution, quality of life

## Tech Stack

- **Server**: Node.js + Express
- **Client**: Godot 4
- **Architecture**: REST API, centralized game state

## Getting Started

### Prerequisites

- Node.js 18+
- Godot 4.2+ (for client)

### Running the Server

```bash
cd server
npm install
npm start
```

Server runs on http://localhost:3000

### API Endpoints

- `GET /api/state` - Game state
- `GET /api/countries` - All countries
- `GET /api/countries/:id` - Country details
- `GET /api/countries/:id/economy` - Economy panel
- `GET /api/countries/:id/military` - Military details
- `GET /api/countries/:id/diplomacy` - Relations
- `GET /api/countries/:id/tech` - Technologies
- `GET /api/countries/:id/infrastructure` - Infrastructure
- `GET /api/countries/:id/demographics` - Demographics
- `GET /api/market/prices` - World market prices
- `GET /api/events` - Current events
- `POST /api/turn/process` - Process game turn

### Running the Client

1. Install Godot 4.2+
2. Open the `client` folder in Godot Editor
3. Press F5 to run

## Game Mechanics

### Turn System
Each turn represents one month. During your turn:
1. View the current state of your country and the world
2. Make economic decisions (taxes, interest rates, budget)
3. Conduct diplomacy (trade agreements, sanctions)
4. Manage military (recruitment, equipment)
5. Invest in technology
6. End turn to process all actions

### Sectors

- **Agriculture**: Food production, exports
- **Industry**: Manufacturing, automation
- **Energy**: Power generation (coal, gas, nuclear, renewables)
- **Services**: GDP contribution, employment

### Diplomacy

Relations between countries range from -100 (hostile) to +100 (allied). Relations affect trade, military cooperation, and cultural influence.

### Military

Military strength is calculated from:
- Personnel
- Equipment quality
- Readiness
- Nuclear arsenal

### Technologies

Research technologies to gain economic and military advantages:
- AI (boosts all production)
- Semiconductors (industry efficiency)
- Space (soft power)
- Nuclear Energy (energy independence)
- Cyber (information warfare)

## Contributing

Pull requests welcome!

## License

MIT