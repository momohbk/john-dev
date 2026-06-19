import { useState, useEffect } from 'react';
import { Check, Trash2, Star } from 'lucide-react';
import { getAllReviews, approveReview, deleteReview } from '../../api/reviews';
import type { Review } from '../../types';

export default function ReviewsManage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const load = () => {
    setLoading(true);
    getAllReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    try { await approveReview(id); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'فشل الموافقة'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try { await deleteReview(id); load(); }
    catch (err) { alert(err instanceof Error ? err.message : 'فشل الحذف'); }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  if (loading) return <div className="text-center py-12 text-gray-400">جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">التقييمات ({reviews.length})</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === f ? 'bg-rose text-white' : 'bg-beige text-gray-600 hover:bg-beige-dark'
              }`}>
              {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد المراجعة' : 'مقبول'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">لا توجد تقييمات</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <div key={review.id} className="bg-white p-5 rounded-2xl border border-beige animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{review.customer_name}</span>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('fr-DZ')}</span>
                    {review.product_name && (
                      <span className="text-xs text-rose bg-rose/5 px-2 py-0.5 rounded-lg">{review.product_name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  {!review.is_approved && (
                    <button onClick={() => handleApprove(review.id)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all" title="موافقة">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
