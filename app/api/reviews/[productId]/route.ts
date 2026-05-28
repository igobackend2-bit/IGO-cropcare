import { NextResponse, NextRequest } from 'next/server'
import { getProductReviews, submitProductReview } from '@/lib/supabase/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const reviews = await getProductReviews(productId)
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()
    const { userId, userName, rating, comment } = body

    if (!userId || !rating || !comment) {
      return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 })
    }

    const review = await submitProductReview(productId, userId, userName || 'Farmer User', Number(rating), comment)
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
