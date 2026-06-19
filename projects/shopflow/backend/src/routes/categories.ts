import { Router } from 'express';
import { all } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(all('SELECT * FROM categories ORDER BY name'));
});

export default router;
