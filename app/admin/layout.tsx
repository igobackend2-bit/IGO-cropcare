import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard | CropCare',
  description: 'Manage products, orders, and users.',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-500">CropCare Admin</h2>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors">
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6 sticky top-0 z-10 md:hidden">
            <h2 className="text-xl font-bold text-primary-600">CropCare Admin</h2>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
