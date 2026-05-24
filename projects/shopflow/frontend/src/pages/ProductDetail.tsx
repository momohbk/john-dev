import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Truck, ShieldCheck, RefreshCw, Star, ChevronLeft } from 'lucide-react';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import type { Product, ProductVariant } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductVariant | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      setLoading(true);
      window.scrollTo(0, 0);
      getProduct(Number(id))
        .then(p => {
          setProduct(p);
          const sizes = p.variants?.filter(v => v.type === 'size') || [];
          const colors = p.variants?.filter(v => v.type === 'color') || [];
          if (sizes.length > 0) setSelectedSize(sizes[0]);
          if (colors.length > 0) setSelectedColor(colors[0]);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAdd = () => {
    if (product) {
      addItem(product, quantity, selectedSize || selectedColor || undefined);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const currentPrice = product
    ? product.price + (selectedSize?.price_modifier || 0) + (selectedColor?.price_modifier || 0)
    : 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton rounded w-3/4" />
            <div className="h-4 skeleton rounded w-1/4" />
            <div className="h-4 skeleton rounded w-full" />
            <div className="h-4 skeleton rounded w-2/3" />
            <div className="h-12 skeleton rounded w-1/2 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-900">المنتج غير موجود</h2>
        <Link to="/products" className="inline-flex items-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all mt-4">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const sizes = product.variants?.filter(v => v.type === 'size') || [];
  const colors = product.variants?.filter(v => v.type === 'color') || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        العودة للمنتجات
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative">
          <div className="aspect-square bg-beige/30 rounded-2xl overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl font-bold text-gold/30">{product.name[0]}</span>
              </div>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
              {product.stock} فقط متبقي
            </span>
          )}
        </div>

        <div className="animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            {product.category_id && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose/10 text-rose">
                {product.category_name || 'تصنيف'}
              </span>
            )}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'متوفر' : 'غير متوفر'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>

          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-sm text-gray-500 mr-2">(٢٤ تقييم)</span>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Variants */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">المقاس:</p>
              <div className="flex gap-2">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedSize?.id === s.id
                        ? 'border-rose bg-rose/5 text-rose'
                        : 'border-beige-dark text-gray-600 hover:border-rose'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">اللون:</p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedColor?.id === c.id
                        ? 'border-rose bg-rose/5 text-rose'
                        : 'border-beige-dark text-gray-600 hover:border-rose'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 p-5 bg-gradient-to-l from-rose/5 to-beige rounded-2xl border border-beige">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose">{currentPrice.toLocaleString('fr-DZ')}</span>
              <span className="text-sm text-gray-500">د.ج</span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border border-beige-dark rounded-xl">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-beige/50 text-gray-500 hover:text-rose transition-colors rounded-r-xl">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-3 hover:bg-beige/50 text-gray-500 hover:text-rose transition-colors rounded-l-xl">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                    added ? 'bg-green-500 text-white' : 'bg-rose text-white hover:bg-rose-dark'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? 'تمت الإضافة!' : 'أضف إلى السلة'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-beige/50 rounded-xl">
              <Truck className="w-5 h-5 text-rose" />
              <div>
                <p className="text-xs font-semibold text-gray-900">توصيل مجاني</p>
                <p className="text-[10px] text-gray-500">للطلبات فوق ٥٠٠٠ د.ج</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-beige/50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-rose" />
              <div>
                <p className="text-xs font-semibold text-gray-900">دفع آمن</p>
                <p className="text-[10px] text-gray-500">مشفر بالكامل</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-beige/50 rounded-xl">
              <RefreshCw className="w-5 h-5 text-rose" />
              <div>
                <p className="text-xs font-semibold text-gray-900">إرجاع سهل</p>
                <p className="text-[10px] text-gray-500">خلال 14 يوم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
