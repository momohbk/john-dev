import { Router } from 'express';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const settings = all('SELECT * FROM settings');
  const result: Record<string, string> = {};
  for (const s of settings as any[]) {
    result[s.key] = s.value;
  }
  res.json(result);
});

router.put('/', authenticate, requireAdmin, (req, res) => {
  const allowed = [
    'store_name', 'store_logo', 'contact_email', 'contact_phone',
    'delivery_fee', 'free_delivery_threshold', 'delivery_time_message',
    'facebook_url', 'instagram_url', 'tiktok_url',
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      const existing = get('SELECT key FROM settings WHERE key = ?', [key]);
      if (existing) {
        run('UPDATE settings SET value = ?, updated_at = datetime(\'now\') WHERE key = ?', [String(req.body[key]), key]);
      } else {
        run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(req.body[key])]);
      }
    }
  }

  const updated = all('SELECT * FROM settings');
  const result: Record<string, string> = {};
  for (const s of updated as any[]) {
    result[s.key] = s.value;
  }
  res.json(result);
});

export default router;
