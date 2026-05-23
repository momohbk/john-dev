import { Router } from 'express';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(all('SELECT * FROM pixels WHERE is_active = 1'));
});

router.get('/all', authenticate, requireAdmin, (req, res) => {
  res.json(all('SELECT * FROM pixels'));
});

router.put('/:platform', authenticate, requireAdmin, (req, res) => {
  const { tracking_id, is_active } = req.body;
  const existing = get('SELECT id FROM pixels WHERE platform = ?', [req.params.platform]);

  if (existing) {
    const fields: string[] = [];
    const values: any[] = [];
    if (tracking_id !== undefined) { fields.push('tracking_id = ?'); values.push(tracking_id); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }
    if (fields.length > 0) {
      values.push(req.params.platform);
      run(`UPDATE pixels SET ${fields.join(', ')} WHERE platform = ?`, values);
    }
  } else {
    run('INSERT INTO pixels (platform, tracking_id, is_active) VALUES (?, ?, ?)', [
      req.params.platform,
      tracking_id || '',
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
    ]);
  }

  res.json(get('SELECT * FROM pixels WHERE platform = ?', [req.params.platform]));
});

export default router;
