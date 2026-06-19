import { Router } from 'express';
import { all } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAdmin, (req, res) => {
  const customers = all(`
    SELECT u.*,
      (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE user_id = u.id) as total_spent
    FROM users u WHERE u.role = 'customer'
    ORDER BY u.created_at DESC
  `);
  res.json(customers);
});

router.get('/:id', authenticate, requireAdmin, (req, res) => {
  const orders = all(`
    SELECT o.*, 
      (SELECT json_group_array(json_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) 
       FROM order_items oi WHERE oi.order_id = o.id) as items
    FROM orders o WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [req.params.id]);
  res.json(orders);
});

export default router;
