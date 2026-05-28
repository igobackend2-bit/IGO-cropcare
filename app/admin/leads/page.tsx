'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, ExternalLink, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Lead, PageView } from '@/lib/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCRMData = async () => {
      setLoading(true)
      
      // Fetch Leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*, products(name)')
        .order('created_at', { ascending: false })
      
      if (leadsError) {
        toast.error('Failed to load leads')
        console.error(leadsError)
      } else {
        setLeads(leadsData as any)
      }

      // Fetch Page Views
      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('*, products(name)')
        .order('created_at', { ascending: false })
        .limit(100) // Show last 100 views
        
      if (viewsError) {
        toast.error('Failed to load page views')
        console.error(viewsError)
      } else {
        setPageViews(viewsData as any)
      }

      setLoading(false)
    }
    
    fetchCRMData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-green-600" /> CRM & Leads Tracking
        </h1>
        <p className="text-sm text-slate-500 mt-1">Monitor visitor activity and captured lead contacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Captured Leads Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold">Captured Leads</h2>
            <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{leads.length} Contacts</span>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Interested In</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-500">Loading...</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 text-slate-500">No leads captured yet.</td></tr>
                ) : (
                  leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                        {lead.phone && <p className="text-xs text-slate-500">{lead.phone}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {lead.products ? (
                          <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md line-clamp-1">
                            {lead.products.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">General Inquiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Page Views Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">Live Activity Feed</h2>
            <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Tracking
            </span>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Page / Product Viewed</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={2} className="text-center py-8 text-slate-500">Loading...</td></tr>
                ) : pageViews.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-8 text-slate-500">No activity yet.</td></tr>
                ) : (
                  pageViews.map((view: any) => (
                    <tr key={view.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <Link href={view.path} target="_blank" className="p-1.5 bg-slate-100 rounded hover:bg-slate-200 transition text-slate-500">
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <div>
                            {view.products ? (
                              <p className="font-medium text-purple-700 line-clamp-1">{view.products.name}</p>
                            ) : (
                              <p className="font-medium line-clamp-1">{view.path}</p>
                            )}
                            {view.user_id && <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider mt-0.5">Logged-in User</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(view.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
