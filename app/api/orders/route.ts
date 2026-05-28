import { NextResponse } from 'next/server'
import { createOrderInDB } from '@/lib/supabase/db'

export async function POST(request: Request) {
  try {
    const { userId, totalAmount, items } = await request.json()

    if (!userId || !totalAmount || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const order = await createOrderInDB(userId, Number(totalAmount), items)
    if (!order) {
      return NextResponse.json({ error: 'Unable to create order' }, { status: 500 })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}
