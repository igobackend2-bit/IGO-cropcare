'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Cpu, Droplets, Leaf, ShieldCheck } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  Icon: typeof Cpu;
  stat: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Professional Crop Inputs, Delivered with Agronomy Intelligence',
    subtitle:
      'Certified seeds, crop protection, nutrition, and field guidance in one digital platform for progressive Indian farms.',
    cta: 'Explore Products',
    ctaLink: '/products',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop',
    Icon: Leaf,
    stat: '50,000+ farmers served',
  },
  {
    id: 2,
    title: 'AI-Assisted Crop Diagnosis and Treatment Planning',
    subtitle:
      'Use Crop Doctor to identify disease symptoms, compare recommended products, and act faster with confidence.',
    cta: 'Try Crop Doctor',
    ctaLink: '/crop-doctor',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=900&fit=crop',
    Icon: Cpu,
    stat: 'Vision-led advisory workflow',
  },
  {
    id: 3,
    title: 'Precision Nutrition for Better Crop Performance',
    subtitle:
      'Balanced NPK, micronutrients, bio-stimulants, and growth regulators selected for season, soil, and crop stage.',
    cta: 'View Nutrition',
    ctaLink: '/products?category=fertilizers',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1600&h=900&fit=crop',
    Icon: ShieldCheck,
    stat: 'Quality-verified catalog',
  },
  {
    id: 4,
    title: 'Smarter Irrigation and Farm Equipment Choices',
    subtitle:
      'Compare efficient tools, irrigation systems, and farm essentials built for reliability in real field conditions.',
    cta: 'Compare Tools',
    ctaLink: '/products?category=tools',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=900&fit=crop',
    Icon: Droplets,
    stat: 'Water-smart solutions',
  },
];

const EnhancedHeroSection: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const pauseBriefly = () => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 3000);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    pauseBriefly();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    pauseBriefly();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    pauseBriefly();
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-950">
      <div className="relative min-h-[34rem] md:min-h-[42rem]">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative flex h-full min-h-[34rem] items-center overflow-hidden md:min-h-[42rem]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/30" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,163,74,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(22,163,74,0.12)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-white">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-green-100 backdrop-blur">
                    <slide.Icon className="h-4 w-4 text-green-300" />
                    {slide.stat}
                  </div>
                  <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-100 md:text-xl">
                    {slide.subtitle}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center rounded-lg bg-green-500 px-7 py-3 text-base font-bold text-gray-950 shadow-lg transition hover:bg-green-400"
                    >
                      {slide.cta}
                    </Link>
                    <Link
                      href="/b2b"
                      className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-7 py-3 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      Request Bulk Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous hero slide"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-3 backdrop-blur-sm transition hover:bg-white/25"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next hero slide"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-3 backdrop-blur-sm transition hover:bg-white/25"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to hero slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'h-3 w-8 bg-white' : 'h-3 w-3 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
