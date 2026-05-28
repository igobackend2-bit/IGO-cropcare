'use client'

import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, MapPin, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const DEMO_ORDERS = [
  {
    id: 'ORD-948372',
    date: '20 May 2026',
    total: '₹1,845',
    status: 'shipped',
    eta: '22 May 2026',
    items: ['BioProtect Copper Plus (2 Kg)', 'NPK Granules 19-19-19 (5 Kg)'],
    tracking: 'DELHIVERY-9234812',
    steps: [
      { label: 'Order Placed', done: true, time: '20 May, 10:00 AM' },
      { label: 'Confirmed', done: true, time: '20 May, 10:45 AM' },
      { label: 'Shipped', done: true, time: '21 May, 09:30 AM' },
      { label: 'Out for Delivery', done: false, time: 'Expected: 22 May' },
      { label: 'Delivered', done: false, time: '' },
    ],
  },
  {
    id: 'ORD-937451',
    date: '14 May 2026',
    total: '₹3,210',
    status: 'delivered',
    eta: '17 May 2026',
    items: ['Hybrid Tomato Seeds (500g)', 'Imidacloprid 17.8% SL', 'Drip Tape Roll 100m'],
    tracking: 'BLUEDART-4491028',
    steps: [
      { label: 'Order Placed', done: true, time: '14 May, 02:15 PM' },
      { label: 'Confirmed', done: true, time: '14 May, 03:00 PM' },
      { label: 'Shipped', done: true, time: '15 May, 08:00 AM' },
      { label: 'Out for Delivery', done: true, time: '17 May, 09:15 AM' },
      { label: 'Delivered', done: true, time: '17 May, 01:30 PM' },
    ],
  },
]

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  placed:    { label: 'Placed',     cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  shipped:   { label: 'Shipped',    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  delivered: { label: 'Delivered',  cls: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' },
  cancelled: { label: 'Cancelled',  cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
            <p className="text-slate-500 mt-1">Track and manage all your purchases</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-primary-600 hover:underline">Shop More →</Link>
        </div>

        <div className="space-y-6">
          {DEMO_ORDERS.map((order, oi) => {
            const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE.placed
            const activeStep = order.steps.filter(s => s.done).length - 1

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: oi * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-1">ORDER ID</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium mb-1">ORDER DATE</p>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium mb-1">TOTAL</p>
                    <p className="font-bold text-slate-900 dark:text-white">{order.total}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badge.cls}`}>{badge.label}</span>
                </div>

                {/* Items */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {order.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary-500" />
                    Tracking: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.tracking}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    ETA: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.eta}</span>
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-6">
                  <div className="relative">
                    {/* Background line */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-700" />
                    {/* Filled line */}
                    <motion.div
                      className="absolute left-[11px] top-3 w-0.5 bg-primary-500"
                      initial={{ height: 0 }}
                      animate={{ height: `${(activeStep / (order.steps.length - 1)) * 100}%` }}
                      transition={{ duration: 1, delay: oi * 0.1 + 0.3, ease: 'easeOut' }}
                    />

                    <div className="space-y-5 relative">
                      {order.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-4 pl-1">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: oi * 0.1 + i * 0.1 + 0.2 }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                              s.done
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                : i === activeStep + 1
                                ? 'bg-white dark:bg-slate-900 border-2 border-primary-400 text-primary-500'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            }`}
                          >
                            {s.done ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                          </motion.div>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-sm font-semibold ${s.done ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{s.label}</p>
                            {s.time && <p className="text-xs text-slate-400 mt-0.5">{s.time}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <button className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline">
                    <RefreshCw className="w-4 h-4" /> Refresh Status
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                      <MapPin className="w-4 h-4" /> Write a Review
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
