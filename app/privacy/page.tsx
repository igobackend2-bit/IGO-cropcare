import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Phone, MapPin, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — IGO CropCare',
  description: 'Learn how IGO CropCare collects, uses, and protects your personal data and agricultural information.',
}

const SECTIONS = [
  {
    id: 'information-collected',
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Personal Information',
        text: 'When you register an account, place an order, or contact us, we collect: your name, mobile number, email address, delivery address (village, city, state, PIN code), and farm-related information such as crop type and land area.',
      },
      {
        subtitle: '1.2 Usage Data',
        text: 'We automatically collect device and usage data including IP address, browser type, pages visited, products viewed, search queries, and time spent on pages. This helps us improve our platform.',
      },
      {
        subtitle: '1.3 Transaction Data',
        text: 'For orders, we store product selections, quantities, pricing, payment method (UPI/Card/COD), and delivery tracking information. We do not store full card numbers — payments are processed via Razorpay\'s PCI-DSS-compliant gateway.',
      },
      {
        subtitle: '1.4 AI Diagnosis Data',
        text: 'Photos you upload to the AI Crop Doctor are processed to identify crop diseases. These images may be retained temporarily to improve model accuracy, but are never shared publicly or sold.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: '2.1 Order Fulfilment',
        text: 'We use your name, phone number, and address to process, pack, and deliver your orders. Your phone number is shared with our logistics partners (Delhivery, BlueDart) for delivery coordination only.',
      },
      {
        subtitle: '2.2 Personalisation',
        text: 'Based on your crop preferences and order history, we personalise product recommendations, seasonal input reminders, and advisory content from our Knowledge Hub.',
      },
      {
        subtitle: '2.3 Communications',
        text: 'We may send you order confirmations, shipping updates, and seasonal advisory messages via SMS or WhatsApp. You can opt out of marketing messages at any time by replying STOP.',
      },
      {
        subtitle: '2.4 Platform Improvement',
        text: 'Aggregated, anonymised usage data is used to improve AI diagnosis accuracy, product catalog quality, and overall platform performance.',
      },
    ],
  },
  {
    id: 'data-sharing',
    title: '3. Data Sharing and Disclosure',
    content: [
      {
        subtitle: '3.1 We Do Not Sell Your Data',
        text: 'IGO CropCare Pvt. Ltd. does not sell, rent, or trade your personal information to any third party for their own marketing purposes.',
      },
      {
        subtitle: '3.2 Service Providers',
        text: 'We share limited data with trusted service providers who assist us in operating our platform: Supabase (database hosting), Razorpay (payment processing), Delhivery/BlueDart (logistics), and Twilio/MSG91 (OTP delivery). All providers are bound by confidentiality agreements.',
      },
      {
        subtitle: '3.3 Legal Requirements',
        text: 'We may disclose information if required by law, court order, or a government authority under applicable Indian legislation including the Information Technology Act, 2000.',
      },
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: [
      {
        subtitle: '4.1 Encryption',
        text: 'All data transmissions between your device and our servers are secured using 256-bit SSL/TLS encryption. Our database is hosted on Supabase with row-level security policies ensuring your data can only be accessed by you.',
      },
      {
        subtitle: '4.2 Access Controls',
        text: 'Only authorised IGO CropCare staff with a legitimate business reason can access personal data. All internal access is logged and audited.',
      },
      {
        subtitle: '4.3 Breach Notification',
        text: 'In the unlikely event of a data breach affecting your personal information, we will notify affected users within 72 hours via registered mobile number or email, in compliance with applicable regulations.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '5. Your Rights',
    content: [
      {
        subtitle: '5.1 Access and Correction',
        text: 'You may view and update your personal information at any time by visiting the My Profile section of your account.',
      },
      {
        subtitle: '5.2 Deletion',
        text: 'You may request deletion of your account and associated data by emailing care@igo-cropcare.in. We will process your request within 30 days, except where we are legally required to retain records.',
      },
      {
        subtitle: '5.3 Portability',
        text: 'You may request a copy of your personal data in machine-readable format (JSON/CSV) by contacting our support team.',
      },
      {
        subtitle: '5.4 Opt-out',
        text: 'You can opt out of non-essential communications at any time through your Profile → Settings, or by contacting us directly.',
      },
    ],
  },
  {
    id: 'cookies',
    title: '6. Cookies and Tracking',
    content: [
      {
        subtitle: '6.1 Essential Cookies',
        text: 'We use essential cookies to maintain your session, remember your cart contents, and keep you logged in. These cannot be disabled without affecting functionality.',
      },
      {
        subtitle: '6.2 Analytics',
        text: 'We use anonymised analytics to understand page-level traffic and product popularity. No personally identifiable information is included in analytics data.',
      },
    ],
  },
  {
    id: 'children',
    title: '7. Children\'s Privacy',
    content: [
      {
        subtitle: '',
        text: 'Our platform is intended for farmers, agricultural businesses, and adults aged 18 and above. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided us with their data, please contact us immediately.',
      },
    ],
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    content: [
      {
        subtitle: '',
        text: 'We may update this Privacy Policy from time to time to reflect changes in law or our practices. When we make significant changes, we will notify registered users via SMS or email, and update the "Last Updated" date at the top of this page.',
      },
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-14 h-14 mx-auto mb-4 text-emerald-100" />
          <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-emerald-100 text-lg">
            IGO CropCare Pvt. Ltd. is committed to protecting your personal data.
          </p>
          <p className="text-emerald-200 text-sm mt-3">Last Updated: 29 May 2026 · Effective Date: 1 January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-600 font-semibold transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">Privacy Policy</span>
        </nav>

        {/* Intro card */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-gray-700 text-sm leading-relaxed">
            This Privacy Policy describes how <strong>IGO CropCare Pvt. Ltd.</strong> (&quot;IGO CropCare&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;),
            operating the platform at <strong>igo-cropcare.vercel.app</strong> and <strong>www.igo-cropcare.com</strong>, collects,
            uses, stores, and protects your personal information. By using our website, mobile platform, or placing an order,
            you agree to the practices described in this policy.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wide">Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-green-700 hover:text-green-900 hover:underline font-medium transition"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm scroll-mt-24"
            >
              <h2 className="text-xl font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">
                {section.title}
              </h2>
              <div className="space-y-5">
                {section.content.map((block, idx) => (
                  <div key={idx}>
                    {block.subtitle && (
                      <h3 className="font-bold text-gray-800 text-sm mb-1.5">{block.subtitle}</h3>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed">{block.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Card */}
        <div className="bg-green-700 text-white rounded-2xl p-8 mt-8 shadow-lg">
          <h2 className="text-xl font-extrabold mb-2">Privacy Questions or Concerns?</h2>
          <p className="text-emerald-100 text-sm mb-6">
            Our Privacy Officer is available to answer any questions about how your data is handled.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:care@igo-cropcare.in" className="flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition">
              <Mail className="w-4 h-4" /> care@igo-cropcare.in
            </a>
            <a href="tel:+917428208822" className="flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition">
              <Phone className="w-4 h-4" /> +91 74282 08822
            </a>
            <span className="flex items-center gap-2 text-sm text-emerald-100">
              <MapPin className="w-4 h-4" /> Derabassi Industrial Area, Punjab – 140507, India
            </span>
          </div>
        </div>

        {/* Related links */}
        <div className="flex gap-4 mt-6 flex-wrap text-sm">
          <Link href="/terms" className="text-green-700 font-bold hover:underline">
            Terms of Service →
          </Link>
          <Link href="/about" className="text-green-700 font-bold hover:underline">
            About IGO CropCare →
          </Link>
        </div>
      </div>
    </div>
  )
}
