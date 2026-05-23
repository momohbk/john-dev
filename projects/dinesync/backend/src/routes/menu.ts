import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

export const menuRouter = Router();

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().nullable().optional(),
  available: z.boolean().default(true),
});

menuRouter.get('/', (_req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
  res.json(items);
});

menuRouter.get('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Menu item not found' });
    return;
  }
  res.json(item);
});

menuRouter.post('/', authMiddleware, (req, res) => {
  const parsed = menuItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation failed' });
    return;
  }

  const db = getDb();
  const { name, description, price, category, image, available } = parsed.data;
  const result = db.prepare(
    'INSERT INTO menu_items (name, description, price, category, image, available) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(name, description, price, category, image ?? null, available ? 1 : 0);

  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

menuRouter.put('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Menu item not found' });
    return;
  }

  const parsed = menuItemSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation failed' });
    return;
  }

  const e = existing as Record<string, unknown>;
  const { name, description, price, category, image, available } = parsed.data;

  db.prepare(
    'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image = ?, available = ?, updated_at = datetime(\'now\') WHERE id = ?',
  ).run(
    name ?? e.name,
    description ?? e.description,
    price ?? e.price,
    category ?? e.category,
    image !== undefined ? (image ?? null) : e.image,
    available !== undefined ? (available ? 1 : 0) : e.available,
    req.params.id,
  );

  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  res.json(updated);
});

menuRouter.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Menu item not found' });
    return;
  }

  db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
  res.json({ message: 'Menu item deleted' });
});
