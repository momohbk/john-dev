import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Phone, ChevronLeft } from 'lucide-react';

export default function ThankYou() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId || isNaN(Number(orderId))) navigate('/');
  }, [orderId, navigate]);

  if (!orderId || isNaN(Number(orderId))) return null;

  return (
    <div dir="rtl" className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          شكرًا لك على الطلب!
        </h1>
        <p className="text-gray-500 mb-2">سيتم التواصل معك قريباً لتأكيد الطلب</p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800 leading-relaxed">
          يجب أن تعلم أنك إذا قمت بالطلب وبعد إرساله إليك ولم تستلمه ستسبب خسائر لنا، قبل الطلب تذكر قوله تعالى: «وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا»
        </div>

        <div className="bg-white border border-beige rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
            <Package className="w-5 h-5" />
            <span className="text-sm">رقم الطلب</span>
          </div>
          <p className="text-3xl font-bold text-rose">#{orderId}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to={`/tracking`}
            className="inline-flex items-center justify-center gap-2 bg-rose text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-dark transition-all shadow-lg shadow-rose/20 active:scale-95">
            <Package className="w-4 h-4" />
            تتبع طلبي
          </Link>
          <Link to="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-beige-dark text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-rose hover:text-rose transition-all">
            <ChevronLeft className="w-4 h-4" />
            متابعة التسوق
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Phone className="w-4 h-4" />
          <span>للاستفسار: 0550 12 34 56</span>
        </div>
      </div>
    </div>
  );
}
