import { Router } from 'express';
import { z } from 'zod';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const bannerSchema = z.object({
  title: z.string().max(200).optional(),
  subtitle: z.string().max(500).optional(),
  image_url: z.string().url(),
  link_url: z.string().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

router.get('/', (req, res) => {
  res.json(all(`SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC`));
});

router.get('/all', authenticate, requireAdmin, (req, res) => {
  res.json(all(`SELECT * FROM banners ORDER BY sort_order ASC`));
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const parsed = bannerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const { title, subtitle, image_url, link_url, sort_order, is_active } = parsed.data;
  const result = run(
    `INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
    [title || null, subtitle || null, image_url, link_url || null, sort_order, is_active ? 1 : 0]
  );

  res.status(201).json(get('SELECT * FROM banners WHERE id = ?', [result.lastInsertRowid]));
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const existing = get('SELECT * FROM banners WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Banner not found' });

  const fields: string[] = [];
  const values: any[] = [];
  const allowed = ['title', 'subtitle', 'image_url', 'link_url', 'sort_order', 'is_active'];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'is_active' ? (req.body[key] ? 1 : 0) : req.body[key]);
    }
  }

  if (fields.length > 0) {
    values.push(req.params.id);
    run(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  res.json(get('SELECT * FROM banners WHERE id = ?', [req.params.id]));
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  run('DELETE FROM banners WHERE id = ?', [req.params.id]);
  res.json({ message: 'Banner deleted' });
});

export default router;
