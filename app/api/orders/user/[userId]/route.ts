import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id, user_id, total_amount, status, payment_method, payment_status, created_at, updated_at,
        order_items (
          id, product_id, quantity, price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase getUserOrders error:', error)
      return NextResponse.json([], { status: 200 }) // Return empty array, client falls back to localStorage
    }

    return NextResponse.json(orders ?? [])
  } catch (error) {
    console.error('GET /api/orders/user error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
