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
  res.json({ success: true });
});