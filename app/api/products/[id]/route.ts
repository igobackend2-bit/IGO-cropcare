import { NextResponse, NextRequest } from 'next/server'
import { getProductById } from '@/lib/supabase/db'

interface Params {
  id: Promise<string>
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProductById(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Could not fetch product details' }, { status: 500 })
  }
}
