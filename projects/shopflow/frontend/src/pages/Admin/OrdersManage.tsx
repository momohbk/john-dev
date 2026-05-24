import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api/orders';
import type { Order } from '../../types';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersManage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    getAdminOrders(filterStatus || undefined)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleStatusChange = async (orderId: number, status: string) => {
    try { await updateOrderStatus(orderId, status); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'فشل تحديث الحالة'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">جاري التحميل...</div>;

  if (orders.length === 0) return <div className="text-center py-12 text-gray-400">لا توجد طلبات</div>;

  return (
    <div dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900">جميع الطلبات ({orders.length})</h2>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all max-w-[160px]">
          <option value="">الكل</option>
          {statuses.map(s => (
            <option key={s} value={s}>
              {s === 'pending' ? 'قيد الانتظار' : s === 'confirmed' ? 'مؤكد' : s === 'shipped' ? 'تم الشحن' : s === 'delivered' ? 'تم التوصيل' : 'ملغي'}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl border border-beige card-hover animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-beige rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">#{order.id}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">طلب #{order.id}</p>
                  <p className="text-xs text-gray-400">{order.user_name || 'زائر'} — {new Date(order.created_at).toLocaleDateString('fr-DZ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' ? 'قيد الانتظار' : order.status === 'confirmed' ? 'مؤكد' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                </span>
                <select value="" onChange={e => { if (e.target.value) handleStatusChange(order.id, e.target.value); }}
                  className="border border-beige-dark rounded-xl px-2.5 py-1.5 text-xs font-medium text-gray-500 focus:outline-none focus:border-rose transition-colors cursor-pointer">
                  <option value="">تغيير</option>
                  {statuses.filter(s => s !== order.status).map(s => (
                    <option key={s} value={s}>
                      {s === 'pending' ? 'قيد الانتظار' : s === 'confirmed' ? 'مؤكد' : s === 'shipped' ? 'تم الشحن' : s === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-beige/30 rounded-xl p-4">
              <div className="space-y-1.5">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product_name || `منتج #${item.product_id}`}<span className="text-gray-400 mr-1">×{item.quantity}</span></span>
                    <span className="font-medium text-gray-900">{(item.price * item.quantity).toLocaleString('fr-DZ')} د.ج</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-beige flex items-center justify-between">
              <span className="text-xs text-gray-400 truncate max-w-[300px]">{order.shipping_address}</span>
              <span className="text-lg font-bold text-rose">{order.total.toLocaleString('fr-DZ')} د.ج</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
