import { Router } from 'express';
import { z } from 'zod';
import { all, get, run } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  shipping_address: z.string().min(1),
  customer_name: z.string().min(1).optional(),
  customer_phone: z.string().min(1).optional(),
  delivery_option: z.enum(['home', 'relay']).default('home'),
  payment_method: z.enum(['cod', 'online']).default('cod'),
  payment_intent_id: z.string().optional(),
});

router.get('/', authenticate, (req, res) => {
  const rows = all<any>(
    `SELECT o.*, oi.id as oi_id, oi.product_id, oi.quantity as oi_quantity, oi.price as oi_price, p.name as product_name
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [req.user!.id]
  );

  const orderMap = new Map<number, any>();
  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id, user_id: row.user_id, total: row.total, status: row.status,
        payment_intent_id: row.payment_intent_id, shipping_address: row.shipping_address,
        created_at: row.created_at, updated_at: row.updated_at, items: [],
      });
    }
    if (row.oi_id) {
      orderMap.get(row.id)!.items.push({
        id: row.oi_id, product_id: row.product_id, quantity: row.oi_quantity, price: row.oi_price, product_name: row.product_name,
      });
    }
  }

  res.json(Array.from(orderMap.values()));
});

router.get('/admin', authenticate, requireAdmin, (req, res) => {
  const { status } = req.query;
  let sql = `SELECT o.*, u.name as user_name, u.email as user_email,
                  oi.id as oi_id, oi.product_id, oi.quantity as oi_quantity, oi.price as oi_price, p.name as product_name
             FROM orders o
             LEFT JOIN users u ON o.user_id = u.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id`;
  const params: any[] = [];
  if (status) {
    sql += ' WHERE o.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY o.created_at DESC';

  const rows = all<any>(sql, params);
  const orderMap = new Map<number, any>();
  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id, user_id: row.user_id, total: row.total, status: row.status,
        payment_intent_id: row.payment_intent_id, shipping_address: row.shipping_address,
        created_at: row.created_at, updated_at: row.updated_at,
        user_name: row.user_name || row.customer_name || 'زائر',
        user_email: row.user_email || '',
        customer_phone: row.customer_phone,
        delivery_option: row.delivery_option,
        payment_method: row.payment_method,
        items: [],
      });
    }
    if (row.oi_id) {
      orderMap.get(row.id)!.items.push({
        id: row.oi_id, product_id: row.product_id, quantity: row.oi_quantity, price: row.oi_price, product_name: row.product_name,
      });
    }
  }

  res.json(Array.from(orderMap.values()));
});

router.post('/', (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });

  const { items, shipping_address, customer_name, customer_phone, delivery_option, payment_method, payment_intent_id } = parsed.data;
  const userId = (req as any).user?.id || null;

  let total = 0;
  for (const item of items) {
    const product = get<any>('SELECT * FROM products WHERE id = ? AND is_active = 1', [item.product_id]);
    if (!product) return res.status(400).json({ error: `Product ${item.product_id} not found` });
    if (product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    total += product.price * item.quantity;
  }

  const orderResult = run(
    `INSERT INTO orders (user_id, total, status, shipping_address, payment_intent_id, customer_name, customer_phone, delivery_option, payment_method) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
    [userId, total, shipping_address, payment_intent_id || null, customer_name || null, customer_phone || null, delivery_option, payment_method]
  );

  const orderId = orderResult.lastInsertRowid;
  for (const item of items) {
    const product = get<any>('SELECT * FROM products WHERE id = ?', [item.product_id]);
    run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, item.quantity, product.price]);
    run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
  }

  res.status(201).json(get('SELECT * FROM orders WHERE id = ?', [orderId]));
});

router.put('/:id/status', authenticate, requireAdmin, (req, res) => {
  const parsed = z.object({ status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid status' });

  const result = run("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?", [parsed.data.status, req.params.id]);
  if (result.changes === 0) return res.status(404).json({ error: 'Order not found' });

  res.json(get('SELECT * FROM orders WHERE id = ?', [req.params.id]));
});

export default router;
