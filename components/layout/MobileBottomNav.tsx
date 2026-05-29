'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: LayoutGrid },
  { label: 'AI Doctor', href: '/crop-doctor', icon: Bot, highlight: true },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Account', href: '/login', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-1 pb-safe">
        {NAV_ITEMS.map(({ label, href, icon: Icon, highlight }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          if (highlight) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-200 text-white">
                  <Icon size={24} />
                </span>
                <span className="mt-1 text-[10px] font-bold text-emerald-600">{label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
