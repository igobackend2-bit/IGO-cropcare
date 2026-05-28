'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Platform', href: '/#features' },
  { label: 'Technology', href: '/#tech' },
  { label: 'Impact', href: '/#impact' },
  { label: 'Contact', href: '/#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center justify-center relative w-48 h-14 group overflow-hidden">
          <Image 
            src="/logo.png" 
            alt="IGO Crop Care Logo" 
            fill
            className="object-contain invert mix-blend-screen scale-[2.5] transition-transform group-hover:scale-[2.6]" 
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="bg-white hover:bg-gray-100 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Get Access
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10 px-6 py-6 space-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center w-full bg-white text-black px-6 py-3 rounded-xl font-bold transition-all"
            >
              Get Access
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
