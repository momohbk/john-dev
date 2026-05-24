import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3X3, SlidersHorizontal } from 'lucide-react';
import { getProducts } from '../api/products';
import { getCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';
import type { Product, Category } from '../types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(searchParams.get('slug') || '');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const slug = searchParams.get('slug') || '';
    setSelectedSlug(slug);
    getProducts(slug || undefined)
      .then(data => {
        let filtered = [...data];
        const search = searchParams.get('search');
        if (search) {
          const q = search.toLowerCase();
          filtered = data.filter(p => p.name.includes(q) || p.description.includes(q));
        }
        if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams, sortBy]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('slug', slug);
    else params.delete('slug');
    params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {searchParams.get('search') ? `بحث: "${searchParams.get('search')}"` : 'المنتجات'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'جاري التحميل...' : `${products.length} منتج`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedSlug}
              onChange={e => handleCategoryChange(e.target.value)}
              className="appearance-none bg-white border border-beige-dark rounded-xl pr-9 pl-8 py-2.5 text-sm font-medium text-gray-600 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all cursor-pointer"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-beige-dark rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all cursor-pointer"
          >
            <option value="default">ترتيب</option>
            <option value="price-asc">السعر: من الأقل</option>
            <option value="price-desc">السعر: من الأعلى</option>
            <option value="name">الاسم</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-beige overflow-hidden">
              <div className="aspect-square skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-full" />
                <div className="h-5 skeleton rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto bg-beige rounded-2xl flex items-center justify-center mb-4">
            <Grid3X3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">لا توجد منتجات</h3>
          <p className="text-gray-400 mt-1">حاول تعديل البحث أو التصفية.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
