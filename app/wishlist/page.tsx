'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { getProducts, isSupabaseConfigured } from '@/lib/supabase/db'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function WishlistPage() {
  const { items: wishlistIds, toggleItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!wishlistIds || wishlistIds.length === 0) {
        setWishlistProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        let products: Product[] = []

        if (isSupabaseConfigured()) {
          // Try Supabase first
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', wishlistIds)

          if (!error && data && data.length > 0) {
            products = data as Product[]
          } else {
            // Supabase configured but query failed or returned empty — use local catalog
            const allProducts = await getProducts()
            products = allProducts.filter(p => wishlistIds.includes(p.id))
          }
        } else {
          // Supabase not configured — use local catalog
          const allProducts = await getProducts()
          products = allProducts.filter(p => wishlistIds.includes(p.id))
        }

        setWishlistProducts(products)
      } catch (err) {
        console.error('Wishlist fetch error:', err)
        // Last resort: local catalog
        try {
          const allProducts = await getProducts()
          setWishlistProducts(allProducts.filter(p => wishlistIds.includes(p.id)))
        } catch {
          toast.error('Failed to load wishlist items')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistProducts()
  }, [wishlistIds])

  const handleAddToCart = (product: Product) => {
    const sellingPrice = product.discount ? product.price - product.discount : product.price
    addItem({
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity: 1,
      price: sellingPrice,
    })
    toast.success('Added to cart!')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
            <p className="text-slate-500">
              {wishlistIds.length} saved item{wishlistIds.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500">Loading your favorites...</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <Heart className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-400 mb-6">Save items you love by clicking the heart icon on product cards.</p>
            <Link href="/products" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition inline-block">
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
                  <Image 
                    src={product.image_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'} 
                    alt={product.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <button
                    onClick={() => {
                      toggleItem(product.id)
                      toast.success('Removed from wishlist')
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full text-red-500 hover:bg-red-50 transition shadow-sm z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{product.brand}</p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white mt-0.5 mb-1 line-clamp-1 hover:text-emerald-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-0.5 rounded-md mb-3 capitalize">
                    {product.category.replace('_', ' ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ₹{product.discount ? product.price - product.discount : product.price}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
