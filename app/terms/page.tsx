import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail, Phone, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — IGO CropCare',
  description: 'Terms and conditions governing the use of the IGO CropCare agri-commerce platform, product purchases, and services.',
}

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    paragraphs: [
      'By accessing or using the IGO CropCare platform (website, mobile website, or any related service), you agree to be legally bound by these Terms of Service ("Terms"). If you do not agree, please do not use our platform.',
      'These Terms apply to all visitors, registered users, buyers, and B2B partners. IGO CropCare Pvt. Ltd. reserves the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    paragraphs: [
      'You must be at least 18 years of age and a resident of India to register an account and place orders. By creating an account, you represent that all information you provide is accurate and complete.',
      'Business accounts (B2B/dealer registration) must be legally registered entities in India. IGO CropCare may require GST number, business registration certificate, or other documentation for B2B account verification.',
    ],
  },
  {
    id: 'products',
    title: '3. Products and Services',
    paragraphs: [
      'IGO CropCare offers a catalog of verified agricultural inputs including seeds, fertilizers, pesticides, bio-inputs, and farm equipment. All products are sourced from licensed manufacturers and registered dealers.',
      'Product descriptions, images, and specifications are provided for informational purposes. While we strive for accuracy, minor variations in packaging or composition may occur. Always read the manufacturer\'s label before use.',
      'Agrochemical products (insecticides, herbicides, fungicides) are regulated under the Insecticides Act, 1968. You agree to use all purchased products in accordance with applicable law, recommended dosages, and safety guidelines.',
      'The AI Crop Doctor tool provides indicative diagnoses and product recommendations. It is not a substitute for advice from a certified agronomist. IGO CropCare does not guarantee crop outcomes based on AI recommendations.',
    ],
  },
  {
    id: 'pricing',
    title: '4. Pricing and Payment',
    paragraphs: [
      'All prices displayed are in Indian Rupees (INR) and include applicable GST unless stated otherwise. Prices are subject to change without prior notice; however, the price at the time of checkout is the price you pay.',
      'We accept payments via Razorpay (UPI, credit/debit cards, net banking, wallets) and Cash on Delivery (COD) for eligible PIN codes. COD availability is subject to our logistics partners\' serviceability.',
      'For B2B buyers with approved credit terms, invoices are payable within the agreed period (30 or 60 days). Late payments may attract interest at 18% per annum.',
      'Promotional codes and discounts are subject to individual offer terms and cannot be combined unless explicitly stated.',
    ],
  },
  {
    id: 'ordering',
    title: '5. Orders and Delivery',
    paragraphs: [
      'Placing an order constitutes an offer to purchase. IGO CropCare may accept or decline any order at our discretion. An order is confirmed when you receive an SMS/WhatsApp order confirmation.',
      'We aim to dispatch orders within 1 business day. Estimated delivery timelines are 3–7 business days depending on your location. Remote areas may take longer.',
      'Risk of loss or damage transfers to you upon delivery confirmation from our logistics partner. Ensure someone is available to receive the order at the specified address.',
      'IGO CropCare is not liable for delays caused by acts of nature, transportation strikes, government restrictions, or any other circumstances beyond our reasonable control.',
    ],
  },
  {
    id: 'returns',
    title: '6. Returns, Refunds and Cancellations',
    paragraphs: [
      'You may cancel your order within 2 hours of placing it, before dispatch confirmation, by contacting our support team. Once dispatched, cancellation is not possible.',
      'We accept returns for products that are damaged in transit, expired at time of delivery, or incorrectly dispatched (wrong product/quantity). Return requests must be raised within 48 hours of delivery with photo evidence.',
      'Opened pesticide sachets, seeds packs, or hygiene-sensitive products cannot be returned unless they are defective.',
      'Approved refunds are processed within 5–7 business days to the original payment method. COD refunds are processed via NEFT to your registered bank account.',
      'For B2B bulk orders, returns and replacements are governed by the separate Dealer Agreement.',
    ],
  },
  {
    id: 'account',
    title: '7. User Account Responsibilities',
    paragraphs: [
      'You are responsible for maintaining the confidentiality of your account OTP and session. Do not share your OTP with anyone, including IGO CropCare staff (we will never ask for your OTP).',
      'You agree not to use the platform to: (a) place fraudulent orders; (b) resell products purchased at retail prices without proper dealer authorisation; (c) submit false crop disease reports or manipulate the AI system; (d) harass or threaten our support staff.',
      'IGO CropCare reserves the right to suspend or terminate accounts that violate these Terms without prior notice.',
    ],
  },
  {
    id: 'ip',
    title: '8. Intellectual Property',
    paragraphs: [
      'All content on the IGO CropCare platform — including text, images, product descriptions, AI recommendations, advisory articles, logos, and software — is owned by IGO CropCare Pvt. Ltd. or its licensors.',
      'You may not reproduce, distribute, or use our content for commercial purposes without written permission.',
    ],
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    paragraphs: [
      'IGO CropCare\'s liability for any claim arising from a purchase is limited to the value of the specific order giving rise to the claim. We are not liable for indirect, incidental, or consequential damages including crop loss, income loss, or loss of data.',
      'Use of the AI Crop Doctor, market price tracker, and knowledge hub content is at your own risk. These tools are informational aids and do not replace professional agronomic advice.',
    ],
  },
  {
    id: 'governing-law',
    title: '10. Governing Law and Dispute Resolution',
    paragraphs: [
      'These Terms are governed by the laws of India. Any dispute shall first be attempted to be resolved through mutual negotiation within 30 days.',
      'If unresolved, disputes shall be subject to arbitration under the Arbitration and Conciliation Act, 1996, conducted in Chandigarh, Punjab. The arbitration shall be conducted in English.',
      'For consumer disputes, you may also approach the Consumer Disputes Redressal Commission as per the Consumer Protection Act, 2019.',
    ],
  },
  {
    id: 'contact-legal',
    title: '11. Contact for Legal Matters',
    paragraphs: [
      'For any legal inquiries, notices, or formal complaints, contact: IGO CropCare Pvt. Ltd., Derabassi Industrial Area, Punjab – 140507, India. Email: care@igo-cropcare.in.',
    ],
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FileText className="w-14 h-14 mx-auto mb-4 text-gray-300" />
          <h1 className="text-4xl font-extrabold mb-3">Terms of Service</h1>
          <p className="text-gray-300 text-lg">
            Please read these terms carefully before using IGO CropCare.
          </p>
          <p className="text-gray-400 text-sm mt-3">Last Updated: 29 May 2026 · Effective Date: 1 January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-600 font-semibold transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">Terms of Service</span>
        </nav>

        {/* Summary card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-amber-900 text-sm leading-relaxed">
            <strong>Summary:</strong> These Terms govern your use of IGO CropCare — an agri-tech commerce platform.
            By using the platform, you agree to comply with applicable laws, use products responsibly, and resolve disputes
            through the processes described below. This is a binding legal agreement.
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
              <div className="space-y-4">
                {section.paragraphs.map((para, idx) => (
                  <p key={idx} className="text-gray-600 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Card */}
        <div className="bg-slate-800 text-white rounded-2xl p-8 mt-8 shadow-lg">
          <h2 className="text-xl font-extrabold mb-2">Need Clarification?</h2>
          <p className="text-gray-300 text-sm mb-6">
            If you have any questions about these Terms, our team is available to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:care@igo-cropcare.in" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
              <Mail className="w-4 h-4" /> care@igo-cropcare.in
            </a>
            <a href="tel:+917428208822" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
              <Phone className="w-4 h-4" /> +91 74282 08822
            </a>
          </div>
        </div>

        {/* Related links */}
        <div className="flex gap-4 mt-6 flex-wrap text-sm">
          <Link href="/privacy" className="text-green-700 font-bold hover:underline">
            Privacy Policy →
          </Link>
          <Link href="/about" className="text-green-700 font-bold hover:underline">
            About IGO CropCare →
          </Link>
        </div>
      </div>
    </div>
  )
}
