import { Router } from 'express';
import { all, get } from '../db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, requireAdmin, (req, res) => {
  const totalRevenue = get<any>("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'");
  const totalOrders = get<any>('SELECT COUNT(*) as count FROM orders');
  const totalProducts = get<any>('SELECT COUNT(*) as count FROM products');
  const totalCustomers = get<any>("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");

  const revenueByMonth = all<any>(`
    SELECT strftime('%Y-%m', created_at) as month, COALESCE(SUM(total), 0) as revenue
    FROM orders WHERE status != 'cancelled'
    GROUP BY month ORDER BY month DESC LIMIT 12
  `);

  const ordersByStatus = all<any>('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

  const recentOrders = all<any>(`
    SELECT o.*, u.name as user_name
    FROM orders o JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC LIMIT 5
  `);

  res.json({
    totalRevenue: totalRevenue?.total ?? 0,
    totalOrders: totalOrders?.count ?? 0,
    totalProducts: totalProducts?.count ?? 0,
    totalCustomers: totalCustomers?.count ?? 0,
    revenueByMonth,
    ordersByStatus,
    recentOrders,
  });
});

export default router;
