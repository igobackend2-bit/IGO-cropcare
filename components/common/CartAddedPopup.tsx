'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, X, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartAddedPopup() {
  const { lastAdded, clearLastAdded, items } = useCartStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (lastAdded) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        clearLastAdded()
      }, 4000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [lastAdded, clearLastAdded])

  if (!lastAdded) return null

  const product = lastAdded.product
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 pointer-events-auto"
        onClick={clearLastAdded}
      />
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Green top bar */}
        <div className="bg-emerald-500 px-5 py-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
          <span className="text-white font-extrabold text-sm uppercase tracking-wide">Added to Cart!</span>
          <button
            onClick={clearLastAdded}
            className="ml-auto text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product info */}
        <div className="p-5 flex items-center gap-4">
          {product?.image_url ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
              <Image
                src={product.image_url}
                alt={product.name || 'Product'}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-8 h-8 text-emerald-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 text-sm line-clamp-2 leading-snug">
              {product?.name || 'Product'}
            </p>
            {product?.brand && (
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{product.brand}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-extrabold text-emerald-600">
                Rs.{lastAdded.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400">
                x {lastAdded.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Cart summary */}
        <div className="px-5 pb-2">
          <div className="bg-gray-50 rounded-xl px-4 py-2 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
            </span>
            <span className="font-bold text-gray-800">
              Rs.{items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 flex gap-3">
          <button
            onClick={clearLastAdded}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Continue Shopping
          </button>
          <Link
            href="/cart"
            onClick={clearLastAdded}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-sm shadow-sm"
          >
            View Cart <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Progress bar auto-close */}
        <div className="h-1 bg-gray-100 overflow-hidden">
          <div className="h-full bg-emerald-400 animate-[shrink_4s_linear_forwards]" />
        </div>
      </div>
    </div>
  )
}
