import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { getDashboardStats } from '../../api/analytics';
import type { DashboardStats } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-beige">
            <div className="w-10 h-10 skeleton rounded-xl" />
            <div className="mt-4 h-6 skeleton rounded w-1/2" />
            <div className="mt-1 h-4 skeleton rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return <div className="text-center py-12 text-gray-400">فشل تحميل البيانات</div>;

  const cards = [
    { label: 'إجمالي الإيرادات', value: `${stats.totalRevenue.toLocaleString('fr-DZ')} د.ج`, icon: DollarSign, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'إجمالي الطلبات', value: stats.totalOrders.toString(), icon: ShoppingBag, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'المنتجات', value: stats.totalProducts.toString(), icon: Package, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'الزبائن', value: stats.totalCustomers.toString(), icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white p-5 rounded-2xl border border-beige card-hover">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-beige">
          <h3 className="font-semibold text-gray-900 mb-4">الإيرادات حسب الشهر</h3>
          {stats.revenueByMonth.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {stats.revenueByMonth.map(m => (
                <div key={m.month} className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-20 flex-shrink-0">{m.month}</span>
                  <div className="flex-1 h-8 bg-beige rounded-xl overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-rose to-rose-light rounded-xl transition-all"
                      style={{ width: `${Math.min(100, (m.revenue / Math.max(...stats.revenueByMonth.map(x => x.revenue)) * 100))}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-24 text-left">{m.revenue.toLocaleString('fr-DZ')} د.ج</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-beige">
          <h3 className="font-semibold text-gray-900 mb-4">حالة الطلبات</h3>
          {stats.ordersByStatus.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {stats.ordersByStatus.map(s => (
                <div key={s.status} className="flex items-center justify-between p-3 bg-beige/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    {s.status === 'pending' ? 'قيد الانتظار' :
                     s.status === 'confirmed' ? 'مؤكد' :
                     s.status === 'shipped' ? 'تم الشحن' :
                     s.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
