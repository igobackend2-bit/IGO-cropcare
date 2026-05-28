'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, RotateCcw, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)

  // Fetch all products including soft deleted (is_active = false)
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to load products')
      console.error(error)
    } else {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct?.name || !editingProduct?.price || !editingProduct?.category) {
      toast.error('Please fill required fields')
      return
    }

    try {
      if (editingProduct.id) {
        // Update
        const { error } = await supabase.from('products').update(editingProduct).eq('id', editingProduct.id)
        if (error) throw error
        toast.success('Product updated!')
      } else {
        // Create
        const newProduct = {
          ...editingProduct,
          is_active: true,
          stock: editingProduct.stock || 0,
        }
        const { error } = await supabase.from('products').insert(newProduct)
        if (error) throw error
        toast.success('Product created!')
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Error saving product')
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
      if (error) throw error
      toast.success(currentStatus ? 'Product removed from store' : 'Product restored')
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Error toggling status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Management</h1>
          <p className="text-sm text-slate-500">Add, edit, or remove products from the store.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct({})
            setIsModalOpen(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name & Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">No products found. Add your first product!</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={!product.is_active ? 'opacity-50 bg-slate-50 dark:bg-slate-900/50' : ''}>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative flex items-center justify-center">
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                      <p className="text-xs text-green-600 font-medium capitalize mt-1">{product.category.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{product.price}</td>
                    <td className="px-6 py-4">
                      {product.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md font-bold"><AlertTriangle className="w-3 h-3"/> Unsold</span>
                      ) : product.stock < 10 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-bold"><AlertTriangle className="w-3 h-3"/> Low Stock ({product.stock})</span>
                      ) : (
                        <span className="text-slate-600">{product.stock} units</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-medium">Active</span>
                      ) : (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">Hidden</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setIsModalOpen(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id, product.is_active ?? true)}
                          className={`p-2 rounded-lg transition ${
                            product.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={product.is_active ? 'Remove from store' : 'Restore to store'}
                        >
                          {product.is_active ? <Trash2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold">{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    required
                    value={editingProduct?.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">Select Category...</option>
                    <option value="seeds">Seeds</option>
                    <option value="fertilizers">Fertilizers</option>
                    <option value="crop_care">Crop Care</option>
                    <option value="insecticides">Insecticides</option>
                    <option value="herbicides">Herbicides</option>
                    <option value="fungicides">Fungicides</option>
                    <option value="equipment">Equipment</option>
                    <option value="tools">Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (₹ off)</label>
                  <input
                    type="number"
                    value={editingProduct?.discount || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct?.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingProduct?.image_url || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Paste an image link. To upload, use the Supabase Storage dashboard or a free image host for now.</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
