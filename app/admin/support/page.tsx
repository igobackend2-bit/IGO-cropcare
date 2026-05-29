'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  MessageSquare, Send, Filter, RefreshCw, X, Clock,
  CheckCircle2, AlertCircle, Loader2, User, Mail, Phone
} from 'lucide-react'

interface Ticket {
  id: string
  user_id: string | null
  customer_name: string
  customer_email: string
  subject: string
  message: string
  category: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: string
  admin_reply: string | null
  replied_at: string | null
  order_id: string | null
  created_at: string
}

const STATUS_COLOR: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved:    'bg-green-100 text-green-700',
  closed:      'bg-gray-100 text-gray-500',
}

const PRIORITY_COLOR: Record<string, string> = {
  low:    'bg-gray-100 text-gray-500',
  normal: 'bg-blue-50 text-blue-600',
  high:   'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyStatus, setReplyStatus] = useState<string>('resolved')
  const [sending, setSending] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [search, setSearch] = useState('')

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/support?admin=1')
      if (res.ok) setTickets(await res.json())
    } catch { toast.error('Failed to load tickets') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTickets() }, [])

  const handleReply = async () => {
    if (!selected || !replyText.trim()) { toast.error('Reply text required'); return }
    setSending(true)
    try {
      const res = await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selected.id, reply: replyText, status: replyStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      const updated: Ticket = await res.json()
      setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
      setSelected(updated)
      setReplyText('')
      toast.success(`Reply sent! Email delivered to ${selected.customer_email || 'customer'}`)
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const filtered = tickets.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return t.customer_name.toLowerCase().includes(q) ||
             t.subject.toLowerCase().includes(q) ||
             t.customer_email.toLowerCase().includes(q)
    }
    return true
  })

  const counts = {
    open:        tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved:    tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-black text-slate-900">Support Tickets</h1>
          <div className="flex gap-2">
            {counts.open > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{counts.open} Open</span>
            )}
            {counts.in_progress > 0 && (
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">{counts.in_progress} In Progress</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, subject..."
            className="pl-3 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none w-52" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={fetchTickets} className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: tickets.length, color: 'bg-slate-50 border-slate-200', text: 'text-slate-800' },
          { label: 'Open', value: counts.open, color: 'bg-blue-50 border-blue-100', text: 'text-blue-700' },
          { label: 'In Progress', value: counts.in_progress, color: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-700' },
          { label: 'Resolved', value: counts.resolved, color: 'bg-green-50 border-green-100', text: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.color}`}>
            <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">No tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Ticket</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 text-sm">{ticket.subject}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">#{ticket.id.slice(0,8).toUpperCase()}</p>
                      {ticket.admin_reply && (
                        <p className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Replied
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{ticket.customer_name}</p>
                          <p className="text-xs text-slate-400">{ticket.customer_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-semibold capitalize">{ticket.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_COLOR[ticket.status] || 'bg-gray-100 text-gray-500'}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-600 text-sm">{new Date(ticket.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                      <p className="text-slate-400 text-xs">{new Date(ticket.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</p>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setSelected(ticket); setReplyText(ticket.admin_reply || ''); setReplyStatus(ticket.status) }}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                        {ticket.admin_reply ? 'View / Edit' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-mono text-gray-400">#{selected.id.slice(0,8).toUpperCase()}</p>
                <h3 className="font-extrabold text-gray-900 text-lg">{selected.subject}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Customer info */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-green-600" /> {selected.customer_name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-green-600" /> {selected.customer_email}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[selected.status]}`}>
                  {selected.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(selected.created_at).toLocaleString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </span>
              </div>

              {/* Customer message */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Customer Message</p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.message}</p>
                </div>
              </div>

              {/* Previous reply */}
              {selected.admin_reply && (
                <div>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Previous Reply
                    {selected.replied_at && <span className="text-gray-400 font-normal">{new Date(selected.replied_at).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span>}
                  </p>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{selected.admin_reply}</p>
                  </div>
                </div>
              )}

              {/* Reply form */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Your Reply (sends email to customer)</label>
                <textarea rows={5} value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response... Customer will receive this via email and inbox."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">Update Status</label>
                  <select value={replyStatus} onChange={e => setReplyStatus(e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex-1 flex justify-end gap-3 items-end">
                  <button onClick={() => setSelected(null)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={handleReply} disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition disabled:opacity-60 text-sm">
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Reply & Email</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
