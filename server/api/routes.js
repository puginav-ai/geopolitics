import { Router } from 'express';
import { gameState } from '../index.js';
import { DiplomacySimulator } from '../simulation/diplomacy.js';
import { tradeSimulator } from '../simulation/trade.js';
import { TechnologySimulator } from '../simulation/technology.js';
import { MilitarySimulator } from '../simulation/military.js';

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

router.post('/diplomacy/propose', (req, res) => {
  const { countryId, targetId, type } = req.body;
  const result = DiplomacySimulator.proposeAgreement(countryId, targetId, type);
  res.json(result);
});

router.get('/countries/:id/relations', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json(country.relations || {});
});

router.post('/countries/:id/relations/:targetId', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  const target = gameState.getCountry(req.params.targetId);
  if (!country || !target) return res.status(404).json({ error: 'Not found' });

  const { score, action } = req.body;
  if (score !== undefined) {
    country.relations[req.params.targetId].score = score;
  }

  res.json({ success: true });
});

router.get('/trade/routes', (req, res) => {
  res.json(tradeSimulator.getTradeRoutes());
});

router.get('/market/prices', (req, res) => {
  res.json(gameState.worldMarket);
});

router.post('/trade/route', (req, res) => {
  const { from, to, resource, volume } = req.body;
  tradeSimulator.addTradeRoute(from, to, resource, volume);
  res.json({ success: true });
});

router.get('/countries/:id/trade', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json(country.sectors.trade || {});
});

router.get('/events', (req, res) => {
  res.json(gameState.events || []);
});

router.get('/countries/:id/tech', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json(country.technologies || {});
});

router.post('/countries/:id/tech/develop', (req, res) => {
  const { tech, level } = req.body;
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  
  const result = TechnologySimulator.canDevelop(country, tech, level);
  res.json(result);
});

router.get('/countries/:id/military', (req, res) => {
  const country = gameState.getCountry(req.params.id);
  if (!country) return res.status(404).json({ error: 'Not found' });
  res.json({
    military: country.military,
    strength: MilitarySimulator.calculateStrength(country)
  });
});

router.post('/military/attack', (req, res) => {
  const { attackerId, defenderId } = req.body;
  const attacker = gameState.getCountry(attackerId);
  const defender = gameState.getCountry(defenderId);

  if (!attacker || !defender) {
    return res.status(404).json({ error: 'Country not found' });
  }

  const canAttack = MilitarySimulator.canAttack(attacker, defender);
  res.json({
    canAttack,
    attackerStrength: MilitarySimulator.calculateStrength(attacker),
    defenderStrength: MilitarySimulator.calculateStrength(defender)
  });
});