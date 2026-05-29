'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  MessageSquare, Plus, X, Send, Clock, CheckCircle2, AlertCircle,
  Loader2, ChevronRight, User, LogOut, ShoppingBag, Heart, Settings
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  message: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  admin_reply: string | null
  replied_at: string | null
  created_at: string
  order_id?: string
}

const CATEGORIES = [
  { value: 'order', label: '📦 Order Issue' },
  { value: 'product', label: '🌿 Product Query' },
  { value: 'payment', label: '💳 Payment Problem' },
  { value: 'delivery', label: '🚚 Delivery Issue' },
  { value: 'general', label: '💬 General Query' },
  { value: 'complaint', label: '⚠️ Complaint' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open:        { label: 'Open',        color: 'bg-blue-100 text-blue-700',    icon: <Clock className="w-3.5 h-3.5" /> },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  resolved:    { label: 'Resolved',    color: 'bg-green-100 text-green-700',  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  closed:      { label: 'Closed',      color: 'bg-gray-100 text-gray-600',    icon: <X className="w-3.5 h-3.5" /> },
}

export default function CustomerInboxPage() {
  const { user, isLoggedIn, logout } = useAuthStore()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    subject: '',
    message: '',
    category: 'general',
  })

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    fetchTickets()
  }, [isLoggedIn])

  const fetchTickets = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`/api/support?userId=${user.id}`)
      if (res.ok) setTickets(await res.json())
    } catch { setTickets([]) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill in subject and message')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          customerName: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Customer',
          customerEmail: user?.email || '',
          subject: form.subject,
          message: form.message,
          category: form.category,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      const ticket = await res.json()
      setTickets(prev => [ticket, ...prev])
      setForm({ subject: '', message: '', category: 'general' })
      setShowForm(false)
      toast.success('Support ticket submitted! We\'ll reply within 24 hours.')
    } catch {
      toast.error('Failed to submit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => { logout(); window.location.href = '/' }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-gray-500 text-sm mt-1">Ask questions, track your queries, get expert help</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white mb-3">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user?.first_name || 'Farmer'} {user?.last_name || ''}</h2>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <nav className="space-y-1">
                {[
                  { href: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
                  { href: '/profile/orders', label: 'My Orders', icon: <ShoppingBag className="w-4 h-4" /> },
                  { href: '/profile/wishlist', label: 'Wishlist', icon: <Heart className="w-4 h-4" /> },
                  { href: '/profile/inbox', label: 'Support Inbox', icon: <MessageSquare className="w-4 h-4" />, active: true },
                  { href: '/profile/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      item.active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    {item.icon} {item.label}
                    {item.active && tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length > 0 && (
                      <span className="ml-auto bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                      </span>
                    )}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* New Query Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" /> My Queries
                <span className="text-sm font-normal text-gray-400">({tickets.length})</span>
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" /> New Query
              </button>
            </div>

            {/* New Query Form */}
            {showForm && (
              <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-extrabold text-gray-900">Raise a Support Query</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                    <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Brief subject of your query..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your issue in detail. Include order ID if applicable..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Query</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tickets list */}
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading your queries...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <MessageSquare className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <h3 className="font-bold text-gray-700 text-lg mb-1">No queries yet</h3>
                <p className="text-gray-400 text-sm mb-5">Have a question? Our team is here to help.</p>
                <button onClick={() => setShowForm(true)}
                  className="bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow transition hover:bg-green-700">
                  Ask a Question
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => {
                  const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
                  return (
                    <div key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green-100 transition cursor-pointer">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-bold text-gray-400 font-mono">#{ticket.id.slice(0,8).toUpperCase()}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.color}`}>
                              {cfg.icon} {cfg.label}
                            </span>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-semibold capitalize">{ticket.category}</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm truncate">{ticket.subject}</h4>
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{ticket.message}</p>
                          {ticket.admin_reply && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Team replied
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                          <ChevronRight className="w-4 h-4 text-gray-300 mt-1 ml-auto" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 font-mono">#{selectedTicket.id.slice(0,8).toUpperCase()}</p>
                <h3 className="font-extrabold text-gray-900">{selectedTicket.subject}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Status + Date */}
              <div className="flex gap-3 flex-wrap">
                {(() => { const cfg = STATUS_CONFIG[selectedTicket.status] || STATUS_CONFIG.open; return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                )})()}
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-semibold capitalize">{selectedTicket.category}</span>
                <span className="text-xs text-gray-400 py-1">
                  {new Date(selectedTicket.created_at).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </span>
              </div>

              {/* Customer message */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Message</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedTicket.message}</p>
                </div>
              </div>

              {/* Admin reply */}
              {selectedTicket.admin_reply ? (
                <div>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> IGO CropCare Support Team
                    {selectedTicket.replied_at && (
                      <span className="text-gray-400 font-normal normal-case tracking-normal">
                        · {new Date(selectedTicket.replied_at).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    )}
                  </p>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{selectedTicket.admin_reply}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-800 font-medium">Awaiting response — our team typically replies within 24 hours.</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-xs text-gray-400 text-center">
                Need urgent help? WhatsApp us at{' '}
                <a href="https://wa.me/917428208822" className="text-green-600 font-bold">+91 74282 08822</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
