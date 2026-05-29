import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { userId, totalAmount, items } = await request.json()

    if (!userId || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const orderId = crypto.randomUUID()

    // Insert order header using service role (bypasses RLS)
    const { data: orderHeader, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        total_amount: Number(totalAmount),
        status: 'pending',
        payment_method: 'cod',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (orderErr) {
      console.error('Supabase order insert error:', orderErr)
      return NextResponse.json({ error: 'Unable to create order', details: orderErr.message }, { status: 500 })
    }

    // Insert order items
    const orderItemsPayload = items.map((item: { product_id: string; quantity: number; price: number }) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsPayload)

    if (itemsErr) {
      console.error('Supabase order_items insert error:', itemsErr)
      // Order header was saved — return it even if items fail
    }

    return NextResponse.json({ id: orderHeader.id, ...orderHeader }, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
