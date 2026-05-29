import HeroDiagnosisWidget from '@/components/sections/HeroDiagnosisWidget';
import CustomerTestimonials from '@/components/sections/CustomerTestimonials';
import {
  ArrowRight, BadgeCheck, Bot,
  Flame, Package, Phone,
  ShieldCheck, Sprout, Star, Truck, Users, Zap,
  ShoppingCart, AlertTriangle, CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/* ─────────────────────────────── GENERIC DATA ─────────────────────────────── */

const HOW_IT_WORKS = [
  {
    step: '01',
    emoji: '📸',
    title: 'Upload Crop Photo',
    desc: 'Simply snap a photo of the affected plant or describe the symptoms in plain language.',
    color: 'from-emerald-400 to-green-600',
    bg: 'bg-emerald-50 border-emerald-100',
  },
  {
    step: '02',
    emoji: '🤖',
    title: 'AI Instant Diagnosis',
    desc: 'Our advanced AI scans hundreds of diseases and provides an accurate diagnosis in seconds.',
    color: 'from-blue-400 to-indigo-600',
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    step: '03',
    emoji: '💊',
    title: 'Get the Solution',
    desc: 'Receive exact product recommendations, dosages, and application steps. Order instantly.',
    color: 'from-orange-400 to-amber-600',
    bg: 'bg-orange-50 border-orange-100',
  },
];

const FLASH_DEALS = [
  { id: 'fd1', name: 'Premium Copper Fungicide WP', brand: 'AgriTech Solutions', category: 'Fungicide', price: 599, mrp: 850, discount: 29, rating: 4.8, reviews: 1204, badge: '🔥 Flash Deal', stock: 'Only 12 left', image: '/products/fungicide_copper.png', href: '/products?category=fungicides' },
  { id: 'fd2', name: 'NPK 19:19:19 Water Soluble Fertilizer', brand: 'EcoGrow', category: 'Fertilizer', price: 349, mrp: 550, discount: 37, rating: 4.9, reviews: 3218, badge: '⭐ Best Seller', stock: 'Fast Moving', image: '/products/fertilizer_npk.png', href: '/products?category=fertilizers' },
  { id: 'fd3', name: 'Broad Spectrum Insecticide 100ml', brand: 'CropGuard', category: 'Insecticide', price: 139, mrp: 220, discount: 37, rating: 4.7, reviews: 642, badge: '⚡ Top Deal', stock: '28 sold today', image: '/products/insecticide_bottle.png', href: '/products?category=insecticides' },
  { id: 'fd4', name: 'F1 Hybrid Tomato Seeds (High Yield)', brand: 'SeedMaster', category: 'Seeds', price: 1099, mrp: 1525, discount: 28, rating: 4.8, reviews: 877, badge: '🌱 Premium', stock: 'Limited Stock', image: '/products/seeds_tomato.png', href: '/products?category=seeds' },
  { id: 'fd5', name: 'Pure Cold Pressed Neem Oil', brand: 'NatureCare', category: 'Organic', price: 399, mrp: 599, discount: 33, rating: 4.6, reviews: 523, badge: '🌿 Organic', stock: 'In Stock', image: '/products/neem_oil.png', href: '/products?category=organic' },
  { id: 'fd6', name: 'Systemic Root Fungicide', brand: 'PlantShield', category: 'Fungicide', price: 89, mrp: 111, discount: 20, rating: 4.5, reviews: 990, badge: '💰 Value Pack', stock: 'In Stock', image: '/products/fungicide_root.png', href: '/products?category=fungicides' },
];

const PESTS_DISEASES = [
  { name: 'Aphids & Whitefly', emoji: '🦟', href: '/products?pest=aphids', color: 'bg-white border-gray-100 hover:border-red-300 hover:shadow-md' },
  { name: 'Leaf Blight', emoji: '🍂', href: '/products?disease=blight', color: 'bg-white border-gray-100 hover:border-orange-300 hover:shadow-md' },
  { name: 'Powdery Mildew', emoji: '⬜', href: '/products?disease=powdery-mildew', color: 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md' },
  { name: 'Stem Borer', emoji: '🐛', href: '/products?pest=stem-borer', color: 'bg-white border-gray-100 hover:border-yellow-300 hover:shadow-md' },
  { name: 'Root Rot', emoji: '🌱', href: '/products?disease=root-rot', color: 'bg-white border-gray-100 hover:border-amber-300 hover:shadow-md' },
  { name: 'Leaf Miner', emoji: '🔬', href: '/products?pest=leaf-miner', color: 'bg-white border-gray-100 hover:border-lime-300 hover:shadow-md' },
];

const CROPS = [
  { name: 'Paddy / Rice', emoji: '🌾', href: '/products?crop=paddy' },
  { name: 'Tomato', emoji: '🍅', href: '/products?crop=tomato' },
  { name: 'Cotton', emoji: '☁️', href: '/products?crop=cotton' },
  { name: 'Chilli', emoji: '🌶️', href: '/products?crop=chilli' },
  { name: 'Wheat', emoji: '🌻', href: '/products?crop=wheat' },
  { name: 'Sugarcane', emoji: '🎋', href: '/products?crop=sugarcane' },
  { name: 'Onion', emoji: '🧅', href: '/products?crop=onion' },
  { name: 'Maize', emoji: '🌽', href: '/products?crop=maize' },
  { name: 'Potato', emoji: '🥔', href: '/products?crop=potato' },
  { name: 'Grapes', emoji: '🍇', href: '/products?crop=grapes' },
  { name: 'Soybean', emoji: '🫘', href: '/products?crop=soybean' },
  { name: 'All Crops →', emoji: '🌿', href: '/products' },
];

const SOLUTION_KITS = [
  {
    name: 'Tomato Complete Protection Kit',
    desc: 'Fungicide + Insecticide + Micronutrient + Foliar spray — complete kharif season coverage.',
    items: ['Systemic Fungicide 100g', 'Insect Control 10ml', 'NPK 19:19:19 500g', 'Micronutrient Mix 100g'],
    price: 1299,
    mrp: 1950,
    saving: 651,
    badge: '🍅 Most Popular',
    color: 'bg-white border-orange-100',
    accent: 'text-orange-700 bg-orange-100',
  },
  {
    name: 'Paddy Kharif Starter Kit',
    desc: 'AI-recommended bundle for paddy sowing season — prevents stem borer and blight.',
    items: ['Seed Treatment Fungicide', 'Pest Control 100ml', 'DAP Fertilizer 1kg', 'Bio-Fungicide 500g'],
    price: 949,
    mrp: 1480,
    saving: 531,
    badge: '🌾 Kharif Ready',
    color: 'bg-white border-amber-100',
    accent: 'text-amber-800 bg-amber-100',
  },
  {
    name: 'Organic Farm Booster Kit',
    desc: '100% chemical-free kit — bio-fungicide, neem oil, biofertilizer and seaweed extract.',
    items: ['Neem Oil 500ml', 'Bio Fungicide 500g', 'Liquid Biofertilizer 1L', 'Seaweed Extract 250ml'],
    price: 1099,
    mrp: 1699,
    saving: 600,
    badge: '🌿 Organic Certified',
    color: 'bg-white border-emerald-100',
    accent: 'text-emerald-800 bg-emerald-100',
  },
];

const CATEGORIES = [
  { name: 'Premium Seeds', emoji: '🌱', href: '/products?category=seeds', bg: 'bg-green-50 text-green-600' },
  { name: 'Fertilizers', emoji: '🧪', href: '/products?category=fertilizers', bg: 'bg-blue-50 text-blue-600' },
  { name: 'Insecticides', emoji: '🐛', href: '/products?category=insecticides', bg: 'bg-red-50 text-red-600' },
  { name: 'Fungicides', emoji: '🍄', href: '/products?category=fungicides', bg: 'bg-amber-50 text-amber-600' },
  { name: 'Herbicides', emoji: '🌿', href: '/products?category=herbicides', bg: 'bg-lime-50 text-lime-600' },
  { name: 'Bio / Organic', emoji: '🌍', href: '/products?category=organic', bg: 'bg-teal-50 text-teal-600' },
  { name: 'Sprayers & Tools', emoji: '💦', href: '/products?category=implements', bg: 'bg-cyan-50 text-cyan-600' },
  { name: 'Garden Care', emoji: '🌸', href: '/products?category=garden', bg: 'bg-pink-50 text-pink-600' },
];

/* ══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-gray-900 pb-16 md:pb-0">

      {/* ═══ PREMIUM LIGHT HERO ═════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 lg:pt-24 lg:pb-32 overflow-hidden bg-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_agritech.png"
            alt="Futuristic agricultural field"
            fill priority sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/50 to-white/95" />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl hidden sm:block" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl hidden sm:block" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold text-emerald-800 shadow-sm sm:px-5 sm:py-2 sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Next-Generation Agriculture Platform
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Empowering Farmers with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 mt-1 sm:mt-2">
              Precision & Intelligence
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg md:text-xl font-medium">
            Get 100% genuine products, free AI crop diagnosis, and expert agricultural guidance delivered right to your farm.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <Link href="/products" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl sm:px-8 sm:py-3.5">
              Shop Farm Inputs
            </Link>
            <Link href="/crop-doctor" className="flex items-center gap-2 rounded-full border-2 border-emerald-100 bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 sm:px-8 sm:py-3.5">
              <Bot size={18} /> Try Free AI Doctor
            </Link>
          </div>

          <div className="mt-10 w-full max-w-3xl sm:mt-16">
            <HeroDiagnosisWidget />
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 w-full max-w-lg sm:flex sm:flex-wrap sm:justify-center sm:gap-8 sm:max-w-none md:gap-16">
            {[
              { label: 'Certified Quality', icon: <ShieldCheck className="text-emerald-500" /> },
              { label: 'Fast Farm Delivery', icon: <Truck className="text-emerald-500" /> },
              { label: '24/7 Expert Support', icon: <Phone className="text-emerald-500" /> },
              { label: 'Secure Payments', icon: <BadgeCheck className="text-emerald-500" /> },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center justify-center gap-2 text-xs font-bold text-gray-700 sm:justify-start sm:text-sm">
                {feature.icon}
                {feature.label}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ CATEGORIES SHOWCASE ════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-white lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="mt-3 text-gray-500 font-medium">Everything you need for a successful harvest</p>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map((c) => (
              <Link key={c.name} href={c.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 sm:gap-4 sm:p-6">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.bg} text-xl transition-transform group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl`}>
                  {c.emoji}
                </div>
                <span className="text-[10px] font-bold text-center text-gray-800 leading-tight sm:text-xs">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FLASH DEALS ════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-slate-50 border-y border-gray-100 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500 text-white">
                  <Flame size={14} />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-red-600">Hot Deals</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900">
                Limited Time Offers
              </h2>
            </div>
            <Link href="/products?filter=deals"
              className="group flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700">
              View All Offers <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-4">
            {FLASH_DEALS.map((p) => (
              <Link key={p.id} href={p.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100">
                <div className="relative h-36 w-full bg-white flex items-center justify-center p-3 sm:h-48 sm:p-4">
                  <div className="relative h-full w-full">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, 17vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-black text-white shadow-sm">
                    -{p.discount}%
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <p className="mb-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 sm:text-[10px]">{p.brand}</p>
                  <p className="mb-1.5 text-[11px] font-bold text-gray-900 line-clamp-2 leading-snug sm:text-xs sm:mb-2">{p.name}</p>
                  <div className="mb-2 flex items-center gap-1 sm:mb-3 sm:gap-1.5">
                    <span className="text-[10px] font-black text-yellow-500 sm:text-xs">★ {p.rating}</span>
                    <span className="text-[9px] text-gray-400 font-medium sm:text-[10px]">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-base font-black text-gray-900 tracking-tight sm:text-lg">₹{p.price}</p>
                      <p className="text-[9px] font-bold text-gray-400 line-through sm:text-[10px]">₹{p.mrp}</p>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white sm:h-8 sm:w-8">
                      <ShoppingCart size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS / AI SECTION ══════════════════════════════════ */}
      <section className="py-14 px-4 bg-white lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-600">
                <Bot size={14} /> Free AI Tool
              </div>
              <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-gray-900 md:text-5xl">
                Diagnose Crop Issues in Seconds.
              </h2>
              <p className="mb-8 text-lg text-gray-600 font-medium leading-relaxed">
                No waiting for agronomists. Upload a photo or describe the problem. Our agricultural AI instantly identifies the disease and provides the exact treatment protocol.
              </p>
              
              <div className="space-y-6">
                {HOW_IT_WORKS.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-md text-xl`}>
                      {s.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/crop-doctor" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 hover:-translate-y-0.5">
                  Start Free Diagnosis <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative">
              {/* Premium image wrapper */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-[4/4] lg:aspect-[4/5] lg:rounded-[2.5rem]">
                <Image 
                  src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=1000&fit=crop" 
                  alt="Farmer using phone" 
                  fill className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/95 backdrop-blur p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">Late Blight Detected</p>
                      <p className="text-xs font-bold text-gray-500">98% Confidence</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-800">Action: Apply Copper Fungicide WP immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION KITS ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-emerald-900 text-white lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-emerald-800 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-200 border border-emerald-700">
              Complete Protection
            </span>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
              Curated Crop Solution Kits
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-emerald-100/80 font-medium">
              Expert-designed input packages for the entire season. Get better yields and save money.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SOLUTION_KITS.map((kit) => (
              <div key={kit.name} className="flex flex-col rounded-3xl bg-white text-gray-900 p-8 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/50">
                <div className="mb-5 flex items-start justify-between">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${kit.accent}`}>
                    {kit.badge}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-700">
                    Save ₹{kit.saving}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-black text-gray-900 tracking-tight">{kit.name}</h3>
                <p className="mb-6 text-sm text-gray-500 font-medium leading-relaxed">{kit.desc}</p>
                <div className="mb-8 space-y-2 flex-1">
                  {kit.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto border-t border-gray-100 pt-6">
                  <div className="mb-5 flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-gray-900">₹{kit.price}</span>
                    <span className="text-sm font-bold text-gray-400 line-through">₹{kit.mrp}</span>
                  </div>
                  <Link href="/products?filter=kits"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-600">
                    <Package size={16} /> View Kit Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SHOP BY CROP ════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-white border-b border-gray-100 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Shop by Crop</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 sm:gap-3">
            {CROPS.map((c) => (
              <Link key={c.name} href={c.href}
                className="group flex items-center gap-2 rounded-xl border border-gray-100 bg-slate-50 p-3 transition-all hover:border-emerald-200 hover:bg-white hover:shadow-md sm:justify-center sm:gap-3 sm:rounded-2xl sm:p-4">
                <span className="text-xl transition-transform duration-300 group-hover:scale-110 sm:text-2xl">{c.emoji}</span>
                <span className="text-xs font-bold text-gray-800">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST STATS ════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-emerald-600 text-white lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '50,000+', label: 'Farmers Served', icon: <Users size={28} className="text-emerald-200" /> },
              { value: '500+', label: 'Verified Products', icon: <ShieldCheck size={28} className="text-emerald-200" /> },
              { value: '100+', label: 'Cities Covered', icon: <Sprout size={28} className="text-emerald-200" /> },
              { value: '4.8★', label: 'Average Rating', icon: <Star size={28} className="text-emerald-200" /> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2 py-4">
                {stat.icon}
                <p className="text-3xl font-black tracking-tight md:text-4xl">{stat.value}</p>
                <p className="text-sm font-medium text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUSTOMER TESTIMONIALS ══════════════════════════════════════ */}
      <CustomerTestimonials />

      {/* ═══ NEWSLETTER / SMS SIGNUP ════════════════════════════════════ */}
      <section className="py-14 px-4 bg-slate-50 border-t border-gray-100 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-700">
            <Zap size={13} /> Free Seasonal Advisories
          </div>
          <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Get Crop Tips & Exclusive Deals — Free
          </h2>
          <p className="mt-3 text-gray-500 font-medium">
            Join 50,000+ farmers. Get weekly crop advisories, pest alerts, and exclusive discounts in your WhatsApp.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="tel"
              placeholder="Enter your WhatsApp number"
              className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:rounded-r-none sm:rounded-l-full"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 sm:rounded-l-none sm:rounded-r-full"
            >
              Subscribe Free
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime. Crop info in your language.</p>
        </div>
      </section>

    </main>
  );
}
