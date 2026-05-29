'use client'


import { useState } from 'react'
import { Search, BookOpen, Clock, Tag, ChevronRight, X, Heart, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  summary: string
  content: string
  category: 'protection' | 'soil' | 'pest' | 'seeds' | 'organic'
  readTime: string
  image: string
  date: string
  author: string
  recommendation: string
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Managing Early Blight in Tomato Crops',
    summary: 'Recognize the early symptoms of fungal blights and learn chemical & cultural control methods.',
    content: 'Early blight is caused by the fungus Alternaria solani and is one of the most common tomato diseases. It affects leaves, stems, and fruit. Symptoms start as small, dark spots on older leaves, developing concentric rings like a target. Eventually, leaves turn yellow and drop off, exposing fruit to sunscald. \n\nTreatment Protocol:\n1. Apply Mancozeb Fungicide 75% WP at a dosage of 2-2.5g per Liter of water immediately upon spotting symptoms.\n2. Space plants adequately to promote good air circulation.\n3. Prune lower leaves to prevent splash-up from soil.\n4. Avoid overhead sprinkler irrigation; opt for drip irrigation instead.',
    category: 'protection',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=400&fit=crop',
    date: 'May 12, 2026',
    author: 'Dr. Ramesh Kumar (Agronomist)',
    recommendation: 'Recommended Product: UPL Mancozeb Fungicide',
  },
  {
    id: 'art-2',
    title: 'Balanced Fertilization: Understanding NPK Ratios',
    summary: 'A complete guide to Nitrogen, Phosphorus, and Potassium application for high yields.',
    content: 'NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K) - the three primary macro-nutrients vital for crop growth. Nitrogen drives vegetative foliage growth. Phosphorus builds strong roots and triggers flowering. Potassium enhances drought tolerance, disease resistance, and fruit weight/quality.\n\nOptimal Usage:\n1. Early Growth (Vegetative Phase): Use balanced NPK ratios like 19:19:19 to establish a strong, green plant framework.\n2. Flowering Phase: Boost phosphorus ratios to encourage heavy bud setting.\n3. Fruiting Phase: Shift to potassium-rich fertilizers (e.g. NPK 0:0:50 or 13:0:45) to increase fruit size and sugar accumulation.',
    category: 'soil',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    date: 'Apr 28, 2026',
    author: 'Prof. Anil Deshmukh (Soil Scientist)',
    recommendation: 'Recommended Product: Katyayani NPK 19:19:19 Fertilizer',
  },
  {
    id: 'art-3',
    title: 'Organic Pest Control with Pure Neem Oil',
    summary: 'How to use Azadirachtin formulations effectively without damaging beneficial insects.',
    content: 'Cold-pressed Neem Oil containing Azadirachtin is an excellent natural systemic insecticide. It acts as an anti-feedant and disrupts the life cycle of pests (egg hatching and molting) rather than acting as a rapid knockdown chemical. This makes it safe for ladybugs, honeybees, and spiders if sprayed correctly.\n\nApplication Guidelines:\n1. Mix 5ml of Neem Oil (10,000 PPM Azadirachtin formulation) per Liter of water.\n2. Add 1-2ml of liquid dishwashing soap or organic emulsifier to ensure the oil blends with the water.\n3. Spray thoroughly on both the upper and lower surfaces of leaves.\n4. Apply in late evening to prevent solar degradation of organic compounds.',
    category: 'organic',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&h=400&fit=crop',
    date: 'May 05, 2026',
    author: 'Savitri Bai (Organic Farming Specialist)',
    recommendation: 'Recommended Product: Greenpeace Organic Neem Oil',
  },
  {
    id: 'art-4',
    title: 'Improving Germination Rates of Hybrid Vegetable Seeds',
    summary: 'Control soil moisture, sowing depth, and temperature to achieve 98% germination.',
    content: 'F1 hybrid vegetable seeds represent a significant investment. Getting the highest germination rate requires controlling soil moisture, aeration, depth, and heat.\n\nKey Steps:\n1. Sowing Depth: A good rule of thumb is to sow seeds at a depth equal to 2-3 times their width (typically 1-2 cm for tomatoes/peppers).\n2. Moisture Management: Use coco-peat or well-drained nursery trays. Keep the media damp but never waterlogged to prevent damping-off disease.\n3. Warmth: Most summer crops require a soil temperature of 24°C-30°C to germinate efficiently.\n4. Treatment: Use pre-treated seeds, or apply a light bio-fungicide coating to prevent seedling rot.',
    category: 'seeds',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1464226184081-280282069fda?w=600&h=400&fit=crop',
    date: 'May 10, 2026',
    author: 'Rajiv Patel (Seed Breeder)',
    recommendation: 'Recommended Product: Syngenta F1 Tomato Seeds',
  },
  {
    id: 'art-5',
    title: 'Eradicating Whiteflies and Thrips in Cotton fields',
    summary: 'Effective pest management strategies to avoid severe crop leaf curl virus.',
    content: 'Whiteflies and Thrips are sucking pests that sap plant juices, leading to leaf crinkling, soot mold growth, and the transmission of destructive plant viruses like the Leaf Curl Virus.\n\nManagement strategy:\n1. Install Yellow Sticky Traps at a height of 1 foot above the crop canopy to monitor whitefly levels early.\n2. Spray organic neem oil early to suppress nymph populations.\n3. If infestations cross economic thresholds, spray systemic insecticides in rotation to prevent chemical resistance.\n4. Remove alternate weed hosts around fields.',
    category: 'pest',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e58?w=600&h=400&fit=crop',
    date: 'May 15, 2026',
    author: 'Dr. M. K. Swaminathan (Entomologist)',
    recommendation: 'Recommended Product: Bayer Roundup / Bio-pesticides',
  },
]

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)

  const categories = [
    { id: 'all', label: 'All Advisories' },
    { id: 'protection', label: 'Crop Protection' },
    { id: 'soil', label: 'Soil & Fertilizer' },
    { id: 'pest', label: 'Pest Control' },
    { id: 'seeds', label: 'Seed Sowing' },
    { id: 'organic', label: 'Organic Farming' },
  ]

  const filteredArticles = ARTICLES.filter((art) => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = art.title.toLowerCase().includes(q)
      const matchesSummary = art.summary.toLowerCase().includes(q)
      const matchesContent = art.content.toLowerCase().includes(q)
      if (!matchesTitle && !matchesSummary && !matchesContent) return false
    }
    
    return true
  })

  return (
    <>
      

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-emerald-100 opacity-90 animate-bounce" />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Farmer Advisory Center</h1>
          <p className="text-lg text-emerald-50 max-w-2xl mx-auto">
            Get crop disease solutions, fertilizer schedules, and seasonal planting advice verified by agronomy experts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Category filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-5 rounded-xl shadow-md border border-gray-100">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g., blight, fertilizer, dosage)..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-700"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          </div>

          {/* Categories list */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm border">
                      {art.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {art.readTime}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-green-600 transition mb-2">
                      {art.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                {/* Footer button */}
                <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 truncate max-w-[150px]">
                    By {art.author.split(' (')[0]}
                  </span>
                  <button
                    onClick={() => setActiveArticle(art)}
                    className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition"
                  >
                    Read Guide <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border rounded-xl shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">No advisory guides found</p>
            <p className="text-gray-400 text-sm mt-1">Try resetting filters or searching for something else.</p>
          </div>
        )}
      </div>

      {/* Article Full View Modal */}
      {activeArticle && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-gray-400">Published {activeArticle.date}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Image banner */}
              <div className="h-64 rounded-xl overflow-hidden bg-gray-100 border">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and author */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">{activeArticle.title}</h1>
                <p className="text-sm font-semibold text-green-700">Written by: {activeArticle.author}</p>
              </div>

              {/* Content body */}
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              {/* Recommendation Box */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-green-800 text-sm">Need Treatment Supplies?</h4>
                  <p className="text-xs text-gray-600 mt-0.5">{activeArticle.recommendation}</p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setActiveArticle(null)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition whitespace-nowrap"
                >
                  Shop Products →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
