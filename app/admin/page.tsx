'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Package, Users, ShoppingBag, DollarSign, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    leads: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Dummy chart data - in production this would be grouped by day/month from Supabase
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      
      // Fetch Orders for revenue and count
      const { data: ordersData } = await supabase.from('orders').select('total_amount')
      const totalRevenue = ordersData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0
      
      // Fetch Products count
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
      
      // Fetch Leads count
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })

      // Fetch Recent Orders with user details
      const { data: recent } = await supabase
        .from('orders')
        .select('*, users(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        revenue: totalRevenue,
        orders: ordersData?.length || 0,
        customers: Array.from(new Set(ordersData?.map((o: any) => o.user_id))).length || 0,
        products: productsCount || 0,
        leads: leadsCount || 0
      })

      setRecentOrders(recent || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the CropCare Admin command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : `₹${stats.revenue.toLocaleString('en-IN')}`}
              </h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : stats.orders}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : stats.customers}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : stats.products}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Captured Leads</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {loading ? '...' : stats.leads}
              </h3>
            </div>
            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl">
              <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Revenue Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-green-600 hover:text-green-700">View All</Link>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {loading ? (
              <p className="text-slate-500 text-center">Loading...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-slate-500 text-center">No orders yet.</p>
            ) : (
              recentOrders.map((order) => {
                const user = Array.isArray(order.users) ? order.users[0] : order.users
                return (
                <div key={order.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {user ? `${user.first_name} ${user.last_name}` : 'Guest'}
                    </p>
                    <p className="text-xs text-slate-500">#{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-sm">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{order.status}</p>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
