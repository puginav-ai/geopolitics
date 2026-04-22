# GeoPoliticSim — Design Specification

## 1. Concept

**GeoPoliticSim** — multiplayer crisis-management and nation-building simulation. Player manages a country through economic levers, diplomacy, and internal politics. Each turn = month or week. Other countries (AI or players) act around — a living world with conflicts and opportunities.

**Setting:** Near-future (2026+), realistic styling, global scale.

---

## 2. Game Flow

### Turn Structure
- **Player Phase:** Edit parameters (interest rate, taxes, tariffs, budget allocation), set priorities, diplomatic actions (propose agreements, sanctions), military orders (redeployment, exercises)
- **Server Phase:** Simulate world markets, AI country actions, generate crises, calculate results
- **Result:** Graphs update, map highlights changes, events feed updates

### Time
- Turn = 1 week or 1 month (player choice per game)

### End Conditions
- Sandbox: no win condition, long-term development
- Scenarios: specific goals (exit crisis in X years, join EU by Y, etc.)
- Scenario library with real-world inspired situations (Syria, Ukraine, China-US, etc.)

---

## 3. World Map

**Physical map with political boundaries:**
- Click country = info (GDP, population, stability, resources)
- Click own region = sector statistics (industry, agriculture, energy, services)
- Cities as points (capital + major cities)
- Roads and infrastructure visible at zoom level

**Color coding:**
- Green — ally / positive relations
- Red — threat / conflict
- Yellow — tension
- Blue — neutral

**Trade routes displayed as lines** (thickness = volume, color = balance).

---

## 4. Core Panels

### 4.1 Economy
- Interest rate (central bank control)
- Public sector wages
- Pensions
- Taxes (corporate, income, VAT)
- Import/export tariffs
- Displayed: inflation, unemployment, GDP as graphs

### 4.2 Budget
- Income/expense by category
- Allocation: defense, healthcare, education, infrastructure, social programs
- Deficit/surplus

### 4.3 Sectors
- **Agriculture:** yield, exports, jobs
- **Industry:** production, jobs, modernization
- **Energy:** generation (coal, gas, nuclear, renewables), consumption
- **Services:** sector GDP, employment

### 4.4 Internal Politics
- Stability (0-100)
- Public mood
- Corruption
- Protest potential

### 4.5 Military
- Personnel count, structure (army, air force, navy)
- Budget
- readiness
- Technology level

### 4.6 Diplomacy
- Relations with each country (-100 to +100)
- Trade agreements
- Military alliances
- Sanctions (incoming/outgoing)

### 4.7 Events
- Current crises panel
- Partner proposals
- Threats

---

## 5. International Relations (Extended)

### 5.1 Global Trade

Each resource has a world price (changes weekly/monthly):
- Energy (oil, gas, coal, uranium)
- Metals (rare earth, lithium, cobalt)
- Agricultural products (grain, meat, vegetables)
- Industrial goods
- Technologies (chips, AI modules, components)

**Trade flows** shown on map as lines (thickness = volume, color = balance).
**Import/export:** Tariffs affect volumes and domestic prices. Contracts (long-term agreements).

### 5.2 International Logistics

**Maritime:**
- Key straits and canals (Suez, Panama, Malacca) — control = influence
- Sea routes shown on map
- Countries' fleets protect/control their routes

**Land routes:**
- Railways, highways
- Control of transshipment points

**Pipelines:**
- Gas/oil pipelines
- Shown as lines with ownership indicator
- Diversification = energy security

### 5.3 Soft Power
- Cultural presence (language, cinema, music, education)
- Media influence (propaganda, news)
- Sports events (Olympics, championships)
- Country image (+/- attractiveness)

**Mechanic:** Invest in culture → influence grows → other countries more loyal, easier trade, more skilled immigration.

### 5.4 Culture and Religion

**Cultural penetration:**
- Heat map showing "cultural influence" of other countries
- Migration brings culture
- Religious trends: fundamentalism, secularization, new movements

**Mechanic:** Culture affects stability, alliances, internal conflicts.

### 5.5 Brain Drain/Gain

- Categories: scientists, engineers, doctors, IT
- Wages and conditions attract/repel
- Education produces specialists, economy creates jobs
- Loss = technological lag

### 5.6 Key Technologies

**Technology levels:**
- Nuclear weapons (have/don't have, count)
- Nuclear energy (development level)
- AI (level 0-10)
- Semiconductors (production level)
- Renewable energy
- Space

**Mechanic:**
- Technologies provide advantages (e.g., AI boosts economic efficiency)
- Tech control = leverage (chip sanctions)
- Tech race requires R&D investment

### 5.7 Resource Competition

**Mining region control:**
- Oil/gas regions (Middle East, Siberia, shelves)
- Rare earth deposits (China, Congo, Bolivia)
- Lithium, cobalt (Latin America, Africa)

**Mechanic:**
- Investment in region = influence
- Control through alliances or direct presence
- Technologies enable development of complex deposits

---

## 6. Multiplayer

**Centralized server architecture:**
- One server manages the world
- Players connect as "advisors" of different countries
- All calculations on server
- Client only renders

**Server (Node.js + Rust/C++ for calculations):**
- World state storage
- Economics and AI simulation
- Player synchronization
- REST API for client

**Client (Godot 4):**
- 3D/2D world map (TileMap or custom render)
- UI based on Godot (Control nodes)
- Network client for sync

---

## 7. Platform

- **Platform:** PC (Godot 4)
- **Multiplayer:** centralized server
- **Map:** physical (cities, roads) + political boundaries
- **Style:** realistic near-future
- **Engine:** Godot 4

---

## 8. Unresolved Questions

- Scenario library specifics (number of scenarios, structure)
- AI behavior complexity
- Tutorial/onboarding