import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { stock } = await request.json()
    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ stock, updated_at: new Date().toISOString() })
      .eq('id', params.productId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Stock update error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update stock' }, { status: 500 })
  }
}
