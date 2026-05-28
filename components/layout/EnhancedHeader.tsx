'use client';

import { FC, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown, Heart, Menu, Search, ShoppingCart, Sprout, User, X,
  Phone, MessageCircle, Zap, Tag, ArrowRight, Bell, LogOut, Settings, Package
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore, useWishlistStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  cartCount?: number;
}

const megaMenus = [
  {
    label: 'Premium Seeds',
    href: '/products?category=seeds',
  },
  {
    label: 'Crop Protection',
    href: '/products?category=crop-protection',
  },
  {
    label: 'Fertilizers & Nutrition',
    href: '/products?category=fertilizers',
  },
  {
    label: 'Farm Equipment',
    href: '/products?category=implements',
  },
];

const EnhancedHeader: FC<HeaderProps> = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dbBanner, setDbBanner] = useState<{isActive: boolean, text: string, link: string} | null>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // New hooks
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  
  // Search Autocomplete State
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  
  // UI Dropdowns
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .eq('is_active', true)
        .limit(5);
      
      setSearchResults(data || []);
      setIsSearching(false);
    };

    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'header_banner').single()
      if (data?.setting_value) setDbBanner(data.setting_value)
    }
    fetchBanner()
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuEnter = (label: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };

  useEffect(() => () => { if (menuTimeout.current) clearTimeout(menuTimeout.current); }, []);

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      
      {/* Background Banner */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <Image src="/header-bg.png" alt="Header Background" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white/95" />
      </div>

      {/* Top Utility Bar - Replaced with Dynamic Banner if active */}
      {dbBanner?.isActive ? (
        <div className="bg-primary-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center shadow-md relative z-10 animate-pulse">
          {dbBanner.text}
          {dbBanner.link && (
            <Link href={dbBanner.link} className="ml-2 underline underline-offset-2 opacity-90 hover:opacity-100 font-bold">
              Click Here
            </Link>
          )}
        </div>
      ) : (
        <div className="hidden bg-emerald-900/90 backdrop-blur-sm px-4 py-2 text-[11px] font-medium text-emerald-50 md:block transition-colors">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="https://wa.me/917428208822" className="flex items-center gap-1.5 hover:text-white transition">
                <MessageCircle size={12} /> Order via WhatsApp
              </a>
              <a href="/b2b" className="flex items-center gap-1.5 hover:text-white transition">
                <Zap size={12} /> B2B Procurement
              </a>
              <span className="flex items-center gap-1.5 text-emerald-200">
                <Tag size={12} /> 100% Genuine Agriculture Products
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/crop-doctor" className="flex items-center gap-1.5 font-bold text-yellow-300 hover:text-yellow-100 transition tracking-wide">
                🤖 FREE AI CROP DIAGNOSIS
              </a>
              <a href="/orders" className="hover:text-white transition">Track Order</a>
              <a href="tel:+917428208822" className="flex items-center gap-1.5 hover:text-white transition font-bold">
                <Phone size={12} /> +91 74282 08822
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation - Glassmorphic */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4">
          
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center justify-center relative w-48 h-14 group cursor-pointer mr-4 overflow-hidden rounded-xl">
            <Image 
              src="/logo.png" 
              alt="IGO Crop Care Logo" 
              fill
              className="object-contain mix-blend-multiply scale-[2.5] transition-transform group-hover:scale-[2.6]"
              priority
            />
          </Link>

          {/* Search Bar - Modern, centered */}
          <form 
            ref={searchRef}
            onSubmit={handleSearchSubmit} 
            className="relative hidden flex-1 max-w-2xl mx-auto lg:flex group z-50"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search for seeds, fertilizers, or diseases..."
              className="w-full rounded-full border border-gray-200/80 bg-white/70 backdrop-blur-sm py-3 pl-12 pr-24 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-full bg-emerald-600 px-5 py-1.5 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-sm"
            >
              Search
            </button>

            {/* Search Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link 
                          href={`/products/${product.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-4 p-3 hover:bg-emerald-50 transition border-b border-gray-50 last:border-0"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            ) : (
                              <Sprout className="w-6 h-6 text-gray-400 m-auto mt-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{product.category.replace('_', ' ')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">₹{product.price}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button 
                        type="submit"
                        className="w-full p-3 text-center text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        View all results for &quot;{searchQuery}&quot;
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No products found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-emerald-600"
              >
                <Bell size={22} />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                  2
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    <Link href="/products?category=seeds" onClick={() => setShowNotifications(false)} className="block p-4 hover:bg-gray-50 transition cursor-pointer">
                      <p className="text-sm font-bold text-gray-900 mb-1">Mega Seed Sale!</p>
                      <p className="text-xs text-gray-600">Get up to 40% off on all premium hybrid seeds this week.</p>
                      <p className="text-[10px] text-gray-400 mt-2">2 hours ago</p>
                    </Link>
                    <Link href="/profile/orders" onClick={() => setShowNotifications(false)} className="block p-4 hover:bg-gray-50 transition cursor-pointer">
                      <p className="text-sm font-bold text-gray-900 mb-1">Order #8921 Shipped</p>
                      <p className="text-xs text-gray-600">Your fertilizers are on the way and will reach you tomorrow.</p>
                      <p className="text-[10px] text-gray-400 mt-2">1 day ago</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-red-500"
            >
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingCart size={20} />
              <span className="hidden text-sm font-bold sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {isLoggedIn && user ? (
              <div className="relative hidden lg:block ml-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-gray-200 pl-2 pr-4 py-1.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
                >
                  <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">
                    {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user.first_name || 'My Account'}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.phone}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition">
                        <User size={16} /> My Profile
                      </Link>
                      <Link href="/profile/orders" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition">
                        <Package size={16} /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-emerald-700 font-bold bg-emerald-50 rounded-lg transition mt-1">
                          <Settings size={16} /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button 
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          router.push('/');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:flex ml-2 items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-4 lg:hidden">
          <form action="/products" className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200/80 bg-white/70 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </form>
        </div>
      </nav>

      {/* Mega Menu Bar */}
      <div className="hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50 lg:block relative z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4">
          <div className="relative group">
            <Link href="/products" className="flex items-center gap-1.5 py-3.5 text-sm font-black uppercase tracking-wider text-gray-900 transition hover:text-emerald-600">
              <Menu size={16} /> All Categories
            </Link>
            <div className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              {megaMenus.map((menu) => (
                <Link key={menu.label} href={menu.href} className="block px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition border-b border-gray-50 last:border-0">
                  {menu.label}
                </Link>
              ))}
              <Link href="/products" className="block px-5 py-3.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition text-center bg-gray-50">
                View All Products →
              </Link>
            </div>
          </div>
          
          <div className="h-4 w-px bg-gray-200" />

          {megaMenus.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className="flex items-center py-3.5 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {menu.label}
            </Link>
          ))}

          <div className="h-4 w-px bg-gray-200 ml-auto" />
          
          <Link
            href="/products?sort=discount"
            className="flex items-center gap-1.5 py-3.5 text-sm font-black text-red-500 transition hover:text-red-600"
          >
            <Tag size={16} /> Hot Deals
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[85%] max-w-sm h-full overflow-y-auto bg-white shadow-2xl transition-transform transform translate-x-0">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gray-50">
              <Link href="/" className="flex items-center gap-2 text-xl font-black text-gray-900" onClick={() => setIsMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Sprout size={18} />
                </div>
                IGO<span className="text-emerald-600">CropCare</span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="rounded-full bg-white p-2 text-gray-500 shadow-sm hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <Link href="/crop-doctor" className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-200" onClick={() => setIsMenuOpen(false)}>
                🤖 AI Crop Doctor
              </Link>

              <div className="space-y-1">
                {megaMenus.map((menu) => (
                  <div key={menu.label} className="border-b border-gray-100 pb-2 mb-2">
                    <Link
                      href={menu.href}
                      className="block py-3 text-sm font-black text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {menu.label}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {isLoggedIn && user ? (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="font-bold text-gray-900">Hello, {user.first_name || 'User'}</p>
                      <p className="text-xs text-gray-500 mb-3">{user.phone}</p>
                      <Link href="/profile" className="block text-sm text-emerald-600 font-bold mb-2" onClick={() => setIsMenuOpen(false)}>My Profile & Orders</Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="block text-sm text-blue-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-xl border-2 border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600 hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block w-full rounded-xl border-2 border-gray-900 px-4 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default EnhancedHeader;
