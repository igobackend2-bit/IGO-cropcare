// ============================================================
// IGO CropCare — Email Sender Utility
// Uses Resend REST API (free tier: 3000 emails/month)
// Fallback: logs to console in development
// Setup: Add RESEND_API_KEY in Vercel env vars
// Get free key at: https://resend.com (sign up free)
// ============================================================

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY

  if (!apiKey || apiKey.startsWith('your_') || apiKey.startsWith('re_placeholder')) {
    // Development fallback — log to console
    console.log('📧 [EMAIL NOT SENT — No API key configured]')
    console.log(`   To: ${to}`)
    console.log(`   Subject: ${subject}`)
    console.log(`   Configure RESEND_API_KEY in .env.local and Vercel env vars`)
    return true // Don't block order flow
  }

  // ── Resend API (recommended) ──────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from || 'IGO CropCare <no-reply@igo-cropcare.in>',
          to: [to],
          subject,
          html,
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('Resend email error:', err)
        return false
      }
      console.log(`✅ Email sent via Resend to ${to}`)
      return true
    } catch (err) {
      console.error('Resend fetch error:', err)
      return false
    }
  }

  // ── SendGrid REST API fallback ────────────────────────────
  if (process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.startsWith('your_')) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: from || 'no-reply@igo-cropcare.in', name: 'IGO CropCare' },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      })
      if (!res.ok) {
        const err = await res.text()
        console.error('SendGrid email error:', err)
        return false
      }
      console.log(`✅ Email sent via SendGrid to ${to}`)
      return true
    } catch (err) {
      console.error('SendGrid fetch error:', err)
      return false
    }
  }

  return false
}
