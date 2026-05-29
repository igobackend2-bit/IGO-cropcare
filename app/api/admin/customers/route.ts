import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Join orders + users in one query to build aggregated customer stats
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        total_amount, created_at, user_id,
        users ( id, first_name, last_name, email, phone )
      `)

    if (error) throw error

    const customerMap = new Map<string, {
      id: string
      first_name: string
      last_name: string
      email: string
      phone: string
      total_orders: number
      total_spent: number
      last_order_date: string
    }>()

    ;(data ?? []).forEach((order: any) => {
      const user = Array.isArray(order.users) ? order.users[0] : order.users
      if (!user?.id) return
      const existing = customerMap.get(user.id)
      if (existing) {
        existing.total_orders += 1
        existing.total_spent += Number(order.total_amount)
        if (new Date(order.created_at) > new Date(existing.last_order_date)) {
          existing.last_order_date = order.created_at
        }
      } else {
        customerMap.set(user.id, {
          id: user.id,
          first_name: user.first_name ?? '',
          last_name: user.last_name ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          total_orders: 1,
          total_spent: Number(order.total_amount),
          last_order_date: order.created_at,
        })
      }
    })

    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.total_spent - a.total_spent)

    return NextResponse.json(customers)
  } catch (err) {
    console.error('GET /api/admin/customers error:', err)
    return NextResponse.json([], { status: 500 })
  }
}
