'use client'


import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/lib/store'
import { updateUserProfile } from '@/lib/supabase/db'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { User, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react'

export default function EditProfilePage() {
  const { user, isLoggedIn, setUser } = useAuthStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      redirect('/login')
    }
  }, [isLoggedIn])

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)

  // Populate data when user object is available
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const updated = await updateUserProfile(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      })

      if (updated) {
        setUser(updated)
        toast.success('Profile updated successfully!')
        window.location.href = '/profile'
      } else {
        toast.error('Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Link href="/profile" className="p-2 bg-white rounded-lg hover:bg-gray-100 shadow transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" /> Phone Number (Login)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <span className="text-xs text-gray-400 mt-1 block">Phone numbers cannot be changed.</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 pt-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Plot No., Street, Village, Area details..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City/Town</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit postal code"
                  maxLength={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
              <Link
                href="/profile"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}
