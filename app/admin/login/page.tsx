"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Admin@123") {
      // Set a simple cookie for middleware to check
      document.cookie = "adminAuth=true; path=/; max-age=86400"; // 1 day expiration
      toast.success("Login successful!");
      router.push("/admin");
    } else {
      toast.error("Incorrect password!");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/30">
          <Sprout className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">IGO CropCare</h1>
        <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mt-1">
          Admin Portal
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Admin Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all placeholder:text-slate-400"
            placeholder="Enter password..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
        >
          Access Dashboard
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          This portal is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}
