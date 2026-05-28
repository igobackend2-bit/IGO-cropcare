'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  LogOut, Megaphone, BarChart3, Menu, X, Sprout
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/leads', label: 'Leads (CRM)', icon: Users }, // Using Users icon or similar
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/banners', label: 'Banners', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              active
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-30">
        <div className="p-6 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-none">IGO CropCare</h2>
              <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
        </div>
        <SidebarNav />
        <div className="p-4 border-t border-slate-100">
          <Link href="/" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-medium transition text-sm">
            <LogOut className="w-4 h-4" /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-slate-900">IGO CropCare Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <SidebarNav onClose={() => setMobileOpen(false)} />
            <div className="p-4 border-t border-slate-100">
              <Link href="/" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 font-medium transition text-sm">
                <LogOut className="w-4 h-4" /> Back to Website
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 md:px-8 sticky top-0 z-20">
          <button className="md:hidden mr-3" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-sm font-semibold text-slate-500">IGO CropCare Admin</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-xs">A</span>
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">Admin</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
