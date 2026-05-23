import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-up" dir="rtl">
        <div className="w-20 h-20 mx-auto bg-beige rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">سلتك فارغة</h2>
        <p className="mt-2 text-gray-400">لم تقم بإضافة أي منتج بعد.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all mt-6">
          <ChevronLeft className="w-4 h-4" />
          متابعة التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">سلة التسوق</h1>
        <span className="text-sm text-gray-500">{items.reduce((s, i) => s + i.quantity, 0)} قطع</span>
      </div>

      <div className="space-y-4">
        {items.map(item => {
          const price = item.product.price + (item.selectedVariant?.price_modifier || 0);
          return (
            <div key={`${item.product.id}-${item.selectedVariant?.id}`} className="bg-white p-4 sm:p-5 rounded-2xl border border-beige card-hover">
              <div className="flex items-center gap-4">
                <Link to={`/products/${item.product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-beige/30 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gold/40">{item.product.name[0]}</span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product.id}`} className="font-semibold text-gray-900 hover:text-rose transition-colors block truncate">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {price.toLocaleString('fr-DZ')} د.ج
                    {item.selectedVariant && <span className="mr-2">- {item.selectedVariant.name}</span>}
                  </p>
                </div>
                <div className="flex items-center border border-beige-dark rounded-xl">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)} className="p-2 hover:bg-beige/50 text-gray-500 hover:text-rose transition-colors rounded-r-xl">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-semibold text-gray-900 min-w-[2.5rem] text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)} className="p-2 hover:bg-beige/50 text-gray-500 hover:text-rose transition-colors rounded-l-xl">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-left min-w-[80px]">
                  <p className="font-bold text-gray-900">{(price * item.quantity).toLocaleString('fr-DZ')}</p>
                  <p className="text-[10px] text-gray-400">د.ج</p>
                </div>
                <button onClick={() => removeItem(item.product.id, item.selectedVariant?.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl border border-beige">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">المجموع</span>
            <span className="font-medium text-gray-900">{total.toLocaleString('fr-DZ')} د.ج</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">التوصيل</span>
            <span className="font-medium text-green-600">{total >= 5000 ? 'مجاني' : '٥٠٠ د.ج'}</span>
          </div>
          <hr className="my-3 border-beige" />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-lg">الإجمالي</span>
            <span className="font-bold text-rose text-xl">{(total + (total >= 5000 ? 0 : 500)).toLocaleString('fr-DZ')} د.ج</span>
          </div>
        </div>
        <Link to="/checkout" className="inline-flex items-center justify-center gap-2 bg-rose text-white w-full mt-6 py-3.5 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all">
          إتمام الطلب
        </Link>
      </div>
    </div>
  );
}
