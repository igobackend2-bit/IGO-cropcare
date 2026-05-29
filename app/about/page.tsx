import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sprout, ShieldCheck, Truck, Bot, Users, Award, MapPin,
  Phone, Mail, ChevronRight, Star, Building2, Leaf, Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About IGO CropCare — Our Story, Mission & Team',
  description: 'Learn about IGO CropCare — India\'s professional agri-tech commerce platform delivering verified crop inputs, AI-assisted diagnosis, and B2B procurement to modern farmers.',
}

const STATS = [
  { value: '50,000+', label: 'Farmers Served', icon: Users },
  { value: '13,000+', label: 'Dealer Partners', icon: Building2 },
  { value: '28', label: 'States Covered', icon: MapPin },
  { value: '2,500+', label: 'Products Verified', icon: ShieldCheck },
]

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Verified Quality',
    desc: 'Every product in our catalog is sourced directly from licensed manufacturers and verified for genuine composition, label accuracy, and regulatory compliance.',
    color: 'bg-blue-50 border-blue-100 text-blue-600',
  },
  {
    icon: Bot,
    title: 'AI-First Advisory',
    desc: 'Our AI Crop Doctor provides instant disease identification from photos, with treatment protocols and product recommendations validated by agronomy experts.',
    color: 'bg-purple-50 border-purple-100 text-purple-600',
  },
  {
    icon: Sprout,
    title: 'Farmer-Centric',
    desc: 'We design every feature for real Indian farmers — from Hindi language readiness to WhatsApp ordering, crop-wise catalogs, and village-level delivery.',
    color: 'bg-green-50 border-green-100 text-green-600',
  },
  {
    icon: Truck,
    title: 'Pan-India Reach',
    desc: 'Through our network of dealer partners and logistics integrations with Delhivery and BlueDart, we deliver to 28 states and 19,000+ PIN codes.',
    color: 'bg-orange-50 border-orange-100 text-orange-600',
  },
]

const MILESTONES = [
  { year: '2021', title: 'Founded', desc: 'IGO CropCare incorporated in Derabassi, Punjab, with a mission to bring genuine agri-inputs online.' },
  { year: '2022', title: 'First 1,000 Orders', desc: 'Launched the B2C platform serving wheat and paddy farmers across Punjab and Haryana.' },
  { year: '2023', title: 'AI Doctor Launched', desc: 'Released the first version of the AI Crop Disease Detector, processing over 50,000 diagnoses in year one.' },
  { year: '2024', title: 'B2B Network', desc: 'Onboarded 5,000+ dealer partners across 18 states, enabling bulk procurement and credit facilities.' },
  { year: '2025', title: '₹500 Cr+ GMV', desc: 'Achieved ₹500 Crore annual Gross Merchandise Value, becoming one of India\'s fastest-growing agri-input platforms.' },
  { year: '2026', title: 'Next-Gen Platform', desc: 'Launched the redesigned platform with AI-powered crop calendars, B2B quote builder, and real-time market pricing.' },
]

const CERTIFICATIONS = [
  'CIB & RC Licensed Dealer',
  'GST Registered Business',
  'ISO 9001:2015 Compliant',
  'Startup India Recognised',
  'APEDA Registered',
]

const TEAM = [
  { name: 'Gurpreet Singh', role: 'Founder & CEO', bg: 'from-green-500 to-emerald-600', initials: 'GS' },
  { name: 'Dr. Ramesh Kumar', role: 'Chief Agronomist', bg: 'from-blue-500 to-indigo-600', initials: 'RK' },
  { name: 'Priya Verma', role: 'Head of Technology', bg: 'from-purple-500 to-violet-600', initials: 'PV' },
  { name: 'Arun Sharma', role: 'VP, B2B & Dealer Network', bg: 'from-orange-500 to-amber-600', initials: 'AS' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-green-800 via-emerald-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1464226184081-280282069fda?w=1920&h=600&fit=crop"
            alt="Agriculture background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-emerald-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Leaf className="w-3.5 h-3.5" /> India&apos;s Professional Agri-Tech Platform
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Growing Indian Agriculture<br />
            <span className="text-emerald-300">with Technology & Trust</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
            IGO CropCare is an agri-tech commerce platform on a mission to make 100% genuine crop inputs,
            AI-powered disease diagnosis, and expert advisory accessible to every Indian farmer — whether
            they farm 1 acre or 1,000 acres.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/products" className="bg-white text-green-800 font-extrabold px-6 py-3 rounded-xl shadow-lg hover:bg-emerald-50 transition">
              Shop Farm Inputs
            </Link>
            <Link href="/b2b" className="border-2 border-white/40 text-white font-extrabold px-6 py-3 rounded-xl hover:bg-white/10 transition">
              B2B Partnership
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-7 h-7 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-green-600 font-semibold transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">About Us</span>
        </nav>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-5 leading-tight">
              Empowering Every Farmer with Precision & Intelligence
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Indian agriculture is evolving rapidly. But for millions of farmers, access to
                <strong> genuine crop inputs</strong>, reliable agronomic advice, and organised procurement
                remains a challenge. Fake products, inflated prices, and delayed decisions cost farmers
                thousands of crores in yield loss every year.
              </p>
              <p>
                IGO CropCare was built to fix this. We connect farmers directly with verified manufacturers,
                deploy AI to assist with disease identification, and build transparent supply chains through
                our dealer and B2B network — eliminating counterfeit risk and information gaps at the field level.
              </p>
              <p>
                Our platform is designed for the practical realities of Indian farming: seasonal urgency,
                multiple crop types, regional language needs, and the trust that comes from face-to-face
                dealer relationships now reinforced by digital traceability.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-video">
            <Image
              src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=500&fit=crop"
              alt="Farmer using IGO CropCare"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest">What Drives Us</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val) => (
              <div key={val.title} className={`bg-white border rounded-2xl p-6 shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${val.color}`}>
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest">Our Journey</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Milestones</h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-green-100 hidden lg:block" />
          <div className="space-y-8">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`flex flex-col lg:flex-row items-start lg:items-center gap-4 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm inline-block max-w-sm">
                    <div className="text-green-600 font-extrabold text-sm mb-1">{m.year}</div>
                    <h3 className="font-extrabold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
                <div className="hidden lg:flex w-10 h-10 bg-green-600 text-white rounded-full items-center justify-center font-extrabold text-xs shadow-lg z-10 flex-shrink-0">
                  {m.year.slice(2)}
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest">The People Behind IGO</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Leadership Team</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.bg} text-white flex items-center justify-center text-2xl font-extrabold mx-auto mb-3 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">{member.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest">Compliance & Trust</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Our Certifications</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert} className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-5 py-3 shadow-sm">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm font-bold text-gray-800">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings / Trust Signal */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-yellow-400 font-extrabold ml-1">4.8 / 5</span>
              </div>
              <h2 className="text-3xl font-extrabold mb-3">Rated by 50,000+ Indian Farmers</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                From paddy farmers in Punjab to chilli growers in Andhra Pradesh, our customers consistently rate IGO CropCare
                for product genuineness, fast delivery, and responsive support.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-6 rounded-xl transition text-center flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Shop Farm Inputs
              </Link>
              <Link href="/crop-doctor" className="border border-gray-600 hover:border-gray-400 text-white font-bold py-3 px-6 rounded-xl transition text-center flex items-center justify-center gap-2">
                <Bot className="w-4 h-4" /> Try AI Crop Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact / CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl text-center">
          <h2 className="text-3xl font-extrabold mb-3">Get in Touch</h2>
          <p className="text-emerald-100 text-sm mb-8 max-w-lg mx-auto">
            Whether you&apos;re a farmer, dealer, or agri-entrepreneur — we&apos;re here to help you grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="mailto:care@igo-cropcare.in" className="flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition">
              <Mail className="w-5 h-5" /> care@igo-cropcare.in
            </a>
            <a href="tel:+917428208822" className="flex items-center gap-2 text-sm text-emerald-100 hover:text-white transition">
              <Phone className="w-5 h-5" /> +91 74282 08822
            </a>
            <span className="flex items-center gap-2 text-sm text-emerald-100">
              <MapPin className="w-5 h-5" /> Derabassi Industrial Area, Punjab – 140507
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
