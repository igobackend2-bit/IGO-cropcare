'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Microscope, ShoppingCart, CheckCircle, AlertTriangle, Leaf } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface DiagnosisResult {
  disease: string
  confidence: number
  recommendation: string
}

export default function CropDiagnosticPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleAnalyze = async () => {
    if (!preview) return
    setIsAnalyzing(true)
    setResult(null)

    try {
      // Convert base64 preview to Blob and upload
      const res = await fetch(preview)
      const blob = await res.blob()
      const formData = new FormData()
      formData.append('image', blob, 'crop.jpg')

      const response = await fetch('/api/ai/vision', {
        method: 'POST',
        body: formData,
      })
      const data: DiagnosisResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const confidencePct = result ? Math.round(result.confidence * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            AI Crop Disease Detector
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Upload a photo of your diseased crop and our AI will diagnose the issue and recommend the right treatment from our store.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-64 ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
              : preview
              ? 'border-transparent p-0 overflow-hidden'
              : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-slate-900 hover:bg-primary-50/30 dark:hover:bg-primary-900/10'
          }`}
        >
          {preview ? (
            <div className="relative w-full h-72 rounded-2xl overflow-hidden group">
              <Image src={preview} alt="Crop preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Click to change image</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
                Drag &amp; drop or click to upload
              </p>
              <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, WEBP</p>
            </>
          )}
        </motion.div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* Analyze Button */}
        <AnimatePresence>
          {preview && !isAnalyzing && !result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAnalyze}
                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20"
              >
                <Microscope className="w-6 h-6" />
                Analyze Crop Disease
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm"
            >
              <div className="inline-flex gap-2 mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-semibold">
                AI is analyzing your crop image…
              </p>
              <p className="text-slate-400 text-sm mt-1">This usually takes a few seconds</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{result.disease}</h2>
                  <p className="text-slate-500 text-sm">Disease Identified</p>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  <span>AI Confidence</span>
                  <span className="text-primary-600 font-bold">{confidencePct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePct}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-5 mb-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary-800 dark:text-primary-300 mb-1">Treatment Recommendation</p>
                    <p className="text-primary-700 dark:text-primary-400 text-sm">{result.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <motion.a
                  whileTap={{ scale: 0.97 }}
                  href="/products?category=pesticides"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Shop Treatment
                </motion.a>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setPreview(null); setResult(null) }}
                  className="px-6 py-3 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Try Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it Works */}
        {!preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4 text-center"
          >
            {[
              { icon: '📷', title: 'Upload Photo', desc: 'Take or upload a clear photo of the affected plant part' },
              { icon: '🤖', title: 'AI Analysis', desc: 'Our vision AI scans for 50+ crop diseases in seconds' },
              { icon: '💊', title: 'Get Treatment', desc: 'Receive targeted product recommendations instantly' },
            ].map((step, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{step.title}</h3>
                <p className="text-slate-400 text-xs">{step.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
