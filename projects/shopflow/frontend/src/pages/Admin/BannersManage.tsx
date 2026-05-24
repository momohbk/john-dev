import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../api/banners';
import type { Banner } from '../../types';

export default function BannersManage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link_url: '', sort_order: 1 });

  const load = () => {
    setLoading(true);
    getAllBanners()
      .then(setBanners)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ title: '', subtitle: '', image_url: '', link_url: '', sort_order: 1 });
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateBanner(editing.id, form); }
      else { await createBanner(form); }
      resetForm(); setShowForm(false); load();
    } catch (err) { alert(err instanceof Error ? err.message : 'فشل الحفظ'); }
  };

  const handleEdit = (banner: Banner) => {
    setForm({ title: banner.title || '', subtitle: banner.subtitle || '', image_url: banner.image_url, link_url: banner.link_url || '', sort_order: banner.sort_order });
    setEditing(banner); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا البانر؟')) return;
    try { await deleteBanner(id); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'فشل الحذف'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">إدارة البانرات ({banners.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center justify-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all">
          <Plus className="w-4 h-4" /> إضافة بانر
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => { resetForm(); setShowForm(false); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'تعديل بانر' : 'إضافة بانر'}</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="p-1.5 hover:bg-beige rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النص الفرعي</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة *</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} required
                  className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الوجهة</label>
                <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                  className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all" />
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

      {banners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">لا توجد بانرات</div>
      ) : (
        <div className="grid gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-white p-4 rounded-2xl border border-beige flex items-center gap-4">
              <div className="w-24 h-16 bg-beige/50 rounded-xl overflow-hidden flex-shrink-0">
                <img src={banner.image_url} alt={banner.title || ''} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{banner.title || '(بدون عنوان)'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{banner.subtitle}</p>
                {banner.link_url && <p className="text-xs text-rose mt-1">{banner.link_url}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(banner)} className="p-2 text-gray-400 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                  تعديل
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
