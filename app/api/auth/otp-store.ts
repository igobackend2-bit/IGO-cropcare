// Central in-memory OTP store used by auth endpoints (development only).
const OTP_STORE: Map<string, { otp: string; expiresAt: number }> = new Map()

export function setOtp(phone: string, otp: string, ttlMs = 5 * 60 * 1000) {
  OTP_STORE.set(phone, { otp, expiresAt: Date.now() + ttlMs })
}

export function getOtpRecord(phone: string) {
  return OTP_STORE.get(phone) || null
}

export function deleteOtp(phone: string) {
  OTP_STORE.delete(phone)
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
