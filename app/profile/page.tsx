'use client'


import Footer from '@/components/layout/Footer'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { User, MapPin, Phone, Mail, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuthStore()

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    redirect('/login')
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <>
      

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.first_name || 'Farmer'} {user?.last_name || 'User'}
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold"
                >
                  Profile
                </Link>
                <Link href="/profile/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  My Orders
                </Link>
                <Link href="/profile/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Wishlist
                </Link>
                <Link href="/profile/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <Link href="/profile/edit" className="text-green-600 hover:text-green-700 font-semibold">
                  Edit
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">First Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.first_name || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Last Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.last_name || '-'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Delivery Address
                </h2>
                <Link href="/profile/edit" className="text-green-600 hover:text-green-700 font-semibold">
                  Edit
                </Link>
              </div>

              {user?.address ? (
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                  <p className="text-lg font-semibold text-gray-900">{user.address}</p>
                  <p className="text-gray-600 mt-2">
                    {user.city}, {user.state} - {user.pincode}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
                  <p className="text-gray-600">No address added yet</p>
                  <Link
                    href="/profile/edit"
                    className="text-green-600 hover:text-green-700 font-semibold mt-2 inline-block"
                  >
                    Add Address →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-gray-600 mt-2">Total Orders</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-gray-600 mt-2">Wishlist Items</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-gray-600 mt-2">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
