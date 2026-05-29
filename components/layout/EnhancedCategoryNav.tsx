'use client'

import { FC, useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, TrendingUp, Bug, Sprout, Zap, Leaf, Hammer, Waves, Flower2, TreePine, FlaskConical, Wheat, Droplets } from 'lucide-react'

interface Category {
  id: number
  name: string
  href: string
  icon: React.ReactNode
  bg: string
  iconColor: string
}

const categories: Category[] = [
  { id: 1, name: 'Daily Deals', href: '/products?sort=discount', icon: <TrendingUp className="w-6 h-6" />, bg: 'bg-red-50 hover:bg-red-100 border-red-100 hover:border-red-200', iconColor: 'text-red-500' },
  { id: 2, name: 'Insecticides', href: '/products?category=insecticides', icon: <Bug className="w-6 h-6" />, bg: 'bg-amber-50 hover:bg-amber-100 border-amber-100 hover:border-amber-200', iconColor: 'text-amber-600' },
  { id: 3, name: 'Fungicides', href: '/products?category=fungicides', icon: <FlaskConical className="w-6 h-6" />, bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100 hover:border-yellow-200', iconColor: 'text-yellow-600' },
  { id: 4, name: 'Herbicides', href: '/products?category=herbicides', icon: <Leaf className="w-6 h-6" />, bg: 'bg-lime-50 hover:bg-lime-100 border-lime-100 hover:border-lime-200', iconColor: 'text-lime-600' },
  { id: 5, name: 'Seeds', href: '/products?category=seeds', icon: <Sprout className="w-6 h-6" />, bg: 'bg-orange-50 hover:bg-orange-100 border-orange-100 hover:border-orange-200', iconColor: 'text-orange-500' },
  { id: 6, name: 'Fertilizers', href: '/products?category=fertilizers', icon: <Droplets className="w-6 h-6" />, bg: 'bg-green-50 hover:bg-green-100 border-green-100 hover:border-green-200', iconColor: 'text-green-600' },
  { id: 7, name: 'Bio Products', href: '/products?category=fertilizers&sub=biofertilizer', icon: <TreePine className="w-6 h-6" />, bg: 'bg-teal-50 hover:bg-teal-100 border-teal-100 hover:border-teal-200', iconColor: 'text-teal-600' },
  { id: 8, name: 'Sprayers', href: '/products?category=tools', icon: <Waves className="w-6 h-6" />, bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100 hover:border-blue-200', iconColor: 'text-blue-500' },
  { id: 9, name: 'Equipment', href: '/products?category=tools', icon: <Hammer className="w-6 h-6" />, bg: 'bg-purple-50 hover:bg-purple-100 border-purple-100 hover:border-purple-200', iconColor: 'text-purple-500' },
  { id: 10, name: 'Gardening', href: '/products?category=seeds&sub=flower-herbal', icon: <Flower2 className="w-6 h-6" />, bg: 'bg-pink-50 hover:bg-pink-100 border-pink-100 hover:border-pink-200', iconColor: 'text-pink-500' },
  { id: 11, name: 'Cereals', href: '/products?category=seeds&sub=field-crops', icon: <Wheat className="w-6 h-6" />, bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100 hover:border-yellow-200', iconColor: 'text-yellow-700' },
  { id: 12, name: 'Nano & Tech', href: '/products?category=fertilizers&sub=nano', icon: <Zap className="w-6 h-6" />, bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100 hover:border-indigo-200', iconColor: 'text-indigo-600' },
]

const EnhancedCategoryNav: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5">
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
            Shop by Category
          </h2>
          <Link href="/products" className="text-xs font-bold text-green-600 hover:text-green-800 hover:underline transition">
            View all →
          </Link>
        </div>

        {/* Scroll container + arrow buttons */}
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-green-50 hover:border-green-300 hover:shadow-lg ${
              canScrollLeft ? 'opacity-100 -translate-x-1' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Scrollable strip */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

            {categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={cat.href}
                  className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition duration-200 hover:scale-105 hover:shadow-md w-[80px] flex-shrink-0 ${cat.bg}`}
                >
                  <div className={`${cat.iconColor} transition-transform duration-200 group-hover:scale-110`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-semibold leading-tight text-gray-700 group-hover:text-gray-900 line-clamp-2 text-center w-full">
                    {cat.name}
                  </span>
                </Link>

                {/* Separator (not after last item) */}
                {idx < categories.length - 1 && (
                  <div className="h-10 w-px bg-gray-100 flex-shrink-0" />
                )}
              </div>
            ))}

            {/* Right padding sentinel */}
            <div className="w-4 flex-shrink-0" />
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-green-50 hover:border-green-300 hover:shadow-lg ${
              canScrollRight ? 'opacity-100 translate-x-1' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default EnhancedCategoryNav
