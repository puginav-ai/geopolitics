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