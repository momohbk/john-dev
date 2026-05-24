import { Router } from 'express';
import { z } from 'zod';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
  image_url: z.string().url().nullable().optional(),
  category_id: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().default(true),
});

router.get('/', (req, res) => {
  const category = req.query.category as string | undefined;
  const slug = req.query.slug as string | undefined;

  let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1`;
  const params: any[] = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }
  if (slug) {
    query += ' AND c.slug = ?';
    params.push(slug);
  }

  query += ' ORDER BY p.created_at DESC';
  const products = all(query, params) as any[];

  const enriched = products.map(p => {
    const variants = all('SELECT * FROM product_variants WHERE product_id = ?', [p.id]);
    const images = all('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [p.id]);
    return { ...p, variants, images };
  });

  res.json(enriched);
});

router.get('/admin', authenticate, requireAdmin, (req, res) => {
  const products = all(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC`) as any[];
  const enriched = products.map(p => {
    const variants = all('SELECT * FROM product_variants WHERE product_id = ?', [p.id]);
    return { ...p, variants };
  });
  res.json(enriched);
});

router.get('/:id', (req, res) => {
  const product = get(`SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`, [req.params.id]) as any;
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.variants = all('SELECT * FROM product_variants WHERE product_id = ?', [product.id]);
  product.images = all('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [product.id]);
  res.json(product);
});

router.post('/', authenticate, requireAdmin, (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const { name, description, price, stock, image_url, category_id, is_active } = parsed.data;
  const result = run(
    `INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, description, price, stock, image_url || null, category_id || null, is_active ? 1 : 0]
  );

  const product = get('SELECT * FROM products WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(product);
});

router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const existing = get('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const fields: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'is_active' ? (value ? 1 : 0) : value);
    }
  }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    values.push(req.params.id);
    run(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  res.json(get('SELECT * FROM products WHERE id = ?', [req.params.id]));
});

router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const result = run('DELETE FROM products WHERE id = ?', [req.params.id]);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export default router;
