import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Sprout, TrendingUp } from 'lucide-react'
import OTPAuth from '@/components/auth/OTPAuth'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-emerald-900 text-white flex-col justify-between overflow-hidden">
        {/* Background Image with Overlay */}
        <Image
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
          alt="Lush green farm"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        
        {/* Top Branding */}
        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-emerald-200 transition">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <div className="mt-12">
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Empowering <br />
              <span className="text-emerald-400">Farmers</span> Worldwide.
            </h1>
            <p className="mt-6 text-lg text-emerald-100 max-w-md font-medium leading-relaxed">
              Join millions of successful farmers who trust CropCare for genuine products, AI diagnosis, and expert guidance.
            </p>
          </div>
        </div>

        {/* Bottom Stats/Features */}
        <div className="relative z-10 p-12 bg-gradient-to-t from-emerald-950/90 to-transparent">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <ShieldCheck size={24} className="text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">100% Genuine</p>
                <p className="text-emerald-200 text-sm font-medium">Certified Products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Sprout size={24} className="text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Free AI Doctor</p>
                <p className="text-emerald-200 text-sm font-medium">Instant Diagnosis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Back Button & Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition mb-6">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">Enter your details to access your account</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-3 text-base font-medium">Please enter your phone number to continue securely.</p>
          </div>

          {/* OTP Component Wrapper */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 sm:p-4">
            <OTPAuth />
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-medium text-gray-400">
              By logging in, you agree to our{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 underline-offset-2">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 underline-offset-2">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
