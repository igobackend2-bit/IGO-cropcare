'use client'

import Image from 'next/image'

import { useCartStore, useAuthStore } from '@/lib/store'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Trash2, ArrowRight, ShoppingCart, MapPin, CreditCard, ChevronRight, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const { isLoggedIn, user } = useAuthStore()
  
  const [productsList, setProductsList] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Payment states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [modalStep, setModalStep] = useState<'address' | 'payment' | 'processing' | 'success'>('address')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'netbanking'>('cod')

  const totalPrice = getTotalPrice()
  const tax = Math.round(totalPrice * 0.05 * 100) / 100
  const shipping = totalPrice > 500 ? 0 : 50
  const finalTotal = totalPrice + tax + shipping

  useEffect(() => {
    const loadProducts = async () => {
      if (!items || items.length === 0) {
        setProductsList([])
        setLoadingProducts(false)
        return
      }
      
      try {
        const productIds = items.map(item => item.product_id)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
          
        if (error) throw error
        setProductsList(data as Product[])
      } catch (err) {
        console.error('Failed to load cart products:', err)
        toast.error('Failed to load some product details')
      } finally {
        setLoadingProducts(false)
      }
    }
    loadProducts()
  }, [items])

  const handleCheckoutStart = () => {
    if (!isLoggedIn) {
      toast.error('Please login to checkout')
      window.location.href = '/login'
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Start checkout modal
    setShowCheckoutModal(true)
    setModalStep('address')
  }

  const handleAddressConfirm = () => {
    if (!user?.address || !user?.city || !user?.state || !user?.pincode) {
      toast.error('Please add a complete delivery address to proceed.')
      return
    }
    setModalStep('payment')
  }

  const handlePaymentSubmit = async () => {
    if (!user) return

    setModalStep('processing')
    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          totalAmount: finalTotal,
          items: orderItems,
        }),
      })

      if (!response.ok) {
        throw new Error('Order API failed')
      }

      const newOrder = await response.json()
      if (newOrder && newOrder.id) {
        setModalStep('success')
        clearCart()
        toast.success('Order placed successfully!')
      } else {
        toast.error('Could not save order. Please try again.')
        setModalStep('payment')
      }
    } catch (err) {
      console.error(err)
      toast.error('Checkout process encountered an error.')
      setModalStep('payment')
    }
  }

  if (items.length === 0) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Start shopping for quality agricultural products
            </p>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart
                </h2>
              </div>

              <div className="divide-y">
                {items.map((item) => {
                  const product = productsList.find((p) => p.id === item.product_id)
                  return (
                    <div key={item.id} className="p-6 flex gap-4 hover:bg-gray-50">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 border overflow-hidden relative">
                        <Image
                          src={product?.image_url || 'https://images.unsplash.com/photo-1590789033100-9f60a05a613d?w=100&h=100&fit=crop'}
                          alt={product?.name || 'Product'}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product?.name || 'Premium Agricultural Product'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Brand: {product?.brand || 'Premium Brands'}</p>
                        <div className="flex items-center gap-4 mt-4">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 font-bold"
                            >
                              −
                            </button>
                            <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-900 font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="ml-auto text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">₹{item.price} each</p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          removeItem(item.id)
                          toast.success('Item removed')
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="p-6 bg-gray-50 flex justify-between">
                <button
                  onClick={() => {
                    clearCart()
                    toast.success('Cart cleared')
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ Free shipping - order over ₹500
                  </p>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-green-600">₹{finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckoutStart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 shadow"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/products"
                className="w-full mt-3 text-center text-green-600 border border-green-600 py-3 rounded-lg hover:bg-green-50 transition font-semibold block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal Dialog */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            
            {/* Header */}
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Secure Checkout
              </h2>
              {modalStep !== 'processing' && modalStep !== 'success' && (
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content Steps */}
            <div className="p-6">
              
              {/* Step 1: Address confirmation */}
              {modalStep === 'address' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" /> Confirm Delivery Address
                  </h3>
                  {user?.address ? (
                    <div className="bg-gray-50 border rounded-lg p-4 text-sm space-y-1">
                      <p className="font-bold text-gray-800">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-gray-600">{user.address}</p>
                      <p className="text-gray-600">
                        {user.city}, {user.state} - {user.pincode}
                      </p>
                      <p className="text-xs text-gray-500 pt-1">Phone: {user.phone}</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                      No delivery address configured on your profile. Please add your address.
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <Link
                      href="/profile/edit"
                      className="flex-1 text-center border border-gray-300 py-2.5 rounded-lg text-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      Update Address
                    </Link>
                    <button
                      onClick={handleAddressConfirm}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition animate-pulse"
                    >
                      Confirm Address
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method selectors */}
              {modalStep === 'payment' && (
                <div className="space-y-5">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" /> Choose Payment Option
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-green-50/50 transition">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-800 block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-gray-500">Pay cash/card when your order is delivered to your farm.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-green-50/50 transition">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-800 block">UPI (PhonePe, GooglePay, BHIM)</span>
                        <span className="text-xs text-gray-500">Fast, instant digital transaction via UPI mobile scanner.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer hover:bg-green-50/50 transition">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-800 block">Net Banking (Simulated)</span>
                        <span className="text-xs text-gray-500">Login securely to your banking portal.</span>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center">
                      <span className="text-xs text-green-800 font-semibold mb-2">SCAN QR TO PAY</span>
                      <div className="w-32 h-32 bg-white border flex items-center justify-center p-2 rounded shadow-sm">
                        <div className="w-full h-full border border-dashed border-gray-400 bg-gray-50 flex items-center justify-center flex-wrap p-1">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className={`w-8 h-8 ${i % 3 === 0 || i % 4 === 1 ? 'bg-gray-800' : 'bg-transparent'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-2 font-mono">cropcare@upi</span>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setModalStep('address')}
                      className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition"
                    >
                      Pay ₹{finalTotal.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Processing screen */}
              {modalStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Authorizing Secure Payment</h4>
                    <p className="text-xs text-gray-500 mt-1">Please do not close this window or click browser back button...</p>
                  </div>
                </div>
              )}

              {/* Step 4: Success confirmation screen */}
              {modalStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                  <CheckCircle2 className="w-20 h-20 text-green-600" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-2xl">Payment Confirmed!</h4>
                    <p className="text-sm text-gray-600 mt-1">Your agricultural supplies have been ordered.</p>
                  </div>
                  <div className="w-full bg-gray-50 border rounded-lg p-4 text-xs space-y-1.5 max-w-sm text-left mx-auto">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Estimated Delivery</span>
                      <span className="text-gray-800 font-bold">3 - 5 Business Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Payment Mode</span>
                      <span className="text-gray-800 font-bold uppercase">{paymentMethod}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false)
                      window.location.href = '/profile/orders'
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-sm transition shadow-md"
                  >
                    View Order Details
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </>
  )
}
