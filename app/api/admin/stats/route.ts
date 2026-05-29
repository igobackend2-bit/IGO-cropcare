import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Revenue + order count
    const { data: ordersData, error: ordersErr } = await supabaseAdmin
      .from('orders')
      .select('total_amount, user_id, created_at')

    if (ordersErr) throw ordersErr

    const totalRevenue = ordersData?.reduce((acc, o) => acc + Number(o.total_amount), 0) ?? 0
    const totalOrders = ordersData?.length ?? 0
    const uniqueCustomers = new Set(ordersData?.map(o => o.user_id).filter(Boolean)).size

    // Product count
    const { count: productsCount } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Leads count
    const { count: leadsCount } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Recent orders (last 5) with user info
    const { data: recentOrders } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, status, created_at, users(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(5)

    // Calculate chart data (last 7 days)
    const chartData = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0] // YYYY-MM-DD
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
      
      const dayOrders = ordersData?.filter(o => o.created_at && o.created_at.startsWith(dateStr)) || []
      const dayRevenue = dayOrders.reduce((acc, o) => acc + Number(o.total_amount), 0)
      
      chartData.push({
        name: dayName,
        revenue: dayRevenue
      })
    }

    return NextResponse.json({
      revenue: totalRevenue,
      orders: totalOrders,
      customers: uniqueCustomers,
      products: productsCount ?? 0,
      leads: leadsCount ?? 0,
      recentOrders: recentOrders ?? [],
      chartData: chartData,
    })
  } catch (err) {
    console.error('GET /api/admin/stats error:', err)
    return NextResponse.json({
      revenue: 0, orders: 0, customers: 0, products: 0, leads: 0, recentOrders: []
    }, { status: 500 })
  }
}
