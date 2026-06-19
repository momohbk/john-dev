import { Router } from 'express';
import { all } from '../db.js';

const router = Router();

router.post('/', (req, res) => {
  const { order_id, phone } = req.body;
  if (!order_id || !phone) {
    return res.status(400).json({ error: 'Order ID and phone are required' });
  }

  const orders = all(`
    SELECT o.*,
      (SELECT json_group_array(json_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'product_name', p.name))
       FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
    FROM orders o
    WHERE o.id = ?
    LIMIT 1
  `, [order_id]);
  
  if (orders.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[0] as any;
  let items = [];
  try { items = JSON.parse(order.items || '[]'); } catch { items = []; }
  order.items = items;

  res.json(order);
});

export default router;
