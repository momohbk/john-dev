import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Star, Settings, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'الإحصائيات', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
  { to: '/admin/reviews', label: 'التقييمات', icon: Star },
  { to: '/admin/banners', label: 'البانرات', icon: Image },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-rose" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-sm text-gray-400">إدارة المتجر</p>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <nav className="lg:w-48 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-rose text-white shadow-sm shadow-rose/20' : 'text-gray-600 hover:bg-beige'
                  }`
                }>
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
