'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/lib/types'
import {
  Filter, SlidersHorizontal, X, ChevronDown, ChevronUp,
  Leaf, FlaskConical, Sprout, Zap, Wheat, Flower2,
  Droplets, Package, Layers, Bug, CheckCircle2,
} from 'lucide-react'

/* ─── Filter Config ─────────────────────────────────────────────────────────── */

const CATEGORY_TREE = [
  {
    id: 'seeds',
    label: 'Premium Seeds',
    emoji: '🌱',
    subcategories: [
      { id: 'field-crops',      label: 'Field Crops' },
      { id: 'vegetable',        label: 'Vegetables' },
      { id: 'fruit-plantation', label: 'Fruits & Plantation' },
      { id: 'flower-herbal',    label: 'Flowers & Herbal' },
    ]
  },
  {
    id: 'crop-protection',
    label: 'Crop Protection',
    emoji: '🛡️',
    subcategories: [
      { id: 'insecticides', label: 'Insecticides' },
      { id: 'fungicides',   label: 'Fungicides' },
      { id: 'herbicides',   label: 'Herbicides' },
    ]
  },
  {
    id: 'fertilizers',
    label: 'Fertilizers & Nutrition',
    emoji: '🧪',
    subcategories: [
      { id: 'organic',       label: 'Organic Fertilizers' },
      { id: 'chemical',      label: 'Chemical Fertilizers' },
      { id: 'biofertilizer', label: 'Bio Fertilizers' },
      { id: 'micronutrient', label: 'Micronutrients' },
      { id: 'nano',          label: 'Nano Fertilizers' },
      { id: 'pgr',           label: 'Growth Promoters' },
    ]
  },
  {
    id: 'tools',
    label: 'Farm Equipment',
    emoji: '🔧',
    subcategories: []
  }
]

const FORMULATION_OPTIONS = [
  { id: 'all',     label: 'All Formulations' },
  { id: 'liquid',  label: 'Liquids (EC / SL)' },
  { id: 'powder',  label: 'Powders (WP / SP)' },
  { id: 'granule', label: 'Granules (GR / WG)' },
]

const PEST_OPTIONS = [
  { id: 'all',      label: 'All Pests' },
  { id: 'aphid',    label: 'Aphids / Jassids' },
  { id: 'whitefly', label: 'Whiteflies' },
  { id: 'blight',   label: 'Early / Late Blight' },
  { id: 'bollworm', label: 'Bollworm / Larvae' },
  { id: 'weed',     label: 'Broadleaf Weeds' },
]

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Products',
  seeds: 'Premium Seeds',
  fertilizers: 'Fertilizers & Nutrition',
  insecticides: 'Insecticides',
  fungicides: 'Fungicides',
  herbicides: 'Herbicides',
  'crop-protection': 'Crop Protection',
  tools: 'Farm Tools & Equipment',
  organic: 'Bio / Organic Products',
}

const CATEGORY_DESC: Record<string, string> = {
  all: 'Browse our complete collection of agriculture products',
  seeds: 'Certified high-yield seeds — field crops, vegetables, fruits & herbal',
  fertilizers: 'From organic & bio-fertilizers to nano technology — complete plant nutrition',
  insecticides: 'Effective pest control solutions for all crops',
  fungicides: 'Broad-spectrum disease control — contact & systemic',
  herbicides: 'Selective & non-selective weed management',
  'crop-protection': 'Complete pest, disease & weed management range',
  tools: 'Professional farm implements, sprayers & hand tools',
  organic: 'Certified organic and bio-based agricultural inputs',
}

const CATEGORY_EMOJI: Record<string, string> = {
  seeds: '🌱', fertilizers: '🧪', insecticides: '🐛',
  fungicides: '🍄', herbicides: '🌿', tools: '🔧', all: '🏪',
}

/* ─── Collapsible section wrapper ───────────────────────────────────────────── */

function FilterSection({
  title, expanded, onToggle, children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition text-left"
      >
        <span className="text-sm font-bold text-gray-700">{title}</span>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

/* ─── Main page content (needs Suspense wrapper) ───────────────────────────── */

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'cat-seeds': true,
    'cat-crop-protection': true,
    'cat-fertilizers': true,
    'cat-tools': true,
    formulation: true,
    pest: false,
    price: true,
    brand: false,
  })

  const category    = searchParams?.get('category')    || 'all'
  const activeSubCat = searchParams?.get('sub')        || 'all'
  const activeForm  = searchParams?.get('formulation') || 'all'
  const activePest  = searchParams?.get('pest')        || 'all'
  const activeBrand = searchParams?.get('brand')       || 'all'
  const sortBy      = searchParams?.get('sort')        || 'popular'
  const searchQuery = searchParams?.get('search')      || ''
  const maxPrice    = Number(searchParams?.get('maxPrice') || '5000')

  const pushFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value === 'all' || value === '') params.delete(key)
    else params.set(key, value)
    if (key === 'category') params.delete('sub')
    router.push('/products?' + params.toString(), { scroll: false })
  }, [searchParams, router])

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    router.push('/products?' + params.toString(), { scroll: false })
  }, [category, router])

  const toggle = (k: string) => setExpanded(prev => ({ ...prev, [k]: !prev[k] }))

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const p = new URLSearchParams()
        if (category !== 'all')     p.set('category', category)
        if (activeSubCat !== 'all') p.set('sub', activeSubCat)
        if (activeBrand !== 'all')  p.set('brand', activeBrand)
        if (activeForm !== 'all')   p.set('formulation', activeForm)
        if (activePest !== 'all')   p.set('pest', activePest)
        if (searchQuery)            p.set('search', searchQuery)
        if (maxPrice < 5000)        p.set('maxPrice', String(maxPrice))
        p.set('sortBy', sortBy)
        const res  = await fetch('/api/products?' + p.toString())
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, activeSubCat, activeBrand, activeForm, activePest, searchQuery, maxPrice, sortBy])

  const isSeedsPage      = category === 'seeds'
  const isFertilizerPage = category === 'fertilizers'
  const showFormulation  = isFertilizerPage || category === 'all' || category === 'crop-protection' || category === 'insecticides' || category === 'fungicides' || category === 'herbicides'
  const showPest         = ['all', 'crop-protection', 'insecticides', 'fungicides', 'herbicides'].includes(category)

  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort()]

  const activeCount = [
    activeSubCat !== 'all',
    activeForm !== 'all',
    activePest !== 'all',
    activeBrand !== 'all',
    maxPrice < 5000,
  ].filter(Boolean).length

  /* ── Sidebar ────────────────────────────────────────────────────────────── */

  function SidebarContent() {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            Filters
            {activeCount > 0 && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </h3>
          {activeCount > 0 && (
            <button onClick={resetFilters} className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100">

          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition" onClick={() => pushFilter('category', 'all')}>
             <span className={`text-sm font-bold ${category === 'all' ? 'text-emerald-700' : 'text-gray-700'}`}>All Categories</span>
          </div>

          {CATEGORY_TREE.map(cat => (
            <FilterSection
              key={cat.id}
              title={`${cat.emoji} ${cat.label}`}
              expanded={expanded[`cat-${cat.id}`]}
              onToggle={() => toggle(`cat-${cat.id}`)}
            >
              <div className="space-y-1">
                <button
                  onClick={() => {
                    // For crop-protection subcategories (insecticides, etc) they act as main categories
                    pushFilter('category', cat.id)
                  }}
                  className={
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                    (category === cat.id && activeSubCat === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800')
                  }
                >
                  <span className="flex-1 text-left">All {cat.label}</span>
                  {category === cat.id && activeSubCat === 'all' && <CheckCircle2 className="w-4 h-4 opacity-80 flex-shrink-0" />}
                </button>

                {cat.subcategories.map(sub => {
                  // For crop protection, the subcategories (like insecticides) act as main categories in the URL
                  const isCropProtection = cat.id === 'crop-protection'
                  const isActive = isCropProtection 
                    ? category === sub.id 
                    : (category === cat.id && activeSubCat === sub.id)

                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (isCropProtection) {
                          pushFilter('category', sub.id)
                        } else {
                          const params = new URLSearchParams(searchParams?.toString() || '')
                          params.set('category', cat.id)
                          params.set('sub', sub.id)
                          router.push('/products?' + params.toString(), { scroll: false })
                        }
                      }}
                      className={
                        'w-full flex items-center gap-3 px-3 py-2.5 pl-6 rounded-xl text-sm font-medium transition-all ' +
                        (isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800')
                      }
                    >
                      <span className="flex-1 text-left">{sub.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 opacity-80 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </FilterSection>
          ))}

          {showFormulation && (
            <FilterSection
              title="Formulation"
              expanded={expanded.formulation}
              onToggle={() => toggle('formulation')}
            >
              <div className="space-y-1">
                {FORMULATION_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => pushFilter('formulation', opt.id)}
                    className={
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                      (activeForm === opt.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800')
                    }
                  >
                    {opt.id === 'liquid'  && <Droplets className={'w-4 h-4 flex-shrink-0 ' + (activeForm === opt.id ? 'text-white' : 'text-blue-400')} />}
                    {opt.id === 'powder'  && <Package  className={'w-4 h-4 flex-shrink-0 ' + (activeForm === opt.id ? 'text-white' : 'text-blue-400')} />}
                    {opt.id === 'granule' && <Layers   className={'w-4 h-4 flex-shrink-0 ' + (activeForm === opt.id ? 'text-white' : 'text-blue-400')} />}
                    {opt.id === 'all'     && <Layers   className={'w-4 h-4 flex-shrink-0 ' + (activeForm === opt.id ? 'text-white' : 'text-gray-400')} />}
                    <span className="flex-1 text-left">{opt.label}</span>
                    {activeForm === opt.id && <CheckCircle2 className="w-4 h-4 opacity-80 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          {showPest && (
            <FilterSection
              title="Target Pest / Disease"
              expanded={expanded.pest}
              onToggle={() => toggle('pest')}
            >
              <div className="space-y-1">
                {PEST_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => pushFilter('pest', opt.id)}
                    className={
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                      (activePest === opt.id
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800')
                    }
                  >
                    <Bug className={'w-4 h-4 flex-shrink-0 ' + (activePest === opt.id ? 'text-white' : 'text-amber-400')} />
                    <span className="flex-1 text-left">{opt.label}</span>
                    {activePest === opt.id && <CheckCircle2 className="w-4 h-4 opacity-80 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </FilterSection>
          )}

          <FilterSection title="Price Range" expanded={expanded.price} onToggle={() => toggle('price')}>
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={maxPrice}
              onChange={e => pushFilter('maxPrice', e.target.value)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Rs.0</span>
              <span className="font-bold text-emerald-700">Up to Rs.{maxPrice.toLocaleString('en-IN')}</span>
            </div>
          </FilterSection>

          <FilterSection title="Brand" expanded={expanded.brand} onToggle={() => toggle('brand')}>
            <div className="space-y-0.5 max-h-52 overflow-y-auto">
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => pushFilter('brand', b)}
                  className={
                    'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ' +
                    (activeBrand === b
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                  }
                >
                  {b === 'all' ? 'All Brands' : b}
                </button>
              ))}
            </div>
          </FilterSection>

        </div>
      </div>
    )
  }

  /* ── Hero config ─────────────────────────────────────────────────────────── */

  const pageTitle = CATEGORY_LABELS[category] || 'Products'
  const pageDesc  = CATEGORY_DESC[category]  || 'Browse our complete range'
  const emoji     = CATEGORY_EMOJI[category] || '🏪'

  const heroBg =
    isSeedsPage       ? 'from-orange-50 via-amber-50 to-yellow-50 border-amber-100' :
    isFertilizerPage  ? 'from-green-50 via-emerald-50 to-teal-50 border-emerald-100' :
    category === 'insecticides' ? 'from-amber-50 via-yellow-50 to-orange-50 border-amber-100' :
    category === 'fungicides'   ? 'from-yellow-50 via-lime-50 to-green-50 border-lime-100' :
    category === 'herbicides'   ? 'from-lime-50 via-green-50 to-emerald-50 border-lime-100' :
    'from-green-50 via-emerald-50 to-teal-50 border-green-100'

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Hero Banner */}
      <div className={'bg-gradient-to-r border-b py-10 ' + heroBg}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-white/60">
              {emoji}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
              <p className="text-gray-500 text-sm mt-0.5">{pageDesc}</p>
            </div>
          </div>

          {/* Quick subcategory chips (Optional, removed to prevent duplication since sidebar is comprehensive) */}
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 self-start sticky top-24">
            {SidebarContent()}
          </div>

          {/* Products Column */}
          <div className="lg:col-span-3">

            {/* Sort / count bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="flex items-center gap-2 lg:hidden bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 px-3 py-2 rounded-xl"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-gray-500">
                  {loading
                    ? 'Loading...'
                    : <><strong className="text-gray-900">{products.length}</strong> products found</>
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => pushFilter('sort', e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {activeSubCat !== 'all' && category !== 'crop-protection' && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {activeSubCat}
                    <button onClick={() => pushFilter('sub', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {activeForm !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {FORMULATION_OPTIONS.find(f => f.id === activeForm)?.label}
                    <button onClick={() => pushFilter('formulation', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {activePest !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {PEST_OPTIONS.find(p => p.id === activePest)?.label}
                    <button onClick={() => pushFilter('pest', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {activeBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {activeBrand}
                    <button onClick={() => pushFilter('brand', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product grid / skeleton / empty */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                      <div className="h-5 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                      <div className="h-8 bg-gray-100 rounded-full w-1/3 mt-3" />
                      <div className="h-10 bg-gray-100 rounded-xl mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                  Try adjusting your filters or removing the search term.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm h-full overflow-y-auto bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50 sticky top-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Filters
              </h3>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {SidebarContent()}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
              <button onClick={() => setMobileOpen(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
                Show {products.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

/* ─── Page export ────────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-semibold">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
