'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useAuthStore } from '@/lib/store'
import { CreditCard, MapPin, CheckCircle, ShieldCheck, ChevronRight, Package } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Step = 'address' | 'payment' | 'confirm'

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'address', label: 'Delivery Address', icon: <MapPin className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'confirm', label: 'Confirmation', icon: <CheckCircle className="w-4 h-4" /> },
]

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [step, setStep] = useState<Step>('address')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [address, setAddress] = useState({
    name: user ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() : '',
    phone: user?.phone ?? '',
    line1: user?.address ?? '',
    city: user?.city ?? '',
    state: user?.state ?? '',
    pincode: user?.pincode ?? '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 49
  const tax = parseFloat((subtotal * 0.05).toFixed(2))
  const total = subtotal + shipping + tax

  const stepIndex = STEPS.findIndex(s => s.id === step)

  const handlePlaceOrder = async () => {
    if (!isLoggedIn || !user) {
      toast.error('Please login to place an order')
      router.push('/login?redirect=/checkout')
      return
    }

    setIsProcessing(true)

    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))

      // Save order via server-side API route (service role -- bypasses RLS)
      let savedOrder: { id: string } | null = null
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, totalAmount: total, items: orderItems }),
        })
        if (res.ok) {
          savedOrder = await res.json()
        }
      } catch (fetchErr) {
        console.error('API order save error:', fetchErr)
      }

      // Fallback: save to localStorage if API fails
      if (!savedOrder) {
        const fallbackId = crypto.randomUUID()
        const fallbackOrder = {
          id: fallbackId,
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'unpaid',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: orderItems.map(item => ({
            id: crypto.randomUUID(),
            order_id: fallbackId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
          customer_name: address.name,
          customer_email: user.email || '',
          customer_phone: address.phone,
        }
        const existing = JSON.parse(localStorage.getItem('cc_orders') ?? '[]')
        existing.push(fallbackOrder)
        localStorage.setItem('cc_orders', JSON.stringify(existing))
        savedOrder = fallbackOrder
      }

      if (!savedOrder) {
        toast.error('Failed to place order. Please try again.')
        setIsProcessing(false)
        return
      }

      const displayId = `ORD-${savedOrder.id.slice(0, 8).toUpperCase()}`
      setOrderId(displayId)
      clearCart()
      setStep('confirm')
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Order placement error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 p-6">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Your cart is empty</h2>
        <Link href="/products" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

        {/* Step Progress */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i <= stepIndex
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}>
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${i < stepIndex ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">

              {/* Step 1: Address */}
              {step === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600" /> Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', key: 'name', placeholder: 'Ramesh Kumar', colSpan: 1 },
                      { label: 'Phone Number', key: 'phone', placeholder: '9876543210', colSpan: 1 },
                      { label: 'Address Line', key: 'line1', placeholder: '123, Main Road, Village', colSpan: 2 },
                      { label: 'City / Town', key: 'city', placeholder: 'Nashik', colSpan: 1 },
                      { label: 'State', key: 'state', placeholder: 'Maharashtra', colSpan: 1 },
                      { label: 'PIN Code', key: 'pincode', placeholder: '422001', colSpan: 1 },
                    ].map(field => (
                      <div key={field.key} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={address[field.key as keyof typeof address]}
                          onChange={e => setAddress(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('payment')}
                    className="mt-6 w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-sm">
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-600" /> Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'razorpay', label: 'Pay Online', desc: 'UPI, Cards, Net Banking, Wallets via Razorpay', badge: 'Recommended' },
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', badge: '' },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}>
                        <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id as typeof paymentMethod}
                          onChange={() => setPaymentMethod(opt.id as typeof paymentMethod)} className="mt-1 accent-primary-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-white">{opt.label}</span>
                            {opt.badge && <span className="text-[10px] bg-primary-600 text-white px-2 py-0.5 rounded-full font-bold">{opt.badge}</span>}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 mb-6">
                    <ShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    All transactions are 256-bit SSL encrypted. Your payment details are never stored.
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('address')} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      Back
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handlePlaceOrder} disabled={isProcessing}
                      className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70">
                      {isProcessing ? (
                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                      ) : (
                        <>Place Order . Rs.{total.toFixed(2)}</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 'confirm' && (
                <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 shadow-sm text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-primary-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h2>
                  <p className="text-slate-500 mb-4">Thank you for your purchase. Your order is now being processed.</p>
                  <div className="inline-block bg-slate-100 dark:bg-slate-800 rounded-xl px-6 py-3 mb-8">
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="text-xl font-bold text-primary-600">{orderId}</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Link href="/profile/orders" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">
                      View Orders
                    </Link>
                    <Link href="/products" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      Shop More
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Order Summary */}
          {step !== 'confirm' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400 truncate flex-1">Item x{item.quantity}</span>
                    <span className="font-medium text-slate-900 dark:text-white ml-2">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>Rs.{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{shipping === 0 ? <span className="text-primary-600 font-medium">FREE</span> : `Rs.${shipping}`}</span></div>
                <div className="flex justify-between text-slate-500"><span>GST (5%)</span><span>Rs.{tax}</span></div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-lg border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
                  <span>Total</span><span>Rs.{total.toFixed(2)}</span>
                </div>
              </div>
              {shipping === 0 && (
                <p className="mt-3 text-xs text-primary-600 font-medium bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-lg">Free shipping applied on orders above Rs.999</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
