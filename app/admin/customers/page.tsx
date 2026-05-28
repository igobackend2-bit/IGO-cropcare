'use client'

import { useEffect, useState } from 'react'
import { Users, Search, Download, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface CustomerStat {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  total_orders: number
  total_spent: number
  last_order_date: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      // Get all orders with user info to aggregate customer data
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount, created_at, user_id, users(id, first_name, last_name, email, phone)')
        
      if (error) {
        toast.error('Failed to load customers')
        console.error(error)
      } else if (data) {
        const customerMap = new Map<string, CustomerStat>()
        data.forEach((order: any) => {
          const user = Array.isArray(order.users) ? order.users[0] : order.users
          if (!user || !user.id) return
          const uid = user.id
          const existing = customerMap.get(uid)
          
          if (existing) {
            existing.total_orders += 1
            existing.total_spent += Number(order.total_amount)
            if (new Date(order.created_at) > new Date(existing.last_order_date)) {
              existing.last_order_date = order.created_at
            }
          } else {
            customerMap.set(uid, {
              id: uid,
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              email: user.email || '',
              phone: user.phone || '',
              total_orders: 1,
              total_spent: Number(order.total_amount),
              last_order_date: order.created_at
            })
          }
        })
        
        setCustomers(Array.from(customerMap.values()).sort((a, b) => b.total_spent - a.total_spent))
      }
      setLoading(false)
    }
    
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  )

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers.map(c => ({
      'Name': `${c.first_name} ${c.last_name}`,
      'Email': c.email,
      'Phone': c.phone,
      'Total Orders': c.total_orders,
      'Total Spent (₹)': c.total_spent,
      'Last Order Date': new Date(c.last_order_date).toLocaleDateString('en-IN')
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Customers")
    XLSX.writeFile(wb, "IGO_CropCare_Customers.xlsx")
    toast.success('Excel downloaded!')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text('IGO CropCare - Customer Database', 14, 15)
    
    const tableData = filteredCustomers.map(c => [
      `${c.first_name} ${c.last_name}`,
      c.email,
      c.phone || 'N/A',
      c.total_orders.toString(),
      `Rs. ${c.total_spent.toLocaleString('en-IN')}`,
      new Date(c.last_order_date).toLocaleDateString('en-IN')
    ])

    ;(doc as any).autoTable({
      head: [['Name', 'Email', 'Phone', 'Orders', 'Spent', 'Last Order']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] } // Green-600
    })

    doc.save('IGO_CropCare_Customers.pdf')
    toast.success('PDF downloaded!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" /> Customer Database
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage and export customer information. ({filteredCustomers.length} Farmers)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
          >
            <Download className="w-4 h-4" /> Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
          >
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading customers...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No customers match your search.</td></tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white capitalize">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white">{c.email}</p>
                      <p className="text-xs text-slate-500">{c.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{c.total_orders}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      ₹{c.total_spent.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(c.last_order_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
