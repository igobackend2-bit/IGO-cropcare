'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, Plus, Minus, RefreshCw, AlertCircle, CheckCircle, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import toast from 'react-hot-toast'

const RESET_DEFAULT = 200

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
    if (error) {
      toast.error('Failed to load products')
      console.error(error)
    } else {
      setProducts((data || []) as Product[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  const updateStock = async (productId: string, newStock: number) => {
    if (newStock < 0) return
    setSaving((prev) => ({ ...prev, [productId]: true }))
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    )
    try {
      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      })
      if (!res.ok) throw new Error('API failed')
      toast.success('Stock updated')
    } catch {
      // Fallback: direct supabase
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
      if (error) {
        toast.error('Failed to update stock')
        fetchProducts()
      } else {
        toast.success('Stock updated')
      }
    } finally {
      setSaving((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const totalIn = filtered.filter((p) => p.stock > 0).length
  const totalOut = filtered.filter((p) => p.stock === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage stock levels for all products</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {totalIn} IN STOCK
          </span>
          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            {totalOut} OUT OF STOCK
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
            <Package className="w-3.5 h-3.5" />
            {filtered.length} ITEMS
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, brands, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Brand</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock (KG)</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Reset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const isOut = product.stock === 0
                  const isSaving = saving[product.id]
                  return (
                    <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${isOut ? 'bg-red-50/30' : ''}`}>
                      {/* Product Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 md:hidden">{product.category?.replace('_', ' ')} &bull; {product.brand}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs font-medium text-slate-600 capitalize bg-slate-100 px-2 py-1 rounded-lg">
                          {product.category?.replace('_', ' ')}
                        </span>
                      </td>
                      {/* Brand */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm text-slate-600">{product.brand || '—'}</span>
                      </td>
                      {/* Stock Adjuster */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateStock(product.id, product.stock - 1)}
                            disabled={isSaving || product.stock === 0}
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <div className="min-w-[60px] text-center">
                            {isSaving ? (
                              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto" />
                            ) : (
                              <span className="font-bold text-slate-900 text-base">{product.stock}</span>
                            )}
                            <span className="block text-[10px] text-slate-400 font-medium">KG</span>
                          </div>
                          <button
                            onClick={() => updateStock(product.id, product.stock + 1)}
                            disabled={isSaving}
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      {/* Quick Reset */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => updateStock(product.id, RESET_DEFAULT)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
                        >
                          <RefreshCw className="w-3 h-3" />
                          RESET TO {RESET_DEFAULT}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
