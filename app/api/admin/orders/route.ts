import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/send-email'
import { orderStatusUpdateEmail } from '@/lib/email-templates'

// GET  /api/admin/orders          → list all orders (newest first)
// PATCH /api/admin/orders         → update order status  { id, status, trackingNumber? }
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id, user_id, total_amount, status, payment_method, payment_status, shipping_address, created_at, updated_at,
        users ( first_name, last_name, email, phone ),
        order_items ( id, product_id, quantity, price,
          products ( id, name, brand, image_url )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = (data ?? []).map((o: any) => {
      const u = Array.isArray(o.users) ? o.users[0] : o.users
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (o.order_items ?? []).map((item: any) => ({
        ...item,
        product: item.products ?? null,
      }))
      return {
        ...o,
        customer_name: u ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'Customer' : 'Guest',
        customer_email: u?.email ?? null,
        customer_phone: u?.phone ?? 'N/A',
        items,
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
    const { id, status, trackingNumber } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
    if (trackingNumber) updatePayload.tracking_number = trackingNumber

    const { error } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', id)

    if (error) throw error

    // Fetch order details for notification email
    const { data: orderData } = await supabaseAdmin
      .from('orders')
      .select(`
        id, total_amount, shipping_address, payment_method,
        users ( first_name, last_name, email ),
        order_items ( product_id, quantity, price,
          products ( name, brand, image_url )
        )
      `)
      .eq('id', id)
      .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (orderData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const u = Array.isArray((orderData as any).users) ? (orderData as any).users[0] : (orderData as any).users
      const customerEmail = u?.email
      const customerName = u ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || 'Valued Customer' : 'Valued Customer'

      if (customerEmail) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = ((orderData as any).order_items ?? []).map((item: any) => ({
          name: item.products?.name || 'Agricultural Product',
          brand: item.products?.brand,
          image_url: item.products?.image_url,
          quantity: item.quantity,
          price: item.price,
        }))

        const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
        const shipping = subtotal > 999 ? 0 : 49
        const tax = parseFloat((subtotal * 0.05).toFixed(2))
        const addr = (orderData as any).shipping_address

        const html = orderStatusUpdateEmail({
          orderId: id,
          customerName,
          customerEmail,
          items,
          subtotal,
          shipping,
          tax,
          total: subtotal + shipping + tax,
          paymentMethod: (orderData as any).payment_method || 'cod',
          shippingAddress: addr || undefined,
          status,
          trackingNumber: trackingNumber || undefined,
        })

        const statusLabels: Record<string, string> = {
          confirmed: '✅ Order Confirmed',
          packed: '📦 Order Packed',
          shipped: '🚚 Order Shipped',
          delivered: '🎉 Order Delivered',
          cancelled: '❌ Order Cancelled',
        }
        const subject = `${statusLabels[status.toLowerCase()] || `Order ${status}`} — IGO-${id.split('-')[0].toUpperCase()} | IGO CropCare`

        await sendEmail({ to: customerEmail, subject, html })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/admin/orders error:', err)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
