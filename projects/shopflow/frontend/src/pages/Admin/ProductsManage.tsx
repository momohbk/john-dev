import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import type { Product, Category } from '../../types';

export default function ProductsManage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, image_url: '', category_id: 0 });

  const load = () => {
    setLoading(true);
    Promise.all([getAdminProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, stock: 0, image_url: '', category_id: 0 });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateProduct(editing.id, form); }
      else { await createProduct(form); }
      resetForm(); setShowForm(false); load();
    } catch (err) { alert(err instanceof Error ? err.message : 'فشل الحفظ'); }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name, description: product.description, price: product.price,
      stock: product.stock, image_url: product.image_url || '', category_id: product.category_id || 0,
    });
    setEditing(product); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try { await deleteProduct(id); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'فشل الحذف'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-12 text-gray-400">جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث عن منتج..."
            className="w-full border border-beige-dark rounded-xl pr-9 pl-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center justify-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all">
          <Plus className="w-4 h-4" /> إضافة منتج
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => { resetForm(); setShowForm(false); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'تعديل منتج' : 'إضافة منتج'}</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-1.5 hover:bg-beige rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر (د.ج)</label>
                  <input type="number" step="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} required
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} required
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: parseInt(e.target.value) }))}
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all">
                    <option value={0}>بدون</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                  <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all flex-1">
                  {editing ? 'تحديث' : 'إضافة'}
                </button>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-beige-dark text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:border-rose hover:text-rose transition-all flex-1">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">لا توجد منتجات</div>
      ) : (
        <div className="bg-white rounded-2xl border border-beige overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige bg-beige/50">
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs">المنتج</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs">السعر</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs">المخزون</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs">الحالة</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-beige/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-beige/50 rounded-xl overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-sm font-bold text-gold/40">{product.name[0]}</span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{product.price.toLocaleString('fr-DZ')} د.ج</td>
                    <td className="px-5 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-rose hover:bg-rose/5 rounded-lg transition-all ml-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
