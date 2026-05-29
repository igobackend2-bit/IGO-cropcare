'use client'

import Image from 'next/image'
import { useAuthStore, useCartStore, useWishlistStore } from '@/lib/store'
import { getProducts } from '@/lib/supabase/db'
import { Product } from '@/lib/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, Heart, ShoppingCart, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfileWishlistPage() {
  const { user, isLoggedIn, logout } = useAuthStore()
  const { addItem } = useCartStore()
  const { items: wishlistIds, toggleItem } = useWishlistStore()
  const router = useRouter()
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  useEffect(() => {
    const loadWishlist = async () => {
      if (!wishlistIds || wishlistIds.length === 0) {
        setWishlistProducts([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const allProducts = await getProducts()
        setWishlistProducts(allProducts.filter(p => wishlistIds.includes(p.id)))
      } catch (err) {
        console.error('Failed to load wishlist products:', err)
        toast.error('Could not load wishlist')
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [wishlistIds])

  const handleRemove = (productId: string) => {
    toggleItem(productId)
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      // eslint-disable-next-line react-hooks/purity
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity: 1,
      price: product.price - (product.discount || 0),
    })
    toast.success('Added to cart!')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.first_name || 'Farmer'} {user?.last_name || ''}
                </h2>
                <p className="text-gray-500 text-sm">{user?.phone || user?.email}</p>
              </div>
              <nav className="space-y-1">
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Profile</Link>
                <Link href="/profile/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">My Orders</Link>
                <Link href="/profile/wishlist" className="block px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold">
                  Wishlist
                  {wishlistIds.length > 0 && (
                    <span className="ml-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishlistIds.length}</span>
                  )}
                </Link>
                <Link href="/profile/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">Settings</Link>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-2 transition">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                Saved Products
                {wishlistIds.length > 0 && (
                  <span className="text-sm font-medium text-gray-400">
                    ({wishlistIds.length} item{wishlistIds.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading your favourites...</p>
                </div>
              ) : wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {wishlistProducts.map((product) => {
                    const sellingPrice = product.discount ? product.price - product.discount : product.price
                    return (
                      <div key={product.id}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col bg-white">
                        <div className="h-40 bg-gray-100 overflow-hidden relative">
                          <Image
                            src={product.image_url || '/products/default.png'}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-cover"
                          />
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                              SALE
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand}</span>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mt-0.5 text-sm leading-snug">{product.name}</h3>
                          <p className="text-xs text-emerald-600 font-medium capitalize mt-1">{product.category.replace('_', ' ')}</p>
                          <div className="flex items-baseline gap-2 mt-3">
                            <span className="text-lg font-bold text-gray-900">Rs.{sellingPrice.toFixed(2)}</span>
                            {product.discount && (
                              <span className="text-xs text-gray-400 line-through">Rs.{product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="border-t p-3 bg-gray-50 flex gap-2">
                          <Link href={`/products/${product.id}`}
                            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 border border-gray-200 rounded-lg transition flex items-center justify-center gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                          <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                          <button onClick={() => handleRemove(product.id)}
                            className="p-2 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg transition"
                            title="Remove from wishlist">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-lg">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-1 mb-6">Tap the heart on any product to save it here.</p>
                  <Link href="/products"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition inline-block">
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
