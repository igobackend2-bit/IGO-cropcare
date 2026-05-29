import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// PATCH /api/users/:userId  — update user profile (service role bypasses RLS)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const body = await request.json()
    // Only allow safe profile fields to be updated
    const allowedFields = ['first_name', 'last_name', 'email', 'address', 'city', 'state', 'pincode']
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Supabase user update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('PATCH /api/users error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
