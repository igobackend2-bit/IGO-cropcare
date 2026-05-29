import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET  /api/admin/orders          → list all orders (newest first)
// PATCH /api/admin/orders         → update order status  { id, status }
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id, user_id, total_amount, status, payment_method, payment_status, created_at, updated_at,
        users ( first_name, last_name, email, phone ),
        order_items ( id, product_id, quantity, price )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = (data ?? []).map((o: any) => {
      const u = Array.isArray(o.users) ? o.users[0] : o.users
      return {
        ...o,
        customer_name: u ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'Customer' : 'Guest',
        customer_email: u?.email ?? 'N/A',
        customer_phone: u?.phone ?? 'N/A',
        items: o.order_items ?? [],
      }
    })

    return NextResponse.json(orders)
  } catch (err) {
    console.error('GET /api/admin/orders error:', err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/admin/orders error:', err)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
