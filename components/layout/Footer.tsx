'use client';

import Link from 'next/link';
import { ArrowRight, Award, Mail, MapPin, Phone, Shield, Sprout, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-gray-950 text-gray-400">
      <div className="bg-green-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div>
            <p className="text-xl font-extrabold text-white">Modernize your crop input workflow with IGO CropCare</p>
            <p className="mt-0.5 text-sm text-green-100">
              Verified products, AI-assisted advisory, dealer support, and B2B procurement for Indian agriculture.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-50"
            >
              Shop Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/b2b"
              className="rounded-lg border border-green-300 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
            >
              B2B Inquiry
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 shadow">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-extrabold text-white">IGO CropCare</span>
              <span className="block text-[10px] uppercase tracking-widest text-green-400">Seed to Harvest</span>
            </div>
          </Link>

          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            Professional agri-tech commerce for verified crop inputs, AI-assisted field guidance, and organized seasonal
            procurement.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-gray-300">
              <Shield className="h-3 w-3 text-green-500" /> Secure Orders
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-800 px-2.5 py-1 text-[11px] font-semibold text-gray-300">
              <Award className="h-3 w-3 text-yellow-500" /> Verified Catalog
            </span>
          </div>

          <div className="space-y-2">
            <a href="tel:+917428208822" className="flex items-center gap-2 text-sm transition hover:text-green-400">
              <Phone className="h-4 w-4 shrink-0 text-green-600" /> Support: 7428208822
            </a>
            <a href="mailto:care@igo-cropcare.in" className="flex items-center gap-2 text-sm transition hover:text-green-400">
              <Mail className="h-4 w-4 shrink-0 text-green-600" /> care@igo-cropcare.in
            </a>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>Derabassi Industrial Area, Punjab - 140507, India</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a href="https://www.facebook.com/share/1CtpDtY1Er/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-[#1877F2] hover:text-white">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://www.instagram.com/igocropcare/?hl=en" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-[#E4405F] hover:text-white">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Products</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Crop Protection', href: '/products?category=insecticides' },
              { label: 'Seeds & Nutrition', href: '/products?category=seeds' },
              { label: 'Fertilizers', href: '/products?category=fertilizers' },
              { label: 'Farm Equipment', href: '/products?category=tools' },
              { label: 'View All Products', href: '/products' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-green-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Business</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'B2B Portal', href: '/b2b' },
              { label: 'Dealer Locator', href: '/dealers' },
              { label: 'Distributor Inquiry', href: '/b2b#dealership' },
              { label: 'Bulk Quote Builder', href: '/b2b#quote' },
              { label: 'Knowledge Hub', href: '/knowledge' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-green-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Crop Doctor AI', href: '/crop-doctor' },
              { label: 'Crop Calendar', href: '/crop-calendar' },
              { label: 'Market Prices', href: '/market-prices' },
              { label: 'About Us', href: '/about' },
              { label: 'Orders', href: '/orders' },
              { label: 'Profile', href: '/profile' },
              { label: 'Contact', href: '/dealers#contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-green-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 md:flex-row">
          <p>Copyright 2026 IGO CropCare Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-green-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-green-400">
              Terms of Service
            </Link>
            <Link href="/dealers#contact" className="transition hover:text-green-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
