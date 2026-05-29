'use client'

import { useAuthStore, useWishlistStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User, MapPin, Phone, Mail, LogOut, ShoppingBag,
  Heart, MessageSquare, Settings, Edit2, ChevronRight,
  Package, Star, Bell, BadgeCheck, Sprout
} from 'lucide-react'

interface OrderSummary {
  total: number
  pending: number
  delivered: number
}

// ── Shared sidebar used across all profile pages ──────────────
export function ProfileSidebar({ active }: { active: string }) {
  const { user, logout } = useAuthStore()
  const { items: wishlistIds } = useWishlistStore()
  const router = useRouter()

  const handleLogout = () => { logout(); router.push('/') }

  const initials = user
    ? `${(user.first_name || 'F')[0]}${(user.last_name || 'U')[0]}`.toUpperCase()
    : 'FU'

  const navItems = [
    { href: '/profile',          label: 'My Profile',      icon: <User className="w-4 h-4" />,           key: 'profile' },
    { href: '/profile/orders',   label: 'My Orders',       icon: <ShoppingBag className="w-4 h-4" />,    key: 'orders' },
    { href: '/profile/wishlist', label: 'Wishlist',        icon: <Heart className="w-4 h-4" />,           key: 'wishlist',
      badge: wishlistIds.length > 0 ? wishlistIds.length : null },
    { href: '/profile/inbox',    label: 'Support Inbox',   icon: <MessageSquare className="w-4 h-4" />,  key: 'inbox' },
    { href: '/profile/settings', label: 'Settings',        icon: <Settings className="w-4 h-4" />,        key: 'settings' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* User card */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0 border border-white/30">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-lg leading-tight truncate">
              {user?.first_name || 'Farmer'} {user?.last_name || ''}
            </h2>
            <p className="text-emerald-100 text-xs truncate mt-0.5">{user?.email || user?.phone || 'No email'}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span className="text-xs text-emerald-200 font-semibold">Verified Farmer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-0.5">
        {navItems.map(item => (
          <Link key={item.key} href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              active === item.key
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}>
            <span className={active === item.key ? 'text-green-600' : 'text-gray-400'}>{item.icon}</span>
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            {active === item.key && <ChevronRight className="w-4 h-4 ml-auto text-green-400" />}
          </Link>
        ))}
        <div className="pt-1 border-t border-gray-100 mt-1">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>
    </div>
  )
}

// ── Main Profile Page ─────────────────────────────────────────
export default function ProfilePage() {
  const { user, isLoggedIn } = useAuthStore()
  const { items: wishlistIds } = useWishlistStore()
  const router = useRouter()

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({ total: 0, pending: 0, delivered: 0 })
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (!user) return

    const fetchStats = async () => {
      setLoadingOrders(true)
      try {
        const res = await fetch(`/api/orders/user/${user.id}`)
        if (res.ok) {
          const orders = await res.json()
          setOrderSummary({
            total: orders.length,
            pending: orders.filter((o: { status: string }) => ['pending','confirmed','packed','shipped'].includes(o.status)).length,
            delivered: orders.filter((o: { status: string }) => o.status === 'delivered').length,
          })
        }
      } catch {
        // fallback: read from localStorage
        try {
          const raw = localStorage.getItem('cc_orders')
          const orders = raw ? JSON.parse(raw).filter((o: { user_id: string }) => o.user_id === user.id) : []
          setOrderSummary({
            total: orders.length,
            pending: orders.filter((o: { status: string }) => ['pending','confirmed','packed','shipped'].includes(o.status)).length,
            delivered: orders.filter((o: { status: string }) => o.status === 'delivered').length,
          })
        } catch { /* noop */ }
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchStats()
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || !user) return null

  const STATS = [
    { label: 'Total Orders', value: loadingOrders ? '…' : orderSummary.total, icon: <Package className="w-5 h-5 text-green-600" />, color: 'bg-green-50 border-green-100', href: '/profile/orders' },
    { label: 'Active Orders', value: loadingOrders ? '…' : orderSummary.pending, icon: <ShoppingBag className="w-5 h-5 text-blue-600" />, color: 'bg-blue-50 border-blue-100', href: '/profile/orders' },
    { label: 'Wishlist Items', value: wishlistIds.length, icon: <Heart className="w-5 h-5 text-red-500" />, color: 'bg-red-50 border-red-100', href: '/profile/wishlist' },
    { label: 'Delivered', value: loadingOrders ? '…' : orderSummary.delivered, icon: <Star className="w-5 h-5 text-amber-500" />, color: 'bg-amber-50 border-amber-100', href: '/profile/orders' },
  ]

  const hasAddress = !!(user.address && user.city && user.state)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Sprout className="w-6 h-6 text-emerald-200" />
            <div>
              <h1 className="text-2xl font-extrabold">My Account</h1>
              <p className="text-emerald-200 text-sm">Manage your orders, address and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar active="profile" />
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-5">

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(stat => (
                <Link key={stat.label} href={stat.href}
                  className={`border rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition cursor-pointer ${stat.color}`}>
                  {stat.icon}
                  <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
                </Link>
              ))}
            </div>

            {/* Personal Info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" /> Personal Information
                </h2>
                <Link href="/profile/edit"
                  className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-bold transition">
                  <Edit2 className="w-4 h-4" /> Edit
                </Link>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
                    <p className="font-bold text-gray-900 text-base">
                      {user.first_name || '—'} {user.last_name || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Account Type</p>
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-green-600" />
                      <p className="font-bold text-green-700 text-sm">Verified Farmer Account</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email</p>
                      <p className="text-gray-900 font-semibold text-sm">{user.email || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Phone</p>
                      <p className="text-gray-900 font-semibold text-sm">{user.phone || <span className="text-gray-400 italic">Not set</span>}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery address card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
                </h2>
                <Link href="/profile/edit"
                  className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-bold transition">
                  <Edit2 className="w-4 h-4" /> {hasAddress ? 'Edit' : 'Add'}
                </Link>
              </div>
              <div className="p-6">
                {hasAddress ? (
                  <div className="flex items-start gap-4 bg-green-50 border border-green-100 rounded-xl p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{user.address}</p>
                      <p className="text-gray-500 text-sm">{user.city}, {user.state} – {user.pincode}</p>
                      {user.phone && <p className="text-gray-400 text-xs mt-1">📞 {user.phone}</p>}
                    </div>
                  </div>
                ) : (
                  <Link href="/profile/edit"
                    className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-green-300 hover:bg-green-50 transition group">
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 transition">
                      <MapPin className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 group-hover:text-green-700 transition">Add Delivery Address</p>
                      <p className="text-gray-400 text-sm">Required for placing orders</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-green-500 transition" />
                  </Link>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/profile/orders', icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, label: 'Track Orders', desc: 'View order status & history', bg: 'bg-blue-50 border-blue-100' },
                { href: '/crop-doctor', icon: <span className="text-2xl">🤖</span>, label: 'AI Crop Doctor', desc: 'Diagnose crop disease free', bg: 'bg-purple-50 border-purple-100' },
                { href: '/profile/inbox', icon: <Bell className="w-6 h-6 text-amber-600" />, label: 'Support Inbox', desc: 'View messages & replies', bg: 'bg-amber-50 border-amber-100' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className={`border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer group ${item.bg}`}>
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-auto transition" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
