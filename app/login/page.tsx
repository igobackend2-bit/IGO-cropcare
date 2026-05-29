import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Leaf, ShieldCheck, Truck, Star } from 'lucide-react'
import OTPAuth from '@/components/auth/OTPAuth'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* Full-screen farm background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85"
          alt="Farm background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-green-900/70 to-black/60" />
      </div>

      {/* Back to home — top left */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Brand watermark — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center hidden sm:block">
        <div className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-extrabold text-sm uppercase tracking-widest leading-none">IGO CropCare</p>
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em]">Premium Agri Inputs</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card header with brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3 sm:hidden">
            <div className="w-9 h-9 bg-emerald-400 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-extrabold text-base uppercase tracking-wider leading-none">IGO CropCare</p>
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">Premium Agri Inputs</p>
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium">
            Login or create your farmer account
          </p>
        </div>

        {/* Login / Join tab card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="py-4 text-center bg-emerald-600">
              <span className="text-white font-extrabold text-sm uppercase tracking-widest">Login</span>
            </div>
            <div className="py-4 text-center bg-gray-50">
              <span className="text-gray-400 font-extrabold text-sm uppercase tracking-widest">Join</span>
            </div>
          </div>

          {/* OTP Auth form */}
          <div className="p-6 sm:p-8">
            <p className="text-xs text-gray-400 font-medium text-center mb-5">
              Enter your phone number to receive a secure OTP
            </p>
            <OTPAuth />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: '100% Genuine', sub: 'Certified Products' },
            { icon: Truck, label: 'Fast Delivery', sub: 'Pan India' },
            { icon: Star, label: '4.8 Rated', sub: 'By Farmers' },
          ].map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-3 border border-white/20 text-center"
            >
              <b.icon className="w-5 h-5 text-emerald-300" />
              <p className="text-white font-bold text-xs leading-none">{b.label}</p>
              <p className="text-white/60 text-[10px]">{b.sub}</p>
            </div>
          ))}
        </div>

        {/* Terms */}
        <p className="text-center text-[11px] text-white/50 mt-5 font-medium">
          By continuing you agree to our{' '}
          <a href="#" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
