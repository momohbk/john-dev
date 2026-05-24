import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getSettings, updateSettings } from '../../api/settings';
import type { Settings } from '../../types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateSettings(settings);
      setMessage('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      setMessage('فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">جاري التحميل...</div>;

  const fields: { key: string; label: string; type?: string }[] = [
    { key: 'store_name', label: 'اسم المتجر' },
    { key: 'contact_email', label: 'البريد الإلكتروني' },
    { key: 'contact_phone', label: 'رقم الهاتف' },
    { key: 'delivery_fee', label: 'رسوم التوصيل (د.ج)' },
    { key: 'free_delivery_threshold', label: 'الحد الأدنى للتوصيل المجاني (د.ج)' },
    { key: 'delivery_time_message', label: 'رسالة مدة التوصيل' },
    { key: 'facebook_url', label: 'رابط فيسبوك' },
    { key: 'instagram_url', label: 'رابط انستغرام' },
    { key: 'tiktok_url', label: 'رابط تيك توك' },
    { key: 'store_logo', label: 'رابط الشعار' },
  ];

  return (
    <div dir="rtl">
      <h2 className="text-lg font-bold text-gray-900 mb-6">إعدادات المتجر</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-beige space-y-4 max-w-2xl">
        {message && (
          <div className={`p-3 rounded-xl text-sm ${message.includes('نجاح') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={settings[field.key] || ''}
                onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                className="w-full border border-beige-dark rounded-xl px-4 py-3 text-sm outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-rose-dark transition-all disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>

      <div className="mt-8 bg-white p-6 rounded-2xl border border-beige max-w-2xl">
        <h3 className="font-semibold text-gray-900 mb-4">بيكسلات التسويق</h3>
        <p className="text-sm text-gray-400 mb-4">قم بإدارة بيكسلات التتبع للتسويق (يمكنك تعديلها مباشرة في قاعدة البيانات)</p>
        <div className="space-y-3">
          {[
            { platform: 'facebook', label: 'Facebook Pixel ID', default: 'YOUR_FB_PIXEL_ID' },
            { platform: 'tiktok', label: 'TikTok Pixel ID', default: 'YOUR_TIKTOK_PIXEL_ID' },
            { platform: 'google_analytics', label: 'Google Analytics ID', default: 'G-XXXXXXXXXX' },
            { platform: 'google_tag_manager', label: 'Google Tag Manager ID', default: 'GTM-XXXXXXX' },
          ].map(p => (
            <div key={p.platform} className="flex items-center justify-between p-3 bg-beige/50 rounded-xl">
              <span className="text-sm text-gray-600">{p.label}</span>
              <span className="text-xs text-gray-400 font-mono">{p.default}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
