import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, Star, ChevronLeft, Sparkles, Phone } from 'lucide-react';
import { getProducts } from '../api/products';
import { getBanners } from '../api/banners';
import { getProductReviews } from '../api/reviews';
import ProductCard from '../components/ProductCard';
import type { Product, Banner, Review } from '../types';

const staticReviews = [
  { name: 'فاطمة الزهراء', text: 'حقيبة رائعة جداً! الخامة ممتازة والتصميم أنيق. التوصيل كان سريع.', rating: 5 },
  { name: 'مريم عثمان', text: 'تجربة تسوق رائعة. الجودة ممتازة والسعر مناسب.', rating: 5 },
  { name: 'سارة أحمد', text: 'الحقيبة أجمل من الصور. أنصح الجميع بالشراء من هنا.', rating: 4 },
];

const categories = [
  { name: 'حقائب يد', slug: 'handbags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', count: 3 },
  { name: 'حقائب كتف', slug: 'shoulder-bags', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80', count: 2 },
  { name: 'حقائب كبيرة', slug: 'tote-bags', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80', count: 2 },
  { name: 'حقائب سهرة', slug: 'clutches', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80', count: 2 },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [heroBanner, setHeroBanner] = useState<Banner | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts(),
      getBanners().catch(() => [] as Banner[]),
      getProductReviews(1).catch(() => [] as Review[]),
    ])
      .then(([products, banners, productReviews]) => {
        setFeatured(products.slice(0, 4));
        if (banners.length > 0) setHeroBanner(banners[0]);
        setReviews(productReviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayReviews = reviews.length > 0
    ? reviews.slice(0, 3).map(r => ({ name: r.customer_name, text: r.text, rating: r.rating }))
    : staticReviews;

  return (
    <div dir="rtl">
      {/* Notice Bar */}
      <div className="bg-gradient-to-l from-rose/90 to-rose-dark text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          توصيل مجاني للطلبات فوق 5000 د.ج | الدفع عند الاستلام
        </span>
      </div>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-l from-rose/90 via-rose-dark/80 to-rose/90 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        {heroBanner?.image_url && (
          <div className="absolute inset-0">
            <img src={heroBanner.image_url} alt="" className="w-full h-full object-cover opacity-20" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm mb-6 border border-white/10">
              <Sparkles className="w-4 h-4" />
              {heroBanner?.title || 'أحدث مجموعة ربيع 2026'}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              حقائب فاخرة
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-300">
                {heroBanner?.subtitle || 'لإطلالتك المثالية'}
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed max-w-lg">
              اكتشفي مجموعتنا المختارة من أفخم الحقائب المصممة بعناية لتناسب كل الأذواق والمناسبات.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={heroBanner?.link_url || '/products'} className="inline-flex items-center gap-2 bg-white text-rose px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-xl shadow-black/20 active:scale-95">
                تسوق الآن
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-all">
                اكتشفي المجموعة
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-white/40 text-xs sm:text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> توصيل مجاني</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> دفع آمن</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> إرجاع مجاني</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Overlay Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">اكتشفي تصنيفات منتجاتنا</h2>
          <p className="text-gray-400 text-sm mt-1">تسوقي حسب فئتك المفضلة</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.slug} to={`/products?slug=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-[4/5] sm:aspect-square">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                <h3 className="text-white font-bold text-base sm:text-lg">{cat.name}</h3>
                <p className="text-white/60 text-xs mt-0.5">{cat.count} منتجات</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">منتجاتنا 💜</h2>
            <p className="text-gray-400 text-sm mt-1">اكتشف أفضل المنتجات بأفضل الأسعار</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-rose font-medium text-sm hover:text-rose-dark transition-colors">
            عرض الكل <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-beige overflow-hidden shadow-sm">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-full" />
                  <div className="h-5 skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 border-2 border-beige-dark text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:border-rose hover:text-rose transition-all">
            عرض جميع المنتجات <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-l from-rose/5 to-beige border-y border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-rose">10+</p>
              <p className="text-sm text-gray-500 mt-1">منتجات</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose">50+</p>
              <p className="text-sm text-gray-500 mt-1">طلبات منجزة</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose">100+</p>
              <p className="text-sm text-gray-500 mt-1">زبائن سعداء</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-rose">24-72</p>
              <p className="text-sm text-gray-500 mt-1">ساعة توصيل</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">آراء الزبائن 💜</h2>
          <p className="text-gray-400 text-sm mt-1">ماذا يقول زبائننا عنا</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {displayReviews.map((review, i) => (
            <div key={i} className="bg-white rounded-2xl border border-beige p-6 shadow-sm hover:shadow-md transition-all animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">"{review.text}"</p>
              <p className="mt-4 font-semibold text-gray-900 text-sm">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-l from-rose/90 to-rose-dark/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">مستعدة للتسوق؟</h2>
          <p className="mt-2 text-white/60">انضمي إلى آلاف الزبائن الراضين.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-rose px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all mt-6 shadow-xl shadow-black/20 active:scale-95">
            تسوقي الآن <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-beige py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-rose to-rose-dark rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
                <span className="text-base font-bold text-gray-900">Bag<span className="text-rose">Style</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">متجرك الموثوق لشراء أفخم الحقائب النسائية بأفضل الأسعار.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">روابط سريعة</h3>
              <div className="space-y-2 text-sm">
                <Link to="/products" className="block text-gray-500 hover:text-rose transition-colors">المنتجات</Link>
                <Link to="/tracking" className="block text-gray-500 hover:text-rose transition-colors">تتبع الطلب</Link>
                <Link to="/cart" className="block text-gray-500 hover:text-rose transition-colors">عربة التسوق</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">اتصل بنا</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p>الهاتف: 0550 12 34 56</p>
                <p>البريد: contact@bagstyle.dz</p>
                <p>مدة التوصيل: ٢٤ - ٧٢ ساعة</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">تابعينا</h3>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <a href="https://facebook.com/bagstyledz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-rose/5 text-rose rounded-xl flex items-center justify-center hover:bg-rose hover:text-white transition-all text-xs font-bold">F</a>
                <a href="https://instagram.com/bagstyledz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-rose/5 text-rose rounded-xl flex items-center justify-center hover:bg-rose hover:text-white transition-all text-xs font-bold">I</a>
                <a href="https://tiktok.com/@bagstyledz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-rose/5 text-rose rounded-xl flex items-center justify-center hover:bg-rose hover:text-white transition-all text-xs font-bold">T</a>
              </div>
              <div className="mt-4">
                <a href="https://wa.me/213550123456" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-all shadow-md">
                  <Phone className="w-4 h-4" />
                  واتساب
                </a>
              </div>
            </div>
          </div>
          <hr className="my-6 sm:my-8 border-beige" />
          <p className="text-center text-xs text-gray-400">© 2026 BagStyle DZ. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
