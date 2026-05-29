import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const { stock } = await request.json()
    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock value' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ stock, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error('Stock update error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to update stock' }, { status: 500 })
  }
}
