import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/send-email'
import { supportTicketCreatedEmail, supportReplyEmail } from '@/lib/email-templates'

// GET  /api/support?userId=xxx   → fetch tickets for a user
// GET  /api/support?admin=1      → fetch ALL tickets (admin)
// POST /api/support              → create ticket
// PATCH /api/support             → admin reply { ticketId, reply, status }
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const isAdmin = searchParams.get('admin') === '1'

  try {
    if (isAdmin) {
      const { data, error } = await supabaseAdmin
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json(data ?? [])
    }

    if (userId) {
      const { data, error } = await supabaseAdmin
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json(data ?? [])
    }

    return NextResponse.json({ error: 'userId or admin required' }, { status: 400 })
  } catch (err) {
    console.error('GET /api/support error:', err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, customerName, customerEmail, subject, message, category, orderId } = body

    if (!customerName || !subject || !message) {
      return NextResponse.json({ error: 'Name, subject, and message are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: userId || null,
        customer_name: customerName,
        customer_email: customerEmail || '',
        subject,
        message,
        category: category || 'general',
        order_id: orderId || null,
        status: 'open',
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email to customer
    if (customerEmail) {
      const html = supportTicketCreatedEmail({
        ticketId: data.id,
        customerName,
        customerEmail,
        subject,
        message,
      })
      await sendEmail({
        to: customerEmail,
        subject: `🎫 Support Ticket Created #${data.id.slice(0,8).toUpperCase()} | IGO CropCare`,
        html,
      })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('POST /api/support error:', err)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { ticketId, reply, status } = await request.json()

    if (!ticketId || !reply) {
      return NextResponse.json({ error: 'ticketId and reply are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update({
        admin_reply: reply,
        status: status || 'resolved',
        replied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .select()
      .single()

    if (error) throw error

    // Send reply email to customer
    if (data.customer_email) {
      const html = supportReplyEmail({
        ticketId: data.id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        subject: data.subject,
        message: data.message,
        adminReply: reply,
        status: data.status,
      })
      await sendEmail({
        to: data.customer_email,
        subject: `💬 Response to Your Query #${data.id.slice(0,8).toUpperCase()} | IGO CropCare`,
        html,
      })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH /api/support error:', err)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
