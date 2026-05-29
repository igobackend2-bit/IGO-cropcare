'use client'


import { useAuthStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, Settings, Bell, Globe, Shield, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, isLoggedIn, logout } = useAuthStore()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      redirect('/login')
    }
  }, [isLoggedIn])

  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: true,
    whatsapp_updates: false,
    language: 'english',
    two_factor: false,
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const local = localStorage.getItem('cc_settings')
    if (local) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings(JSON.parse(local))
    }
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] as any }
      localStorage.setItem('cc_settings', JSON.stringify(updated))
      return updated
    })
    toast.success('Preference updated')
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSettings((prev) => {
      const updated = { ...prev, language: value }
      localStorage.setItem('cc_settings', JSON.stringify(updated))
      return updated
    })
    toast.success(`Language set to ${value.toUpperCase()}`)
  }

  const handleDeleteAccount = () => {
    const confirm = window.confirm('Are you absolutely sure you want to delete your CropCare account? This action is irreversible.')
    if (confirm) {
      toast.success('Account successfully deactivated')
      logout()
      window.location.href = '/'
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <>
      

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
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
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Profile
                </Link>
                <Link href="/profile/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  My Orders
                </Link>
                <Link href="/profile/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Wishlist
                </Link>
                <Link
                  href="/profile/settings"
                  className="block px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold"
                >
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
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
              
              {/* Notifications */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Order Status Updates</h4>
                      <p className="text-xs text-gray-500">Receive SMS or Email alerts when orders are shipped/delivered.</p>
                    </div>
                    <button
                      onClick={() => handleToggle('email_notifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.email_notifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Farmer Advisory & Alerts</h4>
                      <p className="text-xs text-gray-500">Get weather warning reports and seasonal farming crop advice.</p>
                    </div>
                    <button
                      onClick={() => handleToggle('sms_notifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.sms_notifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">WhatsApp Support Updates</h4>
                      <p className="text-xs text-gray-500">Receive copy of order receipts and crop alerts on WhatsApp.</p>
                    </div>
                    <button
                      onClick={() => handleToggle('whatsapp_updates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.whatsapp_updates ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.whatsapp_updates ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" /> Language Preferences
                </h2>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">App Display Language</h4>
                    <p className="text-xs text-gray-500">Select language for titles, categories, and advisories.</p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={handleLanguageChange}
                    className="px-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-48 font-medium text-gray-700"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                    <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>

              {/* Security & Account deletion */}
              <div>
                <h2 className="text-xl font-bold text-red-600 border-b pb-3 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Danger Zone
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-red-800 text-sm">Deactivate Account</h4>
                    <p className="text-xs text-red-600 mt-0.5">Delete account information, order cache, and reviews permanently.</p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
