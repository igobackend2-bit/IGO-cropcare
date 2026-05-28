import { NextResponse } from 'next/server'
import { getOtpRecord, deleteOtp } from '../otp-store'

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

    // In production you would create/verify session and return secure token
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify-otp error', err)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}
