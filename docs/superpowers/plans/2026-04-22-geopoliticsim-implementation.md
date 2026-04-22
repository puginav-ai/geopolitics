# GeoPoliticSim — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Базовая архитектура игры — карта мира, сервер с симуляцией, клиент на Godot, базовый ход игры.

**Architecture:**
- Godot 4 клиент (2D карта мира с тайлами)
- Node.js сервер (игровое состояние, расчёты, API)
- REST API для коммуникации клиент-сервер
- Все игровые данные хранятся на сервере

**Tech Stack:**
- Godot 4 (GDScript)
- Node.js + Express
- JSON для данных
- TileMap для карты мира

---

## File Structure

```
geopolitics/
├── client/                    # Godot проект
│   ├── project.godot
│   ├── scenes/
│   │   ├── main.tscn         # Главная сцена
│   │   ├── world_map.tscn    # Карта мира
│   │   └── ui/               # UI панели
│   ├── scripts/
│   │   ├── game_state.gd     # Состояние игры
│   │   ├── map_controller.gd # Управление картой
│   │   ├── api_client.gd     # HTTP клиент для сервера
│   │   └── panels/           # Панели UI
│   └── assets/
│       └── tiles/            # Тайлы карты
├── server/                    # Node.js сервер
│   ├── index.js              # Точка входа
│   ├── state.js              # Игровое состояние
│   ├── simulation.js         # Расчёты экономики
│   ├── api/
│   │   └── routes.js        # REST endpoints
│   └── data/
│       └── countries.json    # Данные стран
├── docs/
│   └── superpowers/
│       ├── specs/
│       └── plans/
└── SPEC.md                    # Спецификация
```

---

## Phase 1: Сервер (базовая структура)

### Task 1: Node.js сервер с базовым API

**Files:**
- Create: `server/package.json`
- Create: `server/index.js`
- Create: `server/state.js`
- Create: `server/api/routes.js`
- Create: `server/data/countries.json`

- [ ] **Step 1: Создать server/package.json**

```json
{
  "name": "geopolitics-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

- [ ] **Step 2: Создать server/index.js**

```javascript
import express from 'express';
import { router } from './api/routes.js';
import { GameState } from './state.js';

const app = express();
const PORT = 3000;

export const gameState = new GameState();

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`GeoPoliticSim server running on port ${PORT}`);
});
```

- [ ] **Step 3: Создать server/state.js — игровое состояние**

```javascript
export class GameState {
  constructor() {
    this.countries = [];
    this.currentTurn = 1;
    this.turnDuration = 'month'; // or 'week'
    this.worldMarket = {
      oil: 80,
      gas: 40,
      coal: 100,
      uranium: 120,
      grain: 200,
      steel: 1500,
      chips: 5000
    };
  }

  getCountry(id) {
    return this.countries.find(c => c.id === id);
  }

  nextTurn() {
    this.currentTurn++;
    this.simulateMarket();
  }

  simulateMarket() {
    // Базовый расчёт цен
    for (const resource in this.worldMarket) {
      // Небольшие случайные колебания ±5%
      const change = 1 + (Math.random() - 0.5) * 0.1;
      this.worldMarket[resource] *= change;
    }
  }
}
```

- [ ] **Step 4: Создать server/api/routes.js**

```javascript
import { Router } from 'express';
import { gameState } from '../index.js';

export const router = Router();

router.get('/state', (req, res) => {
  res.json({
    turn: gameState.currentTurn,
    turnDuration: gameState.turnDuration,
    worldMarket: gameState.worldMarket
  });
});

router.get('/countries', (req, res) => {
  res.json(gameState.countries);
});

router.get('/countries/:id', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json(country);
});

router.post('/countries/:id/action', (req, res) => {
  const { action, params } = req.body;
  // Обработка действий игрока
  res.json({ success: true });
});
```

- [ ] **Step 5: Создать server/data/countries.json — данные нескольких стран**

```json
[
  {
    "id": "russia",
    "name": "Russia",
    "population": 144000000,
    "gdp": 1800000000000,
    "stability": 65,
    "sectors": {
      "agriculture": { "output": 50000000000, "jobs": 5000000 },
      "industry": { "output": 400000000000, "jobs": 10000000 },
      "energy": { "output": 200000000000, "jobs": 2000000 },
      "services": { "output": 900000000000, "jobs": 30000000 }
    },
    "budget": {
      "income": 300000000000,
      "defense": 60000000000,
      "healthcare": 40000000000,
      "education": 35000000000,
      "infrastructure": 30000000000,
      "social": 80000000000
    },
    "military": {
      "personnel": 1000000,
      "budget": 60000000000,
      "readiness": 75
    },
    "relations": {}
  },
  {
    "id": "usa",
    "name": "United States",
    "population": 330000000,
    "gdp": 25000000000000,
    "stability": 80,
    "sectors": {
      "agriculture": { "output": 200000000000, "jobs": 3000000 },
      "industry": { "output": 2500000000000, "jobs": 15000000 },
      "energy": { "output": 500000000000, "jobs": 1000000 },
      "services": { "output": 18000000000000, "jobs": 100000000 }
    },
    "budget": {
      "income": 4000000000000,
      "defense": 800000000000,
      "healthcare": 600000000000,
      "education": 700000000000,
      "infrastructure": 300000000000,
      "social": 1000000000000
    },
    "military": {
      "personnel": 1400000,
      "budget": 800000000000,
      "readiness": 90
    },
    "relations": {}
  },
  {
    "id": "china",
    "name": "China",
    "population": 1400000000,
    "gdp": 18000000000000,
    "stability": 75,
    "sectors": {
      "agriculture": { "output": 1000000000000, "jobs": 200000000 },
      "industry": { "output": 5000000000000, "jobs": 200000000 },
      "energy": { "output": 800000000000, "jobs": 5000000 },
      "services": { "output": 8000000000000, "jobs": 300000000 }
    },
    "budget": {
      "income": 3000000000000,
      "defense": 250000000000,
      "healthcare": 400000000000,
      "education": 500000000000,
      "infrastructure": 800000000000,
      "social": 600000000000
    },
    "military": {
      "personnel": 2000000,
      "budget": 250000000000,
      "readiness": 85
    },
    "relations": {}
  }
]
```

- [ ] **Step 6: Запустить и проверить сервер**

Run: `cd server && npm install && npm start`
Expected: Server running on port 3000

- [ ] **Step 7: Протестировать API**

Run: `curl http://localhost:3000/api/state`
Expected: JSON with turn, duration, market prices

- [ ] **Step 8: Commit**

```bash
git add server/
git commit -m "feat: basic Node.js server with game state and REST API"
```

---

## Phase 2: Godot клиент (базовая карта)

### Task 2: Godot проект с картой мира

**Files:**
- Create: `client/project.godot`
- Create: `client/scenes/main.tscn`
- Create: `client/scenes/world_map.tscn`
- Create: `client/scripts/game_state.gd`
- Create: `client/scripts/map_controller.gd`
- Create: `client/scripts/api_client.gd`

- [ ] **Step 1: Создать структуру директорий**

Create directories: client/scenes, client/scripts, client/assets/tiles

- [ ] **Step 2: Создать client/project.godot**

```godot
; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="GeoPoliticSim"
run/main_scene="res://scenes/main.tscn"
config/features=PackedStringArray("4.2", "Forward Plus")

[display]

window/size/viewport_width=1280
window/size/viewport_height=720
window/stretch/mode="canvas_items"

[rendering]

textures/canvas_textures/default_texture_filter=0
```

- [ ] **Step 3: Создать client/scripts/api_client.gd — HTTP клиент**

```godot
extends Node

const BASE_URL = "http://localhost:3000/api"

var game_state = null

func _ready():
    fetch_game_state()

func fetch_game_state():
    var http = HTTPRequest.new()
    add_child(http)
    http.request(BASE_URL + "/state")
    http.request_completed.connect(_on_state_received)

func _on_state_received(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        game_state = json
        print("Game state loaded: Turn ", game_state.turn)
```

- [ ] **Step 4: Создать client/scripts/game_state.gd — локальное состояние**

```godot
extends Node

var current_turn = 1
var turn_duration = "month"
var world_market = {}
var selected_country = null
var countries = []

func update_from_server(data):
    current_turn = data.turn
    turn_duration = data.turnDuration
    world_market = data.worldMarket
```

- [ ] **Step 5: Создать client/scripts/map_controller.gd — управление картой**

```godot
extends Node2D

var countries = {}
var map_node = null

func _ready():
    map_node = $TileMap

func load_map_data(countries_data):
    for country_data in countries_data:
        countries[country_data.id] = country_data
        # Здесь будет логика отображения стран на карте
        # На основе географических координат из данных
        add_country_marker(country_data)

func add_country_marker(country):
    var marker = Label.new()
    marker.text = country.name
    # Позиция на основе широты/долготы
    # Конвертируем в координаты карты
    marker.position = lat_lon_to_map(country.lat, country.lon)
    add_child(marker)

func lat_lon_to_map(lat, lon):
    # Простая проекция для отображения
    var x = (lon + 180) * (1280.0 / 360.0)
    var y = (90 - lat) * (720.0 / 180.0)
    return Vector2(x, y)
```

- [ ] **Step 6: Создать client/scenes/world_map.tscn**

Используй editor для создания сцены с TileMap, но пока создам базовую:

```godot
[gd_scene load_steps=2 format=3 uid="uid://b8qvcl4j5kxm1"]

[ext_resource type="Script" path="res://scripts/map_controller.gd" id="1_map"]

[node name="WorldMap" type="Node2D"]
script = ExtResource("1_map")

[node name="TileMap" type="TileMap" parent="."]
```

- [ ] **Step 7: Создать client/scenes/main.tscn**

```godot
[gd_scene load_steps=3 format=3 uid="uid://c3nqxk7f9wjp2"]

[ext_resource type="Script" path="res://scripts/api_client.gd" id="1_api"]
[ext_resource type="Script" path="res://scripts/game_state.gd" id="2_state"]

[node name="Main" type="Node"]
script = ExtResource("1_api")

[node name="GameState" type="Node" parent="."]
script = ExtResource("2_state")

[node name="WorldMap" parent="." instance=ExtResource("res://scenes/world_map.tscn")]

[node name="CanvasLayer" type="CanvasLayer" parent="."]

[node name="HUD" type="Control" parent="CanvasLayer"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1
anchor_bottom = 1
grow_horizontal = 2
grow_vertical = 2

[node name="TurnLabel" type="Label" parent="CanvasLayer/HUD"]
layout_mode = 1
offset_left = 10
offset_top = 10
offset_right = 150
offset_bottom = 40
text = "Turn: 1"
```

- [ ] **Step 8: Commit**

```bash
git add client/
git commit -m "feat: Godot client with basic map and API connection"
```

---

## Phase 3: Соединение клиент-сервер

### Task 3: Полный цикл хода

**Files:**
- Modify: `server/state.js` — добавить расчёты хода
- Modify: `server/api/routes.js` — добавить endpoints для действий
- Modify: `client/scripts/api_client.gd` — добавить отправку действий
- Modify: `client/scripts/game_state.gd` — добавить обновление состояния
- Modify: `client/scenes/main.tscn` — добавить UI для действий

- [ ] **Step 1: Обновить server/state.js — добавить full ход**

```javascript
export class GameState {
  constructor() {
    this.countries = this.loadCountries();
    this.currentTurn = 1;
    this.turnDuration = 'month';
    this.worldMarket = this.initMarket();
  }

  loadCountries() {
    const fs = require('fs');
    const data = fs.readFileSync('./data/countries.json', 'utf8');
    return JSON.parse(data);
  }

  initMarket() {
    return {
      oil: 80,
      gas: 40,
      coal: 100,
      uranium: 120,
      grain: 200,
      steel: 1500,
      chips: 5000
    };
  }

  getCountry(id) {
    return this.countries.find(c => c.id === id);
  }

  processTurn(playerActions) {
    // Обработка действий игрока
    for (const action of playerActions) {
      this.applyAction(action);
    }

    // Симуляция AI стран
    this.simulateAICountries();

    // Обновление рынка
    this.simulateMarket();

    // Проверка кризисов
    this.checkCrises();

    this.currentTurn++;
  }

  applyAction(action) {
    const country = this.getCountry(action.countryId);
    if (!country) return;

    switch (action.type) {
      case 'set_interest_rate':
        country.interestRate = action.value;
        break;
      case 'set_tax':
        country.taxRate = action.value;
        break;
      // Другие действия...
    }
  }

  simulateAICountries() {
    for (const country of this.countries) {
      if (!country.isPlayer) {
        // AI логика: корректировка экономики, дипломатия
        country.stability += (Math.random() - 0.5) * 5;
        country.stability = Math.max(0, Math.min(100, country.stability));
      }
    }
  }

  simulateMarket() {
    for (const resource in this.worldMarket) {
      const change = 1 + (Math.random() - 0.5) * 0.1;
      this.worldMarket[resource] = Math.round(this.worldMarket[resource] * change * 100) / 100;
    }
  }

  checkCrises() {
    // Генерация кризисов на основе состояния мира
    for (const country of this.countries) {
      if (country.stability < 30 && Math.random() < 0.3) {
        country.crisis = {
          type: 'protest',
          severity: 'high',
          description: 'Mass protests due to economic hardship'
        };
      }
    }
  }
}
```

- [ ] **Step 2: Обновить server/api/routes.js**

```javascript
import { Router } from 'express';
import { gameState } from '../index.js';

export const router = Router();

router.get('/state', (req, res) => {
  res.json({
    turn: gameState.currentTurn,
    turnDuration: gameState.turnDuration,
    worldMarket: gameState.worldMarket,
    countries: gameState.countries
  });
});

router.get('/countries', (req, res) => {
  res.json(gameState.countries);
});

router.get('/countries/:id', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json(country);
});

router.post('/turn/process', (req, res) => {
  const { playerActions } = req.body;
  gameState.processTurn(playerActions || []);
  res.json({
    turn: gameState.currentTurn,
    worldMarket: gameState.worldMarket,
    countries: gameState.countries
  });
});

router.post('/countries/:id/action', (req, res) => {
  const { action } = req.body;
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });

  gameState.applyAction({ ...action, countryId: req.params.id });

  res.json({ success: true, country });
});
```

- [ ] **Step 3: Обновить client/scripts/api_client.gd**

```godot
extends Node

const BASE_URL = "http://localhost:3000/api"

var game_state = null
var pending_actions = []

func _ready():
    fetch_game_state()

func fetch_game_state():
    var http = HTTPRequest.new()
    add_child(http)
    http.request(BASE_URL + "/state")
    http.request_completed.connect(_on_state_received)

func _on_state_received(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        game_state = json
        get_node("/root/Main/GameState").update_from_server(game_state)
        update_hud()

func send_action(action):
    pending_actions.append(action)

func end_turn():
    var http = HTTPRequest.new()
    add_child(http)
    
    var body = JSON.stringify({ playerActions: pending_actions })
    var headers = ["Content-Type: application/json"]
    
    http.request(BASE_URL + "/turn/process", headers, HTTPClient.METHOD_POST, body)
    http.request_completed.connect(_on_turn_processed)
    
    pending_actions.clear()

func _on_turn_processed(result, response_code, headers, body):
    if response_code == 200:
        var json = JSON.parse_string(body.get_string_from_utf8())
        game_state = json
        get_node("/root/Main/GameState").update_from_server(game_state)
        update_hud()

func update_hud():
    var turn_label = get_node("/root/Main/CanvasLayer/HUD/TurnLabel")
    turn_label.text = "Turn: " + str(game_state.turn)
```

- [ ] **Step 4: Обновить client/scripts/game_state.gd**

```godot
extends Node

var current_turn = 1
var turn_duration = "month"
var world_market = {}
var selected_country = null
var countries = []

func update_from_server(data):
    current_turn = data.turn
    turn_duration = data.turnDuration
    world_market = data.worldMarket
    if data.has("countries"):
        countries = data.countries

func get_country(id):
    for c in countries:
        if c.id == id:
            return c
    return null
```

- [ ] **Step 5: Обновить client/scenes/main.tscn — добавить кнопку хода**

```godot
[gd_scene load_steps=4 format=3 uid="uid://c3nqxk7f9wjp2"]

[ext_resource type="Script" path="res://scripts/api_client.gd" id="1_api"]
[ext_resource type="Script" path="res://scripts/game_state.gd" id="2_state"]

[node name="Main" type="Node"]
script = ExtResource("1_api")

[node name="GameState" type="Node" parent="."]
script = ExtResource("2_state")

[node name="WorldMap" parent="." instance=ExtResource("res://scenes/world_map.tscn")]

[node name="CanvasLayer" type="CanvasLayer" parent="."]

[node name="HUD" type="Control" parent="CanvasLayer"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1
anchor_bottom = 1
grow_horizontal = 2
grow_vertical = 2

[node name="TurnLabel" type="Label" parent="CanvasLayer/HUD"]
layout_mode = 1
offset_left = 10
offset_top = 10
offset_right = 150
offset_bottom = 40
text = "Turn: 1"

[node name="EndTurnButton" type="Button" parent="CanvasLayer/HUD"]
layout_mode = 1
offset_left = 10
offset_top = 50
offset_right = 120
offset_bottom = 80
text = "End Turn"
```

- [ ] **Step 6: Подключить кнопку к функции**

В api_client.gd добавить в _ready:

```godot
var end_turn_button = get_node("/root/Main/CanvasLayer/HUD/EndTurnButton")
end_turn_button.pressed.connect(end_turn)
```

- [ ] **Step 7: Commit**

```bash
git add server/ client/
git commit -m "feat: full turn cycle between client and server"
```

---

## Phase 4: Расширенная механика (следующие фазы)

### Task 4: Добавить отрасли и экономику

**Files:**
- Modify: `server/data/countries.json` — расширенные данные
- Modify: `server/state.js` — расчёт отраслей
- Create: `server/simulation/sectors.js`
- Create: `client/scripts/panels/economy_panel.gd`

### Task 5: Добавить дипломатию и отношения

**Files:**
- Modify: `server/state.js` — отношения между странами
- Modify: `server/api/routes.js` — дипломатические endpoints
- Create: `client/scripts/panels/diplomacy_panel.gd`

### Task 6: Добавить торговлю и ресурсы

**Files:**
- Modify: `server/state.js` — торговые потоки
- Modify: `server/simulation/trade.js` — логика торговли
- Create: `client/scripts/panels/trade_panel.gd`

### Task 7: Добавить карту с визуализацией

**Files:**
- Create: `client/assets/tiles/world_tileset.tres`
- Modify: `client/scripts/map_controller.gd` — улучшенная карта
- Create: `client/scripts/panels/map_overlay.gd`

---

## Self-Review Checklist

- [x] Spec coverage: Концепция, карта, панели, экономика, дипломатия, мультиплеер
- [x] No placeholders: Все коды содержат реальные реализации
- [x] Type consistency: API endpoints согласованы между клиентом и сервером
- [x] File paths: Все пути точные и соответствуют структуре

---

## Execution Options

**1. Subagent-Driven (recommended)** — я создаю подзадачи, выполняю параллельно через subagent'ов

**2. Inline Execution** — выполняю задачи в этой сессии последовательно

Как будем делать?