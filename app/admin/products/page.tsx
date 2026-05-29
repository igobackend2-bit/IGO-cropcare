'use client'

import { useEffect, useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Search, Package, CheckCircle, AlertCircle, Eye, EyeOff, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORIES = ['insecticides', 'herbicides', 'fungicides', 'fertilizers', 'seeds', 'tools']

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to load products')
    } else {
      setProducts((data || []) as Product[])
    }
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter((p) => {
      const matchCat = filterCat === 'all' || p.category === filterCat
      const matchQ = p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [products, search, filterCat])

  const openNew = () => {
    setEditingProduct({ is_active: true, stock: 0, price: 0, rating: 4.0, reviews_count: 0 })
    setIsModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingProduct({ ...p })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      toast.error('Please fill required fields')
      return
    }
    setSaving(true)
    try {
      if (editingProduct.id) {
        const { error } = await supabase.from('products').update(editingProduct).eq('id', editingProduct.id)
        if (error) throw error
        toast.success('Product updated!')
      } else {
        const { error } = await supabase.from('products').insert({ ...editingProduct, is_active: true })
        if (error) throw error
        toast.success('Product created!')
      }
      setIsModalOpen(false)
      fetchProducts()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id)
      if (error) throw error
      toast.success(current ? 'Removed from website' : 'Product is now live')
      fetchProducts()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Error toggling status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted')
      fetchProducts()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Error deleting product')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploadingImage(true)
    try {
      const file = e.target.files[0]
      const ext = file.name.split('.').pop()
      const path = `product-images/${Math.random().toString(36).substring(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('products').upload(path, file)
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('products').getPublicUrl(path)
      setEditingProduct((prev) => ({ ...prev, image_url: data.publicUrl }))
      toast.success('Image uploaded!')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none shadow-sm capitalize"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-3">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const isActive = product.is_active !== false
            const isOut = product.stock === 0
            const sellingPrice = product.discount ? product.price - product.discount : product.price
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition hover:shadow-md ${!isActive ? 'opacity-60 border-slate-200' : 'border-slate-200'}`}
              >
                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  {/* Active/Inactive badge */}
                  <div className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                    {isActive ? 'LIVE' : 'HIDDEN'}
                  </div>
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SALE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</p>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-emerald-600 font-medium capitalize">{product.category?.replace('_', ' ')}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-slate-900">Rs.{sellingPrice.toFixed(0)}</span>
                      {product.discount && (
                        <span className="text-xs text-slate-400 line-through">Rs.{product.price.toFixed(0)}</span>
                      )}
                    </div>
                    {isOut ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">OUT</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">IN STOCK {product.stock}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-100 p-3 space-y-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> EDIT FULL DETAILS
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(product.id, isActive)}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-xl border transition ${
                        isActive
                          ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isActive ? (
                        <><EyeOff className="w-3 h-3" /> REMOVE FROM WEBSITE</>
                      ) : (
                        <><Eye className="w-3 h-3" /> PUBLISH</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                    {editingProduct.image_url ? (
                      <img src={editingProduct.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:border-green-400 hover:text-green-600 transition">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <p className="text-xs text-slate-400 mt-1">Or paste URL below</p>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={editingProduct.image_url || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                      className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text" required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Bayer Confidor 200 SL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none capitalize"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Bayer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price (Rs.) *</label>
                  <input
                    type="number" required min="0" step="0.01"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Discount (Rs.)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={editingProduct.discount || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stock (KG)</label>
                  <input
                    type="number" min="0"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Rating</label>
                  <input
                    type="number" min="0" max="5" step="0.1"
                    value={editingProduct.rating || 4.0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 4 })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Product description..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Product'}
                </button>
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
