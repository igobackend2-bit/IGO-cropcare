'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const { addItem } = useCartStore()

  useEffect(() => {
    const saved = localStorage.getItem('cc_wishlist')
    setWishlistIds(saved ? JSON.parse(saved) : [])
  }, [])

  const remove = (id: string) => {
    const updated = wishlistIds.filter(w => w !== id)
    setWishlistIds(updated)
    localStorage.setItem('cc_wishlist', JSON.stringify(updated))
    toast.success('Removed from wishlist')
  }

  // Demo products matching wishlist IDs
  const DEMO_PRODUCTS = [
    { id: 'p1', name: 'BioProtect Copper Plus', price: 349, category: 'Fungicide', brand: 'IGO', image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=300&fit=crop' },
    { id: 'p2', name: 'Hybrid Tomato Seeds 500g', price: 599, category: 'Seeds', brand: 'Syngenta', image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&h=300&fit=crop' },
    { id: 'p3', name: 'NPK 19-19-19 Granules 5kg', price: 890, category: 'Fertilizer', brand: 'Coromandel', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop' },
  ]

  const wishlistProducts = DEMO_PRODUCTS.filter(p => wishlistIds.includes(p.id))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
            <p className="text-slate-500">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <Heart className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-6">Save items you love by clicking the heart icon on product cards.</p>
            <Link href="/products" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group hover:shadow-lg transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => remove(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full text-red-500 hover:bg-red-50 transition shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{product.brand}</p>
                  <h3 className="font-semibold text-slate-900 dark:text-white mt-0.5 mb-1">{product.name}</h3>
                  <p className="text-xs text-primary-600 bg-primary-50 dark:bg-primary-900/20 inline-block px-2 py-0.5 rounded-md mb-3">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        addItem({ id: `${product.id}-${Date.now()}`, product_id: product.id, quantity: 1, price: product.price })
                        toast.success('Added to cart!')
                      }}
                      className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition shadow-sm"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
