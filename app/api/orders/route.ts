import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/send-email'
import { orderConfirmationEmail } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const { userId, totalAmount, items, shippingAddress, paymentMethod, customerEmail, customerName } = await request.json()

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
        payment_method: paymentMethod || 'cod',
        payment_status: 'unpaid',
        shipping_address: shippingAddress || null,
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
    }

    // Fetch user email if not provided
    let emailTo = customerEmail
    let nameFor = customerName || 'Valued Customer'
    if (!emailTo && userId) {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single()
      emailTo = userData?.email
      if (!customerName && userData) {
        nameFor = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Valued Customer'
      }
    }

    // Send order confirmation email
    if (emailTo) {
      const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
      const shipping = subtotal > 999 ? 0 : 49
      const tax = parseFloat((subtotal * 0.05).toFixed(2))
      const total = subtotal + shipping + tax

      // Fetch product details for email
      const productIds = items.map((i: { product_id: string }) => i.product_id)
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, name, brand, image_url')
        .in('id', productIds)

      const emailItems = items.map((item: { product_id: string; quantity: number; price: number }) => {
        const prod = products?.find(p => p.id === item.product_id)
        return {
          name: prod?.name || 'Agricultural Product',
          brand: prod?.brand,
          image_url: prod?.image_url,
          quantity: item.quantity,
          price: item.price,
        }
      })

      const html = orderConfirmationEmail({
        orderId,
        customerName: nameFor,
        customerEmail: emailTo,
        items: emailItems,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: paymentMethod || 'cod',
        shippingAddress: shippingAddress || undefined,
      })

      await sendEmail({
        to: emailTo,
        subject: `✅ Order Confirmed — IGO-${orderId.split('-')[0].toUpperCase()} | IGO CropCare`,
        html,
      })
    }

    return NextResponse.json({ id: orderHeader.id, ...orderHeader }, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
