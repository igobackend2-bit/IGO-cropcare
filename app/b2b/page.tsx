'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, CheckCircle, ChevronRight, Users, Package, BarChart3, Globe, Phone, Mail, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const BENEFITS = [
  { icon: <Package className="w-6 h-6" />, title: 'Bulk Pricing', desc: 'Up to 30% off on volume orders above ₹50,000' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Dedicated Account Manager', desc: 'Personal support for orders, returns, and queries' },
  { icon: <Globe className="w-6 h-6" />, title: '13,000+ Retail Network', desc: 'Join our national distribution ecosystem' },
  { icon: <FileText className="w-6 h-6" />, title: 'Credit Terms', desc: 'Flexible 30/60 day payment terms for verified dealers' },
  { icon: <Users className="w-6 h-6" />, title: 'Training & Marketing', desc: 'Product training kits and co-branded marketing materials' },
  { icon: <CheckCircle className="w-6 h-6" />, title: 'Priority Stock', desc: 'Guaranteed allocations during peak season demand' },
]

const TIERS = [
  { name: 'Silver Dealer', min: '₹50,000', discount: '15%', support: 'Email', badge: 'bg-slate-100 text-slate-600' },
  { name: 'Gold Dealer', min: '₹2,00,000', discount: '22%', support: 'Dedicated AM', badge: 'bg-amber-100 text-amber-700', popular: true },
  { name: 'Platinum Distributor', min: '₹5,00,000+', discount: '30%', support: '24/7 Priority', badge: 'bg-primary-100 text-primary-700' },
]

export default function B2BPage() {
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', state: '', city: '', type: 'dealer', volume: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    toast.success('Application submitted! We\'ll contact you within 24 hours.')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" /> B2B & Wholesale Portal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Grow Your Agri Business<br className="hidden md:block" /> with IGO CropCare
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Join India's fastest-growing agrochemical distribution network. Exclusive pricing, dedicated support, and priority stock for verified dealers.
          </motion.p>
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            {['13,000+ Active Dealers', '28 States Coverage', '₹500 Cr+ Annual GMV'].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-primary-300" />{s}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">Why Partner with IGO?</h2>
        <p className="text-slate-500 text-center mb-10">Everything you need to scale your agricultural distribution business</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl w-fit mb-4 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 transition-colors">
                {b.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{b.title}</h3>
              <p className="text-sm text-slate-500">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="bg-slate-100 dark:bg-slate-900/50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">Dealer Tiers</h2>
          <p className="text-slate-500 text-center mb-10">Unlock better margins as your business grows</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`bg-white dark:bg-slate-900 rounded-2xl border-2 p-6 shadow-sm ${tier.popular ? 'border-primary-500 shadow-primary-500/20 shadow-lg scale-[1.03]' : 'border-slate-200 dark:border-slate-800'}`}>
                {tier.popular && <div className="text-center mb-3"><span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span></div>}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${tier.badge}`}>{tier.name}</div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{tier.discount}</p>
                <p className="text-sm text-slate-500 mb-4">discount on MRP</p>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <p>Min. order: <span className="font-semibold text-slate-800 dark:text-slate-200">{tier.min}</span></p>
                  <p>Support: <span className="font-semibold text-slate-800 dark:text-slate-200">{tier.support}</span></p>
                </div>
                <a href="#register" className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition ${tier.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  Apply Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div id="register" className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">Apply for Dealership</h2>
        <p className="text-slate-500 text-center mb-10">Fill the form below and our team will reach out within 24 hours</p>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Received!</h3>
            <p className="text-slate-500">Our B2B team will contact you at <strong>{form.phone}</strong> within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Company / Farm Name', key: 'company', placeholder: 'ABC Agro Pvt Ltd' },
                { label: 'Contact Person', key: 'name', placeholder: 'Ramesh Kumar' },
                { label: 'Phone Number', key: 'phone', placeholder: '9876543210' },
                { label: 'Email Address', key: 'email', placeholder: 'ramesh@abcagro.com', type: 'email' },
                { label: 'City', key: 'city', placeholder: 'Nashik' },
                { label: 'State', key: 'state', placeholder: 'Maharashtra' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type={f.type || 'text'} required placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Business Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                  <option value="dealer">Retail Dealer</option>
                  <option value="distributor">Wholesale Distributor</option>
                  <option value="cooperative">Farmer Cooperative</option>
                  <option value="export">Export / International</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Expected Monthly Volume</label>
                <select value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                  <option value="">Select volume</option>
                  <option value="50k">₹50,000 – ₹1,00,000</option>
                  <option value="200k">₹1,00,000 – ₹5,00,000</option>
                  <option value="500k+">₹5,00,000+</option>
                </select>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit"
              className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-sm shadow-primary-500/20">
              Submit Application <ChevronRight className="w-5 h-5" />
            </motion.button>
          </form>
        )}

        {/* Contact alternatives */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          {[
            { icon: <Phone className="w-5 h-5" />, label: 'Call B2B Desk', val: '1800-100-200' },
            { icon: <Mail className="w-5 h-5" />, label: 'Email Us', val: 'b2b@igo-cropcare.in' },
          ].map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex justify-center text-primary-600 mb-2">{c.icon}</div>
              <p className="text-xs text-slate-400 mb-1">{c.label}</p>
              <p className="font-bold text-slate-900 dark:text-white">{c.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
