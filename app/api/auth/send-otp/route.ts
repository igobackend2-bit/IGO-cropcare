import { NextResponse } from 'next/server'
import { setOtp, generateOtp } from '../otp-store'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
    }

    const otp = generateOtp()
    setOtp(phone, otp)

    // In production integrate with SMS provider (Twilio, MSG91, etc.)
    // For development we return the OTP in the response so the client can show it.
    return NextResponse.json({ success: true, otp })
  } catch (err) {
    console.error('send-otp error', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
