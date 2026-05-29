'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/products/ProductCard'
import { Product, Review } from '@/lib/types'
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store'
import { Star, ShoppingCart, Heart, CheckCircle2, ChevronRight, AlertCircle, Loader2, Tag, Truck, ShieldCheck, Clock, ChevronDown, ChevronUp, Send } from 'lucide-react'
import EnhancedHeader from '@/components/layout/EnhancedHeader'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { recordPageView } from '@/lib/supabase/db'
import LeadCaptureModal from '@/components/crm/LeadCaptureModal'

interface ChemicalInfo {
  activeIngredient: string
  modeOfAction: string
  toxicologyClass: 'green' | 'blue' | 'yellow' | 'red'
  toxicologyLabel: string
  dosage: string
  antidote: string
}

const CHEMICAL_ADVISORIES: Record<string, ChemicalInfo> = {
  'imidacloprid': {
    activeIngredient: 'Imidacloprid 17.8% SL',
    modeOfAction: 'Systemic insecticide acting as antagonist on nicotinic acetylcholine receptors.',
    toxicologyClass: 'yellow',
    toxicologyLabel: 'Highly Toxic (Class II)',
    dosage: '100 - 150 ml per acre diluted in 200 Liters of water.',
    antidote: 'No specific antidote. Treat symptomatically.',
  },
  'mancozeb': {
    activeIngredient: 'Mancozeb 75% WP',
    modeOfAction: 'Contact fungicide with multi-site action, disrupting enzyme activity in fungi.',
    toxicologyClass: 'blue',
    toxicologyLabel: 'Moderately Toxic (Class III)',
    dosage: '600 - 800 grams per acre diluted in 200 Liters of water.',
    antidote: 'Symptomatic therapy. Activated charcoal if ingested.',
  },
  'glyphosate': {
    activeIngredient: 'Glyphosate 41% SL',
    modeOfAction: 'Non-selective systemic herbicide inhibiting EPSP synthase enzyme.',
    toxicologyClass: 'blue',
    toxicologyLabel: 'Moderately Toxic (Class III)',
    dosage: '1.0 - 1.5 Liters per acre diluted in 200 Liters of water.',
    antidote: 'Gastric lavage, fluid replacement, supportive care.',
  },
  'atrazine': {
    activeIngredient: 'Atrazine 50% WP',
    modeOfAction: 'Selective systemic herbicide inhibiting photosynthesis.',
    toxicologyClass: 'yellow',
    toxicologyLabel: 'Highly Toxic (Class II)',
    dosage: '400 - 500 grams per acre.',
    antidote: 'No specific antidote. Treat symptomatically.',
  },
}

const getChemicalAdvisory = (category: string, name: string): ChemicalInfo | null => {
  const normCategory = category.toLowerCase()
  if (normCategory !== 'insecticides' && normCategory !== 'herbicides' && normCategory !== 'fungicides') return null
  const normName = name.toLowerCase()
  for (const [key, val] of Object.entries(CHEMICAL_ADVISORIES)) {
    if (normName.includes(key)) return val
  }
  return {
    activeIngredient: `${name} Active Formulation`,
    modeOfAction: 'Broad-spectrum preventative and curative treatment for agricultural crops.',
    toxicologyClass: 'blue',
    toxicologyLabel: 'Slightly/Moderately Hazardous',
    dosage: '250ml - 500ml per acre.',
    antidote: 'Wash eyes/skin thoroughly. Support ventilation.',
  }
}

const OFFERS = [
  { icon: Tag, title: '5% Instant Discount', desc: 'On orders above Rs.999 using code CROP5' },
  { icon: Truck, title: 'Free Delivery', desc: 'On prepaid orders above Rs.999' },
  { icon: ShieldCheck, title: '100% Genuine', desc: 'All products are certified and quality checked' },
  { icon: Clock, title: 'Ready in 24 Hours', desc: 'Packed and dispatched within 1 business day' },
]

interface PageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = params
  const { addItem } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()
  const { items: wishlistIds, toggleItem: toggleWishlist } = useWishlistStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [offersOpen, setOffersOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const isFavorite = product ? wishlistIds.includes(product.id) : false
  const chemicalInfo = product ? getChemicalAdvisory(product.category, product.name) : null

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const productRes = await fetch(`/api/products/${id}`)
        if (!productRes.ok) throw new Error('Product fetch failed')
        const prod: Product = await productRes.json()
        setProduct(prod)
        recordPageView(`/products/${id}`, prod.id, user?.id)

        const reviewsRes = await fetch(`/api/reviews/${id}`)
        if (reviewsRes.ok) {
          const revs: Review[] = await reviewsRes.json()
          setReviews(revs)
        }

        const relatedRes = await fetch(`/api/products?category=${encodeURIComponent(prod.category)}`)
        if (relatedRes.ok) {
          const allProds: Product[] = await relatedRes.json()
          setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4))
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    setAddingToCart(true)
    addItem({
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity,
      price: product.price - (product.discount || 0),
      product,
    })
    setTimeout(() => setAddingToCart(false), 800)
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn || !user) { toast.error('Please login to leave a review'); return }
    if (!comment.trim()) { toast.error('Please enter a review comment'); return }
    setSubmittingReview(true)
    try {
      const name = `${user.first_name || 'Farmer'} ${user.last_name || 'User'}`
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: name, rating, comment }),
      })
      if (!response.ok) throw new Error('Failed')
      const newReview: Review = await response.json()
      setReviews([newReview, ...reviews])
      setComment('')
      setRating(5)
      toast.success('Review submitted!')
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <>
        <EnhancedHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">Loading product...</p>
          </div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <EnhancedHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-500 mb-6">This product does not exist or has been removed.</p>
            <Link href="/products" className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition font-bold inline-block">
              Back to Shop
            </Link>
          </div>
        </div>
      </>
    )
  }

  const discountedPrice = product.discount ? product.price - product.discount : product.price
  const discountPercent = product.discount ? Math.round((product.discount / product.price) * 100) : 0
  const savings = product.discount ? product.discount : 0

  return (
    <>
      <EnhancedHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-green-600 font-semibold uppercase tracking-wide transition">HOME</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href="/products" className="hover:text-green-600 font-semibold uppercase tracking-wide transition">SHOP</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href={`/products?category=${product.category}`} className="hover:text-green-600 font-semibold uppercase tracking-wide transition capitalize">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-900 font-bold uppercase tracking-wide truncate max-w-[180px]">{product.name}</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Main Product Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Left: Image */}
              <div className="flex flex-col gap-3">
                <div className="relative bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden aspect-square max-h-[480px] flex items-center justify-center">
                  <Image
                    src={product.image_url || '/products/default.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                    priority
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                      {discountPercent}% OFF
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                      <span className="text-white text-xl font-extrabold uppercase tracking-widest bg-black/60 px-6 py-3 rounded-xl">Out of Stock</span>
                    </div>
                  )}
                </div>
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" /> READY IN 24H
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% GENUINE
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full">
                    <Truck className="w-3.5 h-3.5" /> FREE DELIVERY ON Rs.999+
                  </span>
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex flex-col gap-4">
                {/* Brand + Category */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    {product.brand}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider capitalize bg-gray-100 px-3 py-1 rounded-full">
                    {product.category.replace('_', ' ')}
                  </span>
                  {product.isOrganic && (
                    <span className="text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full">
                      ORGANIC
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

                {/* Rating + Reviews */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 bg-yellow-400 text-white text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                    <Star className="w-4 h-4 fill-white" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {reviews.length > 0 ? `${reviews.length} Verified Reviews` : `${product.reviews_count || 0} Ratings`}
                  </span>
                  <span className="text-gray-300 text-sm">|</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `IN STOCK (${product.stock} units)` : 'OUT OF STOCK'}
                  </span>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-black text-gray-900">Rs.{discountedPrice.toFixed(2)}</span>
                    {product.discount ? (
                      <span className="text-lg text-gray-400 line-through font-medium">Rs.{product.price.toFixed(2)}</span>
                    ) : null}
                    {discountPercent > 0 && (
                      <span className="text-sm font-extrabold text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm font-bold text-green-600">
                      You save Rs.{savings.toFixed(2)} on this order!
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> INCL. OF ALL TAXES
                  </p>
                </div>

                {/* Available Offers */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOffersOpen(!offersOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-gray-100 transition text-sm font-extrabold text-gray-800 uppercase tracking-wide"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" /> AVAILABLE OFFERS
                    </span>
                    {offersOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {offersOpen && (
                    <div className="divide-y divide-gray-100">
                      {OFFERS.map((offer, idx) => (
                        <div key={idx} className="flex items-start gap-3 px-5 py-3.5 bg-white">
                          <offer.icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">{offer.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{offer.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                )}

                {/* Crops / Composition */}
                {(product.composition || product.dosage || (product.crops && product.crops.length > 0)) && (
                  <div className="bg-green-50/60 border border-green-100 rounded-2xl p-4 space-y-2 text-sm">
                    {product.composition && (
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-700 min-w-[100px]">Composition:</span>
                        <span className="text-gray-600">{product.composition}</span>
                      </div>
                    )}
                    {product.dosage && (
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-700 min-w-[100px]">Dosage:</span>
                        <span className="text-gray-600">{product.dosage}</span>
                      </div>
                    )}
                    {product.crops && product.crops.length > 0 && (
                      <div className="flex gap-2 flex-wrap items-center">
                        <span className="font-bold text-gray-700 min-w-[100px]">Best for:</span>
                        {product.crops.map((crop, i) => (
                          <span key={i} className="bg-white border border-green-200 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">{crop}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Add to Cart */}
                {product.stock > 0 ? (
                  <div className="flex gap-3 mt-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-bold text-lg transition"
                      >-</button>
                      <span className="px-4 font-extrabold text-gray-900 min-w-[40px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-bold text-lg transition"
                      >+</button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-70"
                    >
                      {addingToCart ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                      ) : (
                        <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (!product) return
                        toggleWishlist(product.id)
                        toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist!')
                      }}
                      className={`p-3 rounded-xl border-2 transition ${isFavorite ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}
                    >
                      <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                    <p className="text-red-600 font-bold">Currently Out of Stock</p>
                    <p className="text-sm text-gray-500 mt-1">Check back soon or explore similar products below.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chemical Profile */}
          {chemicalInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${chemicalInfo.toxicologyClass === 'red' ? 'bg-red-600' : chemicalInfo.toxicologyClass === 'yellow' ? 'bg-yellow-500' : chemicalInfo.toxicologyClass === 'blue' ? 'bg-blue-600' : 'bg-green-600'}`} />
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Scientific Chemical Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Active Ingredient</span>
                    <p className="text-sm font-bold text-gray-800">{chemicalInfo.activeIngredient}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Mode of Action</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{chemicalInfo.modeOfAction}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Dosage Guidelines</span>
                    <p className="text-sm font-bold text-green-700">{chemicalInfo.dosage}</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Toxicology and Safety</h3>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">WHO Classification</span>
                    <span className={`text-sm font-extrabold ${chemicalInfo.toxicologyClass === 'red' ? 'text-red-700' : chemicalInfo.toxicologyClass === 'yellow' ? 'text-yellow-600' : chemicalInfo.toxicologyClass === 'blue' ? 'text-blue-700' : 'text-green-700'}`}>
                      {chemicalInfo.toxicologyLabel}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Emergency Antidote</span>
                    <p className="text-xs text-gray-600 font-medium">{chemicalInfo.antidote}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Advisory */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Agricultural Usage Advisory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Safe Application', body: 'Apply in early morning or late evening. Avoid spraying during peak sun hours or windy conditions to prevent drift and crop burn.' },
                { title: 'Dosage Instructions', body: 'Follow label recommendations strictly. For chemical inputs, do not exceed 2g per Liter of water. For seeds, maintain 1-2cm seed depth.' },
                { title: 'Protective Equipment', body: 'Wear gloves, protective mask, and goggles while handling chemicals. Wash hands and tools thoroughly with soap after use.' },
              ].map((item) => (
                <div key={item.title} className="p-5 bg-green-50/60 rounded-2xl border border-green-100">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" /> {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                Customer Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-5 divide-y divide-gray-100">
                  {reviews.map((rev, idx) => (
                    <div key={rev.id} className={`${idx > 0 ? 'pt-5' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {rev.user?.first_name || 'Verified'} {rev.user?.last_name || 'Farmer'}
                          </h4>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5" fill={i < rev.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(rev.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">Write a Review</h2>
              {isLoggedIn ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button type="button" key={s} onClick={() => setRating(s)}>
                          <Star className={`w-8 h-8 transition ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Comment</label>
                    <textarea
                      rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit" disabled={submittingReview}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingReview ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Review</>}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">
                    <Link href="/login" className="text-green-600 font-bold hover:underline">Sign in</Link> to write a review
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
