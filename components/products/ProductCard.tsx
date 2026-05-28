'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { items: wishlistItems, toggleItem } = useWishlistStore()
  const isFavorite = wishlistItems.includes(product.id)

  const toggleFavorite = () => {
    toggleItem(product.id)
    toast.success(!isFavorite ? 'Added to wishlist' : 'Removed from wishlist')
  }

  const handleAddToCart = () => {
    addItem({
      // eslint-disable-next-line react-hooks/purity
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity: 1,
      price: sellingPrice,
    })
    toast.success('Added to cart!')
  }

  // product.price = MRP (original), product.discount = rupee discount amount
  const sellingPrice   = product.discount ? product.price - product.discount : product.price
  const discountPercent = product.discount && product.price > 0
    ? Math.round((product.discount / product.price) * 100)
    : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-card text-card-foreground rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group border border-border"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 h-52">
        <Image
          src={product.image_url || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.discount && discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {discountPercent}% OFF
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="text-white font-bold text-lg tracking-wide uppercase">Unsold</span>
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute bottom-3 left-3 bg-amber-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">{product.brand}</p>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg text-foreground hover:text-primary-600 line-clamp-2 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category Tag */}
        <p className="text-xs text-primary-600 font-medium mt-1.5 capitalize bg-primary-50 dark:bg-primary-900/30 inline-block px-2 py-0.5 rounded-md">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 my-3">
          <div className="flex text-accent-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">({product.reviews_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 my-4">
          <span className="text-2xl font-bold text-foreground">
            ₹{sellingPrice.toLocaleString('en-IN')}
          </span>
          {product.discount && product.discount > 0 && (
            <span className="text-sm font-medium text-slate-400 line-through mb-1">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="mb-4">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">{product.stock} left in stock</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm shadow-primary-600/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Add to Cart</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`px-3 py-2.5 rounded-xl border transition ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-500/10 dark:border-red-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
