'use client'


import { useState } from 'react'
import { MapPin, Phone, Search, Store, Navigation, Award, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Dealer {
  id: string
  name: string
  proprietor: string
  address: string
  phone: string
  state: string
  district: string
  tier: 'premium' | 'authorized'
  brands: string[]
  distance?: string
}

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  punjab: ['Bathinda', 'Ludhiana', 'Amritsar', 'Patiala'],
  haryana: ['Karnal', 'Hisar', 'Rohtak', 'Sirsa'],
  maharashtra: ['Nashik', 'Pune', 'Aurangabad', 'Nagpur'],
  andhra_pradesh: ['Guntur', 'Vijayawada', 'Kurnool', 'Nellore'],
  gujarat: ['Anand', 'Rajkot', 'Surat', 'Mehsana'],
}

const DEALERS_DATABASE: Dealer[] = [
  // Punjab
  {
    id: 'dl-1',
    name: 'Malwa Kheti Center',
    proprietor: 'Sardar Jagmeet Singh',
    address: 'Shop No. 12, Grain Market Road, Bathinda, Punjab - 151001',
    phone: '+91 98765 43210',
    state: 'punjab',
    district: 'Bathinda',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'UPL', 'Bayer'],
    distance: '2.4 km away',
  },
  {
    id: 'dl-2',
    name: 'Bathinda Pesticides & Seeds',
    proprietor: 'Rajesh Sharma',
    address: 'Near Old Bus Stand, GT Road, Bathinda, Punjab - 151002',
    phone: '+91 94170 11223',
    state: 'punjab',
    district: 'Bathinda',
    tier: 'authorized',
    brands: ['CropCare', 'Syngenta', 'BASF'],
    distance: '3.1 km away',
  },
  {
    id: 'dl-3',
    name: 'Punjab Farmers Coop Store',
    proprietor: 'Harpreet Gill',
    address: 'Ferozepur Bypass Link Road, Ludhiana, Punjab - 141008',
    phone: '+91 98881 23456',
    state: 'punjab',
    district: 'Ludhiana',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'UPL', 'Syngenta'],
    distance: '1.8 km away',
  },
  // Haryana
  {
    id: 'dl-4',
    name: 'Karnal Agrochemicals & Seeds',
    proprietor: 'Surender Hooda',
    address: 'Kunjpura Road, Near Grain Market, Karnal, Haryana - 132001',
    phone: '+91 98960 99887',
    state: 'haryana',
    district: 'Karnal',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'Bayer'],
    distance: '1.2 km away',
  },
  {
    id: 'dl-5',
    name: 'Hari Bhoomi Krishi Kendra',
    proprietor: 'Vikram Sangwan',
    address: 'Assandh Road Bypass, Karnal, Haryana - 132002',
    phone: '+91 99960 11445',
    state: 'haryana',
    district: 'Karnal',
    tier: 'authorized',
    brands: ['CropCare', 'UPL', 'Syngenta'],
    distance: '4.5 km away',
  },
  // Maharashtra
  {
    id: 'dl-6',
    name: 'Sahyadri Krishi Seva Kendra',
    proprietor: 'Balasaheb Patil',
    address: 'Panchavati Chowk, Dindori Road, Nashik, Maharashtra - 422003',
    phone: '+91 98220 55667',
    state: 'maharashtra',
    district: 'Nashik',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'UPL', 'Bayer', 'Syngenta'],
    distance: '0.8 km away',
  },
  {
    id: 'dl-7',
    name: 'Godavari Fertilizer Agency',
    proprietor: 'Sanjay Deshmukh',
    address: 'Niphad Highway Market Yard, Nashik, Maharashtra - 422301',
    phone: '+91 98500 99887',
    state: 'maharashtra',
    district: 'Nashik',
    tier: 'authorized',
    brands: ['CropCare', 'BASF', 'UPL'],
    distance: '8.2 km away',
  },
  // Andhra Pradesh
  {
    id: 'dl-8',
    name: 'Srinivasa Rythu Seva Center',
    proprietor: 'Y. Venkat Rao',
    address: 'Amaravathi Road, Near NTR Statue, Guntur, Andhra Pradesh - 522002',
    phone: '+91 94402 33445',
    state: 'andhra_pradesh',
    district: 'Guntur',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'UPL', 'Syngenta'],
    distance: '1.5 km away',
  },
  // Gujarat
  {
    id: 'dl-9',
    name: 'Patel Krishi Kendra',
    proprietor: 'Dineshbhai Patel',
    address: 'Amul Dairy Road, Near Anand Railway Station, Anand, Gujarat - 388001',
    phone: '+91 98980 12345',
    state: 'gujarat',
    district: 'Anand',
    tier: 'premium',
    brands: ['CropCare', 'Crystal Crop Protection', 'Bayer', 'BASF'],
    distance: '0.5 km away',
  },
]

export default function DealersPage() {
  const [selectedState, setSelectedState] = useState('punjab')
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS_BY_STATE['punjab'][0])
  const [searchResults, setSearchResults] = useState<Dealer[]>(
    DEALERS_DATABASE.filter(d => d.state === 'punjab' && d.district === DISTRICTS_BY_STATE['punjab'][0])
  )

  const handleStateChange = (stateVal: string) => {
    setSelectedState(stateVal)
    const districts = DISTRICTS_BY_STATE[stateVal] || []
    setSelectedDistrict(districts[0] || '')
    
    // Auto query
    const filtered = DEALERS_DATABASE.filter(d => d.state === stateVal && d.district === districts[0])
    setSearchResults(filtered)
  }

  const handleSearch = () => {
    const filtered = DEALERS_DATABASE.filter(
      (d) => d.state === selectedState && d.district === selectedDistrict
    )
    setSearchResults(filtered)
    toast.success(`Found ${filtered.length} dealer(s) in ${selectedDistrict}`)
  }

  const handleGetDirections = (name: string) => {
    toast.success(`Routing to ${name} simulated via maps interface`)
  }

  return (
    <>
      

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-emerald-100 opacity-90 animate-pulse" />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Retail Dealer Locator</h1>
          <p className="text-lg text-emerald-50 max-w-2xl mx-auto">
            Find certified CropCare partners, distributors, and bulk pesticide centers in your local market district.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Dropdown Selectors */}
        <div className="bg-white border rounded-2xl shadow-md p-6 max-w-4xl mx-auto -mt-20 z-10 relative mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Select State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-gray-800"
            >
              <option value="punjab">Punjab</option>
              <option value="haryana">Haryana</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="andhra_pradesh">Andhra Pradesh</option>
              <option value="gujarat">Gujarat</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-gray-800"
            >
              {(DISTRICTS_BY_STATE[selectedState] || []).map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow"
          >
            <Search className="w-4 h-4" /> Locate Dealers
          </button>
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-extrabold text-gray-900 border-b pb-2 flex items-center gap-2">
            📍 Authorized Dealers in {selectedDistrict} ({searchResults.length})
          </h2>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {searchResults.map((dealer) => (
                <div
                  key={dealer.id}
                  className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-3 flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{dealer.name}</h3>
                      {dealer.tier === 'premium' ? (
                        <span className="bg-yellow-100 text-yellow-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 border border-yellow-200">
                          <Award className="w-3 h-3" /> Premium Partner
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Authorized
                        </span>
                      )}
                    </div>

                    {/* Proprietary */}
                    <p className="text-xs text-gray-500 font-semibold">Proprietor: {dealer.proprietor}</p>

                    {/* Address */}
                    <p className="text-sm text-gray-600 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-4 h-4 text-green-650 shrink-0 mt-0.5" />
                      {dealer.address}
                    </p>

                    {/* Contact Phone */}
                    <p className="text-xs text-gray-700 font-mono flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {dealer.phone}
                    </p>

                    {/* Brands listed */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dealer.brands.map((b) => (
                        <span
                          key={b}
                          className="bg-gray-100 text-gray-650 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right hand side navigation info */}
                  <div className="shrink-0 w-full md:w-auto text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                    {dealer.distance && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-150">
                        {dealer.distance}
                      </span>
                    )}
                    <button
                      onClick={() => handleGetDirections(dealer.name)}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Get Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border rounded-xl shadow-sm">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold text-lg">No dealers found in this location</p>
              <p className="text-gray-500 text-sm mt-2">Try searching a different district or expand your search area.</p>
            </div>
          )}
        </div>
      </div>

    </>
  )
}
