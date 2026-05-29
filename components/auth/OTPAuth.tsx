'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

export default function OTPAuth() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const { setUser, setIsLoggedIn } = useAuthStore()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
      toast.error('Please enter your phone number')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send OTP')

      // For development the API returns the OTP so we display it in toast.
      if (data?.otp) {
        toast.success(`OTP sent! (Demo: ${data.otp})`)
      } else {
        toast.success('OTP sent!')
      }
      setOtpSent(true)
      setTimer(300) // 5 minutes
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error('Please enter OTP')
      return
    }

    setLoading(true)
    try {
      // Verify OTP on server
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData?.success) {
        toast.error(verifyData?.error || 'Invalid or expired OTP')
        return
      }

      // User is returned by the server-side verify-otp route (service role — bypasses RLS)
      // If Supabase isn't configured the server returns user: null and we build a local stub
      const user = verifyData.user ?? {
        id: crypto.randomUUID(),
        phone,
        email: `${phone}@cropcare.app`,
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setUser(user)
      setIsLoggedIn(true)
      toast.success('Login successful!')



      // Redirect to home or dashboard
      window.location.href = '/'
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Login with OTP</h2>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">We&apos;ll send you an OTP on this number</p>
            </div>
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                OTP sent to <strong>+91 {phone}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false)
                setOtp('')
                setPhone('')
              }}
              className="w-full text-gray-600 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Change Number
            </button>
            {timer > 0 && (
              <p className="text-sm text-center text-gray-600">
                Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
