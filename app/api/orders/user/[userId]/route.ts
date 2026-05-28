import { NextResponse, NextRequest } from 'next/server'
import { getUserOrders } from '@/lib/supabase/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const orders = await getUserOrders(userId)
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}
