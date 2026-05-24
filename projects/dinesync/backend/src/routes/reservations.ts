import { Router } from 'express';
import { z } from 'zod';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

export const reservationRouter = Router();

const reservationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().min(1, 'Time is required'),
  guests: z.number().int().min(1).max(20),
  notes: z.string().default(''),
});

const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

reservationRouter.get('/', authMiddleware, (_req, res) => {
  const db = getDb();
  const reservations = db.prepare('SELECT * FROM reservations ORDER BY date ASC, time ASC').all();
  res.json(reservations);
});

reservationRouter.get('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  if (!reservation) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }
  res.json(reservation);
});

reservationRouter.post('/', (req, res) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation failed' });
    return;
  }

  const db = getDb();
  const { name, email, phone, date, time, guests, notes } = parsed.data;

  const result = db.prepare(
    'INSERT INTO reservations (name, email, phone, date, time, guests, status, notes) VALUES (?, ?, ?, ?, ?, ?, \'pending\', ?)',
  ).run(name, email, phone, date, time, guests, notes);

  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reservation);
});

reservationRouter.put('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  const parsed = reservationSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation failed' });
    return;
  }

  const e = existing as Record<string, unknown>;
  const { name, email, phone, date, time, guests, notes } = parsed.data;

  db.prepare(
    'UPDATE reservations SET name = ?, email = ?, phone = ?, date = ?, time = ?, guests = ?, notes = ?, updated_at = datetime(\'now\') WHERE id = ?',
  ).run(
    name ?? e.name,
    email ?? e.email,
    phone ?? e.phone,
    date ?? e.date,
    time ?? e.time,
    guests ?? e.guests,
    notes ?? e.notes,
    req.params.id,
  );

  const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  res.json(updated);
});

reservationRouter.patch('/:id/status', authMiddleware, (req, res) => {
  const parsed = statusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Validation failed' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM reservations WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  db.prepare("UPDATE reservations SET status = ?, updated_at = datetime('now') WHERE id = ?").run(parsed.data.status, req.params.id);
  const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  res.json(updated);
});

reservationRouter.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM reservations WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Reservation not found' });
    return;
  }

  db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
  res.json({ message: 'Reservation deleted' });
});

// Admin stats
reservationRouter.get('/stats', authMiddleware, (_req, res) => {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const todayReservations = (db.prepare('SELECT COUNT(*) as count FROM reservations WHERE date = ?').get(today) as { count: number }).count;
  const totalReservations = (db.prepare('SELECT COUNT(*) as count FROM reservations').get() as { count: number }).count;
  const popularItems = (db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE available = 1').get() as { count: number }).count;

  res.json({
    todayReservations,
    todayRevenue: todayReservations * 50,
    totalReservations,
    popularItems,
  });
});
