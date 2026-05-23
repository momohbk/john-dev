import { Router } from 'express';
import { z } from 'zod';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const variantSchema = z.object({
  product_id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  type: z.enum(['size', 'color']),
  stock: z.number().int().min(0).default(0),
  price_modifier: z.number().default(0),
});

router.get('/product/:productId', (req, res) => {
  res.json(all('SELECT * FROM product_variants WHERE product_id = ? ORDER BY type, name', [req.params.productId]));
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const parsed = variantSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const { product_id, name, type, stock, price_modifier } = parsed.data;
  const result = run(
    `INSERT INTO product_variants (product_id, name, type, stock, price_modifier) VALUES (?, ?, ?, ?, ?)`,
    [product_id, name, type, stock, price_modifier]
  );

  res.status(201).json(get('SELECT * FROM product_variants WHERE id = ?', [result.lastInsertRowid]));
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const fields: string[] = [];
  const values: any[] = [];
  const allowed = ['name', 'type', 'stock', 'price_modifier'];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (fields.length > 0) {
    values.push(req.params.id);
    run(`UPDATE product_variants SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  res.json(get('SELECT * FROM product_variants WHERE id = ?', [req.params.id]));
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  run('DELETE FROM product_variants WHERE id = ?', [req.params.id]);
  res.json({ message: 'Variant deleted' });
});

export default router;
