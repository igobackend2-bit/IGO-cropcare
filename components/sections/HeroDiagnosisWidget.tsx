'use client';

import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle, Camera, CheckCircle, ChevronRight, Loader2,
  Microscope, Search, ShoppingCart, Upload, X,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */
interface RecommendedProduct {
  id: string;
  name: string;
  dosage: string;
  price: number;
  urgency: string;
  category: string;
}

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string;
  products: RecommendedProduct[];
  prevention: string[];
  tips: string[];
}

/* ─── Sample queries ───────────────────── */
const SAMPLE_QUERIES = [
  { label: '🟡 Yellow leaves on tomato', query: 'My tomato plant leaves are turning yellow and falling off' },
  { label: '🟤 Brown spots on rice', query: 'Brown spots appeared on my rice crop leaves' },
  { label: '⬜ White powder on wheat', query: 'White powdery coating on wheat leaves and stems' },
];

/* ─── Component ──────────────────────────────────────────── */
const HeroDiagnosisWidget: FC = () => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const severityColor = {
    Low: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (mode === 'text' && !query.trim()) {
      setError('Please describe your crop problem first.');
      return;
    }
    if (mode === 'image' && !preview) {
      setError('Please upload an image of your crop first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (mode === 'image' && preview) {
        const res = await fetch(preview);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append('image', blob, 'crop.jpg');

        const response = await fetch('/api/ai/vision', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Analysis failed');
        const data: DiagnosisResult = await response.json();
        setResult(data);
      } else {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query }),
        });
        if (!response.ok) throw new Error('Analysis failed');
        const data = await response.json();
        setResult(data.result);
      }
    } catch {
      setError('Analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-white/50 bg-white/68 p-4 shadow-xl shadow-slate-950/18 backdrop-blur-md sm:p-5">
      {/* Mode Toggle */}
      <div className="mb-4 flex rounded-xl border border-white/40 bg-white/35 p-1 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={() => { setMode('text'); setResult(null); setPreview(null); setError(null); }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            mode === 'text' ? 'bg-white/92 text-emerald-700 shadow-sm border border-white/70' : 'text-slate-600 hover:bg-white/40 hover:text-slate-800'
          }`}
        >
          <Search size={16} />
          Describe Symptoms
        </button>
        <button
          type="button"
          onClick={() => { setMode('image'); setResult(null); setQuery(''); setError(null); }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
            mode === 'image' ? 'bg-white/92 text-emerald-700 shadow-sm border border-white/70' : 'text-slate-600 hover:bg-white/40 hover:text-slate-800'
          }`}
        >
          <Camera size={16} />
          Upload Photo
        </button>
      </div>

      {/* Input Area */}
      {!result && (
        <div className="rounded-2xl border border-white/55 bg-white/72 p-4 shadow-sm backdrop-blur-sm">
          {mode === 'text' ? (
            <>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g. My tomato leaves are turning yellow with brown spots and the plant is wilting…"
                className="w-full resize-none rounded-xl border border-slate-200/80 bg-white/78 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                rows={3}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_QUERIES.map((sq) => (
                  <button
                    key={sq.query}
                    type="button"
                    onClick={() => setQuery(sq.query)}
                    className="rounded-full border border-white/70 bg-white/72 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {sq.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !preview && fileRef.current?.click()}
              className={`relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                preview
                  ? 'border-transparent p-0 overflow-hidden'
                  : 'border-slate-300/80 bg-white/62 hover:border-emerald-400 hover:bg-emerald-50/70'
              }`}
            >
              {preview ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image src={preview} alt="Crop preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-gray-900 shadow hover:bg-white"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <span className="rounded-full bg-emerald-600/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                      ✓ Image ready to analyze
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 rounded-full bg-emerald-100 p-3 text-emerald-600">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Drop your crop photo here</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">JPG, PNG, WEBP — Max 10MB</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {error && (
            <p className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-bold text-red-600">
              <AlertTriangle size={14} /> {error}
            </p>
          )}

          <button
            type="button"
            onClick={analyze}
            disabled={loading || (mode === 'text' ? !query.trim() : !preview)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-md transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={16} /> Analyzing with AI…</>
            ) : (
              <><Microscope size={16} /> Diagnose My Crop</>
            )}
          </button>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-left">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm font-black text-emerald-800">
              Scanning 200+ crop diseases...
            </span>
          </div>
          <div className="space-y-3">
            {['Analyzing symptoms...', 'Matching against database...', 'Generating treatment protocol...'].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <CheckCircle size={14} className="text-emerald-300" />
                <div className="h-4 w-3/4 rounded-md bg-emerald-200/50 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Result Card ─────────────────────────────────── */}
      {result && !loading && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl text-left">
          {/* Header */}
          <div className={`flex items-start justify-between gap-3 p-5 border-b ${
            result.severity === 'Critical' ? 'bg-red-50 border-red-100' :
            result.severity === 'High' ? 'bg-orange-50 border-orange-100' :
            result.severity === 'Medium' ? 'bg-yellow-50 border-yellow-100' : 'bg-emerald-50 border-emerald-100'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm ${severityColor[result.severity]}`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">{result.disease}</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${severityColor[result.severity]}`}>
                    {result.severity}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-600">{result.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-full bg-white p-1.5 text-gray-400 shadow-sm hover:text-gray-900"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-5">
            {/* Treatment */}
            <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-1">Recommended Treatment</p>
              <p className="text-sm font-semibold text-emerald-900 leading-relaxed">{result.treatment}</p>
            </div>

            {/* Product Recommendations */}
            {result.products && result.products.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3">
                  Recommended Products
                </p>
                <div className="space-y-3">
                  {result.products.map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition hover:shadow-md ${
                        i === 0 ? 'border-emerald-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {i === 0 && (
                          <span className="mb-1 inline-block rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                            Top Match
                          </span>
                        )}
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{p.dosage}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-gray-900">₹{p.price}</p>
                        <Link
                          href={`/products/${p.id}`}
                          className="mt-2 flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                        >
                          <ShoppingCart size={12} /> Buy Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 bg-gray-50 p-5 border-t border-gray-100">
            <Link
              href="/products"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-700"
            >
              <ShoppingCart size={16} /> Shop All Treatments
            </Link>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroDiagnosisWidget;
