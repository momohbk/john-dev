import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { getMyOrders } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-beige">
              <div className="space-y-3"><div className="h-5 skeleton rounded w-1/3" /><div className="h-4 skeleton rounded w-full" /><div className="h-4 skeleton rounded w-2/3" /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-up" dir="rtl">
        <div className="w-20 h-20 mx-auto bg-beige rounded-3xl flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">لا توجد طلبات بعد</h2>
        <p className="mt-2 text-gray-400">قم بطلبك الأول الآن.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all mt-6">تسوق الآن</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
        <span className="text-sm text-gray-500">{orders.length} طلب</span>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={order.id} className="bg-white p-6 rounded-2xl border border-beige card-hover animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">طلب رقم #{order.id}</p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-DZ')}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {order.status === 'pending' ? 'قيد الانتظار' :
                 order.status === 'confirmed' ? 'تم التأكيد' :
                 order.status === 'shipped' ? 'تم الشحن' :
                 order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product_name || `منتج #${item.product_id}`} <span className="text-gray-400 mr-1">×{item.quantity}</span></span>
                  <span className="font-medium text-gray-900">{(item.price * item.quantity).toLocaleString('fr-DZ')} د.ج</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-beige flex items-center justify-between">
              <span className="text-xs text-gray-400">المجموع</span>
              <span className="text-lg font-bold text-rose">{order.total.toLocaleString('fr-DZ')} د.ج</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
