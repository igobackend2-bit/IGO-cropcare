import { NextResponse } from 'next/server'
import { getOtpRecord, deleteOtp } from '../otp-store'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json()
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const record = getOtpRecord(phone)
    if (!record) {
      return NextResponse.json({ success: false, error: 'OTP not found or expired' }, { status: 400 })
    }

    if (Date.now() > record.expiresAt) {
      deleteOtp(phone)
      return NextResponse.json({ success: false, error: 'OTP expired' }, { status: 400 })
    }

    if (record.otp !== otp) {
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 })
    }

    // OTP is valid — remove it to prevent reuse
    deleteOtp(phone)

    // Find or create the user using the service-role client (bypasses RLS)
    let user = null
    try {
      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (existing) {
        user = existing
      } else {
        const { data: created, error: createErr } = await supabaseAdmin
          .from('users')
          .insert([{
            phone,
            email: `${phone}@cropcare.app`,
            first_name: '',
            last_name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            role: 'user',
          }])
          .select()
          .single()

        if (createErr) {
          console.error('Error creating user in Supabase:', createErr)
        } else {
          user = created
        }
      }
    } catch (dbErr) {
      // Non-fatal: Supabase might not be configured; client will use localStorage fallback
      console.error('Supabase user find/create error:', dbErr)
    }

    return NextResponse.json({ success: true, user })
  } catch (err) {
    console.error('verify-otp error', err)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
