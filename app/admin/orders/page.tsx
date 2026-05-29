'use client'

import { useEffect, useState } from 'react'
import { Filter, Clock, FileText, User as UserIcon, MapPin, ExternalLink, RefreshCw, X, ShoppingBag } from 'lucide-react'
import { Order } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const STATUS_OPTIONS = [
    'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'rejected'
  ]

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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated = localOrders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o)
        localStorage.setItem('cc_orders', JSON.stringify(updated))
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : prev)
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders()
  }, [])

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'confirmed') return 'bg-cyan-100 text-cyan-700'
    if (s === 'pending') return 'bg-slate-200 text-slate-600'
    if (s === 'shipped' || s === 'delivered') return 'bg-blue-100 text-blue-700'
    if (s === 'cancelled' || s === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search Order ID, Customer, Address..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-semibold hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" /> All Status
          </button>
          <button onClick={fetchOrders} className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition">
            <Clock className="w-4 h-4" />
          </button>
          <button className="bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-green-800 transition flex items-center gap-2">
            <FileText className="w-4 h-4" /> HARVEST SUMMARY
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">ORDER</th>
                <th className="px-6 py-5">CUSTOMER</th>
                <th className="px-6 py-5">AMOUNT</th>
                <th className="px-6 py-5">STATUS</th>
                <th className="px-6 py-5">PLACED AT</th>
                <th className="px-6 py-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => {
                  const d = new Date(order.created_at)
                  const dateStr = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
                  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  
                  return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900">
                        #FF-{order.id.split('-')[0].slice(0,6)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">COD</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full border border-green-200 flex items-center justify-center bg-green-50 text-green-600 shrink-0 mt-0.5">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            {order.customer_name || 'Customer (Unknown)'}
                            <ExternalLink className="w-3 h-3 text-slate-400 cursor-pointer" />
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">
                            {order.customer_phone || 'No phone'}
                            {/* @ts-expect-error address could be on order if custom patched */}
                            {order.shipping_address?.address || ', Tamil Nadu'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-green-700 text-base">
                        ₹{order.total_amount?.toLocaleString('en-IN') ?? 0}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-700 text-sm">{dateStr}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{timeStr}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <select
                          value={order.status}
                          disabled={updatingStatus === order.id}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="bg-green-50 border-none font-bold text-slate-800 text-xs py-2 pl-3 pr-8 rounded-lg cursor-pointer focus:ring-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231f2937%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.7rem_top_50%] bg-[length:0.65rem_auto]"
                        >
                          <option disabled value={order.status}>Set {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</option>
                          {STATUS_OPTIONS.filter(s => s !== order.status).map(s => (
                            <option key={s} value={s}>Set {s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-slate-400 hover:text-slate-600 transition"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#f9fcf8] rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">ORDER SUMMARY</h2>
              <p className="text-sm text-slate-500 font-bold mt-1">
                #FF-{selectedOrder.id.split('-')[0].slice(0,6)} • {new Date(selectedOrder.created_at).toLocaleString('en-US')}
              </p>
            </div>

            <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Ordered Items */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">ORDERED ITEMS</p>
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={item.id ?? idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 shrink-0 overflow-hidden relative">
                            {item.product?.image_url ? (
                              <Image src={item.product.image_url} alt="Product" fill className="object-cover" />
                            ) : (
                              <ShoppingBag className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg">{item.product?.name ?? `Product #${item.product_id?.slice(0,6)}`}</h4>
                            <p className="text-sm text-slate-500 font-medium">{item.quantity} kg(s) × ₹{item.price}</p>
                          </div>
                          <div className="font-bold text-green-700 text-xl">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 font-medium">No items found.</p>
                  )}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Info */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">CUSTOMER INFORMATION</p>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">
                    <h4 className="font-bold text-slate-900 text-lg mb-3">{selectedOrder.customer_name || 'Customer'}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {selectedOrder.customer_email || 'No email provided'}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {selectedOrder.customer_phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">PAYMENT DETAILS</p>
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-center space-y-3">
                    <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                      Method: <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">COD</span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase">
                      Status: {selectedOrder.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Location */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">DELIVERY LOCATION</p>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="font-bold text-slate-800">
                      {/* @ts-expect-error JSONB fallback */}
                      {selectedOrder.shipping_address?.address || 'Thirumudivakkam Road, Poonthandalam - 600069'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
