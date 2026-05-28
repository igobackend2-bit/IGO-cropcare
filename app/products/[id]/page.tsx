'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import { Product, Review } from '@/lib/types'
import { useCartStore, useAuthStore } from '@/lib/store'
import { Star, ShoppingCart, Heart, Send, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
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
  if (normCategory !== 'insecticides' && normCategory !== 'herbicides' && normCategory !== 'fungicides') {
    return null
  }
  
  const normName = name.toLowerCase()
  for (const [key, val] of Object.entries(CHEMICAL_ADVISORIES)) {
    if (normName.includes(key)) {
      return val
    }
  }
  
  return {
    activeIngredient: `${name} Active Formulation`,
    modeOfAction: `Broad-spectrum preventative and curative treatment for agricultural crops.`,
    toxicologyClass: 'blue',
    toxicologyLabel: 'Slightly/Moderately Hazardous',
    dosage: '250ml - 500ml per acre.',
    antidote: 'Wash eyes/skin thoroughly. Support ventilation.',
  }
}

interface PageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = params
  
  const { addItem } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Review form states
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const chemicalInfo = product ? getChemicalAdvisory(product.category, product.name) : null

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const productRes = await fetch(`/api/products/${id}`)
        if (!productRes.ok) throw new Error('Product fetch failed')
        const prod: Product = await productRes.json()
        setProduct(prod)
        
        // Track page view
        recordPageView(`/products/${id}`, prod.id, user?.id)

        const reviewsRes = await fetch(`/api/reviews/${id}`)
        if (reviewsRes.ok) {
          const revs: Review[] = await reviewsRes.json()
          setReviews(revs)
        }

        const relatedRes = await fetch(`/api/products?category=${encodeURIComponent(prod.category)}`)
        if (relatedRes.ok) {
          const allProds: Product[] = await relatedRes.json()
          const related = allProds
            .filter((p) => p.id !== prod.id)
            .slice(0, 3)
          setRelatedProducts(related)
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
    addItem({
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity: quantity,
      price: product.price - (product.discount || 0),
    })
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`)
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn || !user) {
      toast.error('You must be logged in to leave a review')
      return
    }
    if (!comment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    setSubmittingReview(true)
    try {
      const name = `${user.first_name || 'Farmer'} ${user.last_name || 'User'}`
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: name,
          rating,
          comment,
        }),
      })

      if (!response.ok) throw new Error('Review submission failed')
      const newReview: Review = await response.json()
      setReviews([newReview, ...reviews])
      setComment('')
      setRating(5)
      toast.success('Review submitted successfully!')
    } catch (err) {
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
            <div className="animate-spin text-green-600 text-4xl">⏳</div>
            <p className="text-gray-600 font-medium">Loading details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <EnhancedHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
            <Link href="/products" className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-semibold inline-block">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const discountedPrice = product.discount ? product.price - product.discount : product.price
  const discountPercent = product.discount ? Math.round((product.discount / product.price) * 100) : 0

  return (
    <>
      <EnhancedHeader />

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/products" className="hover:text-green-600 transition">Shop</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href={`/products?category=${product.category}`} className="hover:text-green-600 transition capitalize">{product.category}</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image Panel */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 border rounded-xl overflow-hidden relative flex items-center justify-center aspect-[4/3] max-h-[450px]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-4 py-1.5 rounded-full shadow-md text-sm">
                    {discountPercent}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold uppercase tracking-wider">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information Panel */}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">{product.brand}</span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded text-yellow-600 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">({reviews.length} Verified Reviews)</span>
                <span className="h-4 w-px bg-gray-300"></span>
                <span className="text-sm font-semibold capitalize text-green-600 bg-green-50 px-2.5 py-1 rounded">
                  {product.category}
                </span>
                {product.isOrganic && (
                  <>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <span className="text-sm font-semibold text-white bg-green-600 px-2.5 py-1 rounded shadow-sm">
                      🌿 Organic Certified
                    </span>
                  </>
                )}
              </div>

              {/* Price Panel */}
              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
                  {product.discount && (
                    <span className="text-lg text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                  )}
                </div>
                {product.discount && (
                  <p className="text-sm text-green-600 font-semibold">
                    You save ₹{product.discount.toFixed(2)} ({discountPercent}% discount)
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Inclusive of all local sales taxes</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Product Overview</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Extended Technical Details */}
              {(product.composition || product.dosage || product.crops) && (
                <div className="mb-6 bg-green-50/40 border border-green-100 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 border-b pb-2">Technical Specifications</h3>
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
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-700 min-w-[100px]">Best for:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.crops.map((crop, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stock Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>Stock Availability</span>
                  <span className={product.stock > 20 ? 'text-green-600' : 'text-orange-600'}>
                    {product.stock > 0 ? `${product.stock} units available` : 'Temporarily Out of Stock'}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${product.stock > 20 ? 'bg-green-600' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min((product.stock / 250) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Purchase controls */}
              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {/* Quantity adjustment */}
                  <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 sm:w-36 bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-500 hover:text-gray-900 font-bold text-xl px-2"
                    >
                      −
                    </button>
                    <span className="font-extrabold text-gray-900 text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="text-gray-500 hover:text-gray-900 font-bold text-xl px-2"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => {
                      setIsFavorite(!isFavorite)
                      toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist!')
                    }}
                    className={`p-3.5 rounded-xl border-2 transition shadow-sm ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scientific Chemical Profile */}
        {chemicalInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 mb-12 border border-gray-100 relative overflow-hidden">
            {/* Toxicology Stripe */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${
              chemicalInfo.toxicologyClass === 'red' ? 'bg-red-600' :
              chemicalInfo.toxicologyClass === 'yellow' ? 'bg-yellow-500' :
              chemicalInfo.toxicologyClass === 'blue' ? 'bg-blue-600' : 'bg-green-600'
            }`} />
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              🧪 Scientific Chemical Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Specifications */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Active Ingredient</span>
                  <p className="text-sm font-bold text-gray-800">{chemicalInfo.activeIngredient}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Mechanism / Mode of Action</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{chemicalInfo.modeOfAction}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Dosage Guidelines</span>
                  <p className="text-sm font-bold text-green-700">{chemicalInfo.dosage}</p>
                </div>
              </div>

              {/* Safety & Toxicology */}
              <div className="bg-gray-50 border rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 border-b pb-2">
                  ⚠️ Toxicology & Safety Warnings
                </h3>
                <div className="flex items-center gap-3">
                  {/* Visual Chemical Label Triangle representation */}
                  <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                    <div className={`w-8 h-8 rotate-45 border border-gray-300 ${
                      chemicalInfo.toxicologyClass === 'red' ? 'bg-red-650' :
                      chemicalInfo.toxicologyClass === 'yellow' ? 'bg-yellow-500' :
                      chemicalInfo.toxicologyClass === 'blue' ? 'bg-blue-650' : 'bg-green-600'
                    }`} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block uppercase">WHO Classification</span>
                    <span className={`text-sm font-extrabold ${
                      chemicalInfo.toxicologyClass === 'red' ? 'text-red-700' :
                      chemicalInfo.toxicologyClass === 'yellow' ? 'text-yellow-600' :
                      chemicalInfo.toxicologyClass === 'blue' ? 'text-blue-700' : 'text-green-700'
                    }`}>{chemicalInfo.toxicologyLabel}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-0.5">Emergency Antidote</span>
                  <p className="text-xs text-gray-600 font-medium">{chemicalInfo.antidote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Guidelines Section (Specific for agriculture) */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 mb-12 border border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Agricultural Usage Advisory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-green-50/50 rounded-xl border border-green-100/50">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Safe Application
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Always apply this product in the early morning or late evening hours. Avoid spraying during hot sunny peak hours or windy conditions to prevent drift and burn.
              </p>
            </div>
            <div className="p-5 bg-green-50/50 rounded-xl border border-green-100/50">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Dosage Instruction
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Follow recommendations strictly. For seeds, ensure proper spacing and seed depth of 1-2 cm. For chemical inputs, do not exceed 2g per Liter of water.
              </p>
            </div>
            <div className="p-5 bg-green-50/50 rounded-xl border border-green-100/50">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Protective Equipment
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Use safety gloves, protective masks, and goggles while diluting and handling chemicals. Wash hands and tools thoroughly with soap after completion.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {/* Reviews List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Customer Feedback</h2>
            
            {reviews.length > 0 ? (
              <div className="space-y-6 divide-y divide-gray-100">
                {reviews.map((rev, index) => (
                  <div key={rev.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{rev.user?.first_name || 'Verified'} {rev.user?.last_name || 'Farmer'}</h4>
                        <div className="flex text-yellow-400 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4"
                              fill={i < rev.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No reviews yet. Be the first to purchase and review this product!
              </div>
            )}
          </div>

          {/* Leave a Review Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Write a Review</h2>
            
            {isLoggedIn ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setRating(stars)}
                        className="text-yellow-400 hover:scale-110 transition"
                      >
                        <Star className="w-8 h-8" fill={stars <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Review Comment</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other farmers about your experience using this product..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">Please <a href="/login" className="text-green-600 hover:underline font-bold">sign in</a> to write a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
