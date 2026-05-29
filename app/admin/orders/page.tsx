'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Eye, Calendar, User as UserIcon, RefreshCw } from 'lucide-react'
import { Order } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)

    // localStorage orders as fallback base
    const localOrdersRaw = typeof window !== 'undefined' ? localStorage.getItem('cc_orders') : null
    const localOrders: Order[] = localOrdersRaw ? JSON.parse(localOrdersRaw) : []

    try {
      // Use admin API route (service role — bypasses RLS)
      const res = await fetch('/api/admin/orders')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const dbOrders: Order[] = await res.json()

      // Merge: DB orders take priority, local-only orders fill the gap
      const dbIds = new Set(dbOrders.map((o: Order) => o.id))
      const localOnly = localOrders.filter(o => !dbIds.has(o.id))
      const merged = [...dbOrders, ...localOnly].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setOrders(merged)
    } catch (err) {
      console.error('Failed to load orders from API, using localStorage:', err)
      const sorted = [...localOrders].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setOrders(sorted)
      if (sorted.length > 0) toast.error('Loaded orders from local cache')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(true)
    try {
      // Update via admin API route (service role — bypasses RLS)
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed')
      }
      // Also update localStorage cache
      const localRaw = typeof window !== 'undefined' ? localStorage.getItem('cc_orders') : null
      if (localRaw) {
        const localOrders: Order[] = JSON.parse(localRaw)
        const updated = localOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        localStorage.setItem('cc_orders', JSON.stringify(updated))
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev)
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-green-600" /> Order Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all customer orders. Total: <strong>{orders.length}</strong></p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-xs text-slate-500">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ₹{order.total_amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-xs text-slate-500 font-mono mt-1">ID: {selectedOrder.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-slate-500">{selectedOrder.customer_email}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date Placed</span>
                  <span className="font-medium text-sm">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.customer_phone && selectedOrder.customer_phone !== 'N/A' && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-500">Phone</span>
                    <a href={`tel:${selectedOrder.customer_phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                )}
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-700 mb-2">Items Ordered ({selectedOrder.items.length})</p>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={item.id ?? idx} className="flex justify-between text-xs text-slate-600">
                          <span className="truncate flex-1">{item.product?.name ?? `Product #${item.product_id?.slice(0,6)}`} × {item.quantity}</span>
                          <span className="ml-2 font-semibold shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-lg text-green-600">₹{selectedOrder.total_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                  <button
                    key={s}
                    disabled={updatingStatus || selectedOrder.status === s}
                    onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition border ${
                      selectedOrder.status === s
                        ? `${getStatusColor(s)} cursor-default opacity-80`
                        : 'border-slate-200 bg-white hover:border-slate-400 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
