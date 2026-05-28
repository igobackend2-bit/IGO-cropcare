'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart2, MapPin } from 'lucide-react'

const PRICES = [
  { crop: 'Urea (45kg bag)', category: 'Fertilizer', price: 266.50, change: 0, unit: 'bag', market: 'National Fixed' },
  { crop: 'DAP (50kg bag)', category: 'Fertilizer', price: 1350, change: +25, unit: 'bag', market: 'Delhi Mandi' },
  { crop: 'MOP (50kg bag)', category: 'Fertilizer', price: 1700, change: -50, unit: 'bag', market: 'Mumbai' },
  { crop: 'Imidacloprid 17.8% SL', category: 'Insecticide', price: 480, change: +10, unit: 'litre', market: 'Nashik' },
  { crop: 'Mancozeb 75% WP', category: 'Fungicide', price: 320, change: 0, unit: 'kg', market: 'National Avg' },
  { crop: 'Glyphosate 41% SL', category: 'Herbicide', price: 390, change: -15, unit: 'litre', market: 'Pune' },
  { crop: 'Hybrid Tomato Seeds', category: 'Seeds', price: 1200, change: +100, unit: 'pkt (10g)', market: 'Bengaluru' },
  { crop: 'BT Cotton Seed', category: 'Seeds', price: 870, change: 0, unit: 'pkt (475g)', market: 'National Fixed' },
  { crop: 'NPK 19-19-19', category: 'Fertilizer', price: 1680, change: +30, unit: '50kg bag', market: 'Hyderabad' },
  { crop: 'Chlorpyrifos 20% EC', category: 'Insecticide', price: 310, change: -20, unit: 'litre', market: 'Jaipur' },
  { crop: 'Propiconazole 25% EC', category: 'Fungicide', price: 550, change: +40, unit: 'litre', market: 'Lucknow' },
  { crop: '2,4-D Amine Salt', category: 'Herbicide', price: 185, change: 0, unit: 'litre', market: 'Chandigarh' },
]

const CATEGORIES = ['All', 'Fertilizer', 'Insecticide', 'Fungicide', 'Herbicide', 'Seeds']

import { useState } from 'react'

export default function MarketPricesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = selectedCategory === 'All' ? PRICES : PRICES.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <BarChart2 className="w-8 h-8 text-primary-600" />
                Market Price Tracker
              </h1>
              <p className="text-slate-500 mt-1">Live agrochemical & input prices across major Indian mandis</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <RefreshCw className="w-4 h-4 text-primary-500 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Updated: Today, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Products Tracked', value: PRICES.length, icon: '📦' },
            { label: 'Price Rising', value: PRICES.filter(p => p.change > 0).length, icon: '📈' },
            { label: 'Price Falling', value: PRICES.filter(p => p.change < 0).length, icon: '📉' },
            { label: 'Stable', value: PRICES.filter(p => p.change === 0).length, icon: '➡️' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-300'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Price Table */}
        <motion.div layout className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Market</th>
                  <th className="px-6 py-4 text-right">Price / {'{unit}'}</th>
                  <th className="px-6 py-4 text-right">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item, i) => (
                  <motion.tr key={item.crop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{item.crop}</p>
                      <p className="text-xs text-slate-400">per {item.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-md text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{item.market}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.change === 0 ? (
                        <span className="flex items-center justify-end gap-1 text-slate-400">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      ) : item.change > 0 ? (
                        <span className="flex items-center justify-end gap-1 text-red-600 font-semibold">
                          <TrendingUp className="w-3.5 h-3.5" /> +₹{item.change}
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-primary-600 font-semibold">
                          <TrendingDown className="w-3.5 h-3.5" /> ₹{item.change}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          * Prices are indicative and sourced from major mandis. Actual prices may vary by location and dealer. Last updated 21 May 2026.
        </p>
      </div>
    </div>
  )
}
