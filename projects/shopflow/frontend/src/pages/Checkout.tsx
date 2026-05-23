import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, Package, ChevronLeft, Truck, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'relay'>('home');
  const paymentMethod = 'cod' as const;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));
      const order = await createOrder({
        items: orderItems,
        shipping_address: address,
        customer_name: name,
        customer_phone: phone,
        delivery_option: deliveryOption,
        payment_method: paymentMethod,
      });
      clearCart();
      navigate(`/thank-you/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إتمام الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  const finalTotal = total + (total >= 5000 ? 0 : 500);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        العودة للسلة
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-2xl border border-beige">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">معلومات التوصيل</h2>
                  <p className="text-xs text-gray-400">أين تريد استلام طلبك؟</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل *</label>
                  <input value={name} onChange={e => setName(e.target.value)} required
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
                    placeholder="الاسم واللقب" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف *</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
                    placeholder="05XX XX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان التوصيل *</label>
                  <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={3}
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all resize-none"
                    placeholder="الولاية - البلدية - العنوان الكامل" />
                </div>
              </div>

              {error && <p className="mt-3 text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-beige mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">خيار التوصيل</h2>
                </div>
              </div>
              <div className="space-y-2">
                <button type="button" onClick={() => setDeliveryOption('home')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    deliveryOption === 'home' ? 'border-rose bg-rose/5' : 'border-beige-dark'
                  }`}>
                  <Home className="w-5 h-5 text-rose" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">توصيل إلى المنزل</p>
                    <p className="text-xs text-gray-400">يستغرق ٢٤-٧٢ ساعة</p>
                  </div>
                </button>
                <button type="button" onClick={() => setDeliveryOption('relay')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    deliveryOption === 'relay' ? 'border-rose bg-rose/5' : 'border-beige-dark'
                  }`}>
                  <MapPin className="w-5 h-5 text-rose" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">نقطة استلام</p>
                    <p className="text-xs text-gray-400">استلم من أقرب نقطة</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-beige mt-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">طريقة الدفع</h2>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-beige/50 rounded-xl">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">الدفع عند الاستلام</p>
                  <p className="text-xs text-gray-400">ادفع عند استلام الطلب</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-rose text-white w-full mt-6 py-3.5 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'جاري المعالجة...' : `تأكيد الطلب — ${finalTotal.toLocaleString('fr-DZ')} د.ج`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-beige sticky top-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-rose" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">ملخص الطلب</h2>
                <p className="text-xs text-gray-400">{items.length} قطع</p>
              </div>
            </div>
            <div className="space-y-3">
              {items.map(item => {
                const price = item.product.price + (item.selectedVariant?.price_modifier || 0);
                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id}`} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{(price * item.quantity).toLocaleString('fr-DZ')}</span>
                  </div>
                );
              })}
            </div>
            <hr className="my-4 border-beige" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع</span>
                <span className="font-medium">{total.toLocaleString('fr-DZ')} د.ج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">التوصيل</span>
                <span className={`font-medium ${total >= 5000 ? 'text-green-600' : ''}`}>
                  {total >= 5000 ? 'مجاني' : '٥٠٠ د.ج'}
                </span>
              </div>
            </div>
            <hr className="my-4 border-beige" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">الإجمالي</span>
              <span className="text-xl font-bold text-rose">{finalTotal.toLocaleString('fr-DZ')} د.ج</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
