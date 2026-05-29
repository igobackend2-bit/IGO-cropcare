'use client'

import { useAuthStore } from '@/lib/store'
import { Order } from '@/lib/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ClipboardList, LogOut, ShoppingBag, Calendar } from 'lucide-react'

export default function MyOrdersPage() {
  const { user, isLoggedIn, logout } = useAuthStore()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      setLoading(true)
      try {
        // Try service-role API route first
        const res = await fetch(`/api/orders/user/${user.id}`)
        if (res.ok) {
          const apiOrders = await res.json()
          if (Array.isArray(apiOrders) && apiOrders.length > 0) {
            setOrders(apiOrders)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.error('API order fetch error:', err)
      }
      // Fallback: read localStorage directly
      try {
        const raw = localStorage.getItem('cc_orders')
        const all: Order[] = raw ? JSON.parse(raw) : []
        setOrders(all.filter(o => o.user_id === user.id))
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.first_name || 'Farmer'} {user?.last_name || 'User'}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profile
                </Link>
                <Link
                  href="/profile/orders"
                  className="block px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold"
                >
                  My Orders
                </Link>
                <Link href="/profile/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Wishlist
                </Link>
                <Link href="/profile/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-green-600" /> Order History
              </h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin text-green-600 text-4xl">⏳</div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      {/* Order Header info */}
                      <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-6 flex-wrap">
                          <div>
                            <span className="block text-xs text-gray-400 font-semibold uppercase">Order Date</span>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(order.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 font-semibold uppercase">Total Amount</span>
                            <span className="text-sm font-bold text-green-600 flex items-center mt-0.5">
                              ₹{order.total_amount.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-gray-400 font-semibold uppercase">Order ID</span>
                            <span className="text-sm font-mono text-gray-600 mt-0.5">
                              #{order.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 border text-xs font-bold rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="divide-y divide-gray-100">
                        {order.items?.map((item) => (
                          <div key={item.id} className="p-6 flex gap-4 items-center">
                            <div className="w-16 h-16 bg-gray-100 border rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.product?.image_url || 'https://images.unsplash.com/photo-1590789033100-9f60a05a613d?w=100&h=100&fit=crop'}
                                alt={item.product?.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <Link href={`/products/${item.product_id}`} className="font-semibold text-gray-900 hover:text-green-600 transition">
                                {item.product?.name || 'Premium Agricultural Product'}
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Brand: {item.product?.brand || 'Premium Brands'}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-600">
                                  Qty: <strong>{item.quantity}</strong>
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                  ₹{item.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-lg">No orders placed yet</p>
                  <p className="text-gray-400 text-sm mt-1 mb-6">Boost your farm yield today with our quality products.</p>
                  <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition inline-block">
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
