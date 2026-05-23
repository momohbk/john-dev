import { useState } from 'react';
import { Package, Search, Truck } from 'lucide-react';
import { trackOrder } from '../api/tracking';
import type { Order } from '../types';

export default function Tracking() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) { setError('يرجى إدخال رقم الطلب والهاتف'); return; }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await trackOrder(Number(orderId), phone);
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'الطلب غير موجود');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'قيد الانتظار' },
    { key: 'confirmed', label: 'تم التأكيد' },
    { key: 'shipped', label: 'تم الشحن' },
    { key: 'delivered', label: 'تم التوصيل' },
  ];

  const currentStep = order ? statusSteps.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-rose/10 rounded-3xl flex items-center justify-center mb-4">
          <Truck className="w-8 h-8 text-rose" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">تتبع طلبك</h1>
        <p className="mt-1 text-gray-400 text-sm">أدخل رقم الطلب ورقم الهاتف لتتبع حالة طلبك</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-beige space-y-4 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الطلب</label>
          <input type="number" value={orderId} onChange={e => setOrderId(e.target.value)} required
            className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
            placeholder="مثال: 1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
            className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
            placeholder="05XX XX XX XX" />
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-rose text-white w-full py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all disabled:opacity-50">
          {loading ? 'جاري البحث...' : 'تتبع الطلب'}
          <Search className="w-4 h-4" />
        </button>
      </form>

      {order && (
        <div className="mt-8 bg-white p-6 rounded-2xl border border-beige animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-rose" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">طلب رقم #{order.id}</p>
              <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('fr-DZ')}</p>
            </div>
          </div>

          <div className="relative">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex items-start gap-3 pb-6 last:pb-0 relative">
                {i < statusSteps.length - 1 && (
                  <div className={`absolute right-[11px] top-6 w-0.5 h-full -translate-x-1/2 ${i < currentStep ? 'bg-rose' : i === currentStep ? 'bg-rose' : 'bg-beige-dark'}`} />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < currentStep ? 'bg-rose text-white' :
                  i === currentStep ? 'bg-rose text-white ring-4 ring-rose/20' :
                  'bg-beige-dark text-gray-400'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <div className="pt-0.5">
                  <p className={`text-sm font-medium ${i <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4 border-beige" />

          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product_name || `منتج #${item.product_id}`} <span className="text-gray-400 mr-1">×{item.quantity}</span></span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString('fr-DZ')} د.ج</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-beige flex justify-between">
            <span className="font-semibold text-gray-900">الإجمالي</span>
            <span className="font-bold text-rose">{order.total.toLocaleString('fr-DZ')} د.ج</span>
          </div>
        </div>
      )}
    </div>
  );
}
