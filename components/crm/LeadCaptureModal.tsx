'use client'

import { useState, useEffect } from 'react'
import { X, Sprout } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function LeadCaptureModal({ productId }: { productId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Only show once per session or if they haven't submitted
    const hasSubmitted = localStorage.getItem('cc_lead_captured')
    if (hasSubmitted) return

    // Show after 10 seconds of viewing a product
    const timer = setTimeout(() => setIsOpen(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    const { error } = await supabase.from('leads').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      intent_product_id: productId || null
    })

    if (error) {
      toast.error('Something went wrong. Try again.')
      console.error(error)
    } else {
      toast.success('Thanks! Our experts will contact you soon.')
      localStorage.setItem('cc_lead_captured', 'true')
      setIsOpen(false)
    }
    setSubmitting(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="bg-green-600 p-6 text-center relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Sprout className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Get Free Farming Advice</h2>
              <p className="text-green-100 text-sm font-medium">Our agri-experts will help you choose the right products for your crop.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/30 disabled:opacity-50 mt-2"
              >
                {submitting ? 'Submitting...' : 'Request Expert Call'}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">We respect your privacy. No spam.</p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
