import { Router } from 'express';
import { z } from 'zod';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const reviewSchema = z.object({
  product_id: z.number().int().positive(),
  customer_name: z.string().min(1).max(100),
  customer_phone: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(1000),
});

router.get('/product/:productId', (req, res) => {
  const reviews = all(
    `SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC`,
    [req.params.productId]
  );
  res.json(reviews);
});

router.get('/pending', authenticate, requireAdmin, (req, res) => {
  res.json(all(`SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.is_approved = 0 ORDER BY r.created_at DESC`));
});

router.get('/all', authenticate, requireAdmin, (req, res) => {
  res.json(all(`SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id ORDER BY r.created_at DESC`));
});

router.post('/', (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const { product_id, customer_name, customer_phone, rating, text } = parsed.data;
  const result = run(
    `INSERT INTO reviews (product_id, customer_name, customer_phone, rating, text) VALUES (?, ?, ?, ?, ?)`,
    [product_id, customer_name, customer_phone || null, rating, text]
  );

  const review = get('SELECT * FROM reviews WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(review);
});

router.put('/:id/approve', authenticate, requireAdmin, (req, res) => {
  run('UPDATE reviews SET is_approved = 1 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Review approved' });
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
  res.json({ message: 'Review deleted' });
});

export default router;
