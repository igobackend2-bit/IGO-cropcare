"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === "Admin@123") {
        document.cookie = "adminAuth=true; path=/; max-age=86400";
        toast.success("Welcome to Admin Dashboard!");
        router.push("/admin");
      } else {
        toast.error("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background — same farm image as customer login */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85"
          alt="Agriculture background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-green-900/80" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />

          <div className="p-8 md:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-green-900/30">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">IGO CropCare</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <p className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Secured Admin Portal
                </p>
              </div>
            </div>

            {/* Welcome text */}
            <div className="text-center mb-7">
              <h2 className="text-xl font-bold text-white">Welcome Back, Admin</h2>
              <p className="text-white/50 text-sm mt-1">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-white/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500/60 transition-all"
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-green-900/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Access Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-4">
              {['100% Secure', 'Encrypted', 'Admin Only'].map((badge) => (
                <div key={badge} className="flex items-center gap-1 text-white/40 text-xs font-semibold">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/30 text-xs mt-6">
          Restricted access. Unauthorized use is prohibited.
        </p>
        <p className="text-center mt-2">
          <a href="/" className="text-green-400/70 hover:text-green-400 text-xs transition">
            ← Back to IGO CropCare Store
          </a>
        </p>
      </div>
    </div>
  );
}
