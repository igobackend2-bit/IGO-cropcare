'use client'

import { useEffect, useState } from 'react'
import { Megaphone, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [bannerSettings, setBannerSettings] = useState({
    isActive: false,
    text: '',
    link: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'header_banner')
        .single()
      
      if (!error && data?.setting_value) {
        setBannerSettings(data.setting_value)
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('admin_settings')
      .upsert({ 
        setting_key: 'header_banner', 
        setting_value: bannerSettings 
      }, { onConflict: 'setting_key' })

    if (error) {
      toast.error('Failed to save settings')
      console.error(error)
    } else {
      toast.success('Banner settings updated successfully! It will immediately reflect on the live website.')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-green-600" /> Banner Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">Configure the announcement banner displayed at the top of the main website.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {loading ? (
          <p className="text-slate-500">Loading settings...</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Enable Banner</h3>
                <p className="text-xs text-slate-500">Show or hide the banner globally.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={bannerSettings.isActive}
                  onChange={(e) => setBannerSettings({...bannerSettings, isActive: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-sm font-medium mb-1">Announcement Text</label>
                <input
                  type="text"
                  value={bannerSettings.text}
                  onChange={(e) => setBannerSettings({...bannerSettings, text: e.target.value})}
                  placeholder="e.g. Special offer: 20% off all seeds this weekend!"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clickable Link (Optional)</label>
                <input
                  type="text"
                  value={bannerSettings.link}
                  onChange={(e) => setBannerSettings({...bannerSettings, link: e.target.value})}
                  placeholder="e.g. /products?category=seeds"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </>
        )}
      </div>

      {bannerSettings.isActive && bannerSettings.text && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Live Preview</h3>
          <div className="bg-primary-600 text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center rounded-xl shadow-lg shadow-primary-600/20">
            {bannerSettings.text}
            {bannerSettings.link && (
              <span className="ml-2 underline underline-offset-2 opacity-90 cursor-pointer">
                Shop Now
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
