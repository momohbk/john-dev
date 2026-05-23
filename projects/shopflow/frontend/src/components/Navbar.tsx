import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Shield, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-l from-rose to-rose-dark sticky top-0 z-50 shadow-lg shadow-rose/20" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all lg:hidden"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border border-white/10">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-lg font-bold text-white">
                Bag<span className="text-amber-300">Style</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                الرئيسية
              </Link>
              <Link to="/products" className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                المنتجات
              </Link>
              <Link to="/tracking" className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                تتبع الطلب
              </Link>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-auto">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="w-full pr-9 pl-4 py-2 bg-white/20 backdrop-blur-sm border-0 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <Link to="/products" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all lg:hidden">
                <Search className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-rose-dark text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center shadow-lg">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Desktop user actions */}
              {user ? (
                <div className="hidden lg:flex items-center gap-1">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="لوحة التحكم">
                      <Shield className="w-5 h-5" />
                    </Link>
                  )}
                  <Link to="/orders" className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="طلباتي">
                    <User className="w-5 h-5" />
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="تسجيل خروج">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden lg:inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm font-medium border border-white/10">
                  <User className="w-4 h-4" />
                  دخول
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl animate-slide-in-right lg:hidden" dir="rtl">
            <div className="p-4 border-b border-beige flex items-center justify-between">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-rose to-rose-dark rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
                <span className="text-base font-bold text-gray-900">Bag<span className="text-rose">Style</span></span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-beige rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {/* Mobile search */}
              <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(''); setMobileOpen(false); } }} className="mb-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full pr-9 pl-4 py-2.5 bg-beige/50 border border-beige-dark rounded-xl text-sm focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all"
                  />
                </div>
              </form>

              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                الرئيسية
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                المنتجات
              </Link>
              <Link to="/tracking" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                تتبع الطلب
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                عربة التسوق {itemCount > 0 && `(${itemCount})`}
              </Link>
              <hr className="my-2 border-beige" />
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                    طلباتي
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose hover:bg-rose/5 rounded-xl transition-all">
                      لوحة التحكم
                    </Link>
                  )}
                  <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }} className="w-full text-right px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    تسجيل خروج
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-rose hover:bg-rose/5 rounded-xl transition-all">
                  دخول
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
