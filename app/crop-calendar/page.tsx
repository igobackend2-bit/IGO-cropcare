'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Sprout, Droplets, Bug, Leaf, ChevronRight, Info, ShoppingCart } from 'lucide-react'

// Static export for this page
// export const metadata: Metadata = { ... } // Can't use in 'use client' — handled via layout override

interface CropData {
  name: string
  emoji: string
  season: string
  sowingMonths: string
  harvestMonths: string
  duration: string
  schedule: WeeklyTask[]
}

interface WeeklyTask {
  week: string
  label: string
  type: 'sowing' | 'fertilizer' | 'pesticide' | 'irrigation' | 'harvest'
  task: string
  product?: string
  productCategory?: string
}

const CROP_CALENDARS: Record<string, CropData> = {
  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    season: 'Kharif / Rabi',
    sowingMonths: 'June–July (Kharif) / Oct–Nov (Rabi)',
    harvestMonths: 'Oct–Dec / Feb–Apr',
    duration: '90–120 days',
    schedule: [
      { week: 'Week 1–2', label: 'Nursery / Sowing', type: 'sowing', task: 'Prepare nursery beds. Sow seeds 1–1.5cm deep in coco-peat or well-drained soil. Treat seeds with bio-fungicide to prevent damping-off.', product: 'Trichoderma Seed Treatment', productCategory: 'fungicides' },
      { week: 'Week 3–4', label: 'Transplanting', type: 'sowing', task: 'Transplant 25–30 day old seedlings (15–20cm tall) at 60×45cm spacing. Apply basal dose of DAP + MOP.', product: 'DAP Fertilizer', productCategory: 'fertilizers' },
      { week: 'Week 5–6', label: 'Vegetative Growth', type: 'fertilizer', task: 'Apply NPK 19:19:19 via drip or foliar spray. Install stakes for support. Ensure drip irrigation every 2 days.', product: 'NPK 19:19:19 Water Soluble', productCategory: 'fertilizers' },
      { week: 'Week 7–8', label: 'Pest Watch', type: 'pesticide', task: 'Scout for whiteflies, thrips, and aphids. Spray neem oil (5ml/L) as preventive. Remove lower infected leaves.', product: 'Organic Neem Oil', productCategory: 'organic' },
      { week: 'Week 9–10', label: 'Flowering', type: 'fertilizer', task: 'Switch to high-phosphorus fertilizer (12:61:0) at 2g/L. Spray boron at 1g/L to improve fruit set. Apply Mancozeb if early blight symptoms appear.', product: 'Mancozeb Fungicide 75% WP', productCategory: 'fungicides' },
      { week: 'Week 11–12', label: 'Fruit Development', type: 'fertilizer', task: 'Apply potassium nitrate (13:0:45) at 3g/L. Avoid over-irrigation to prevent blossom end rot. Monitor for fruit borers.', product: 'Potassium Nitrate 13:0:45', productCategory: 'fertilizers' },
      { week: 'Week 13–15', label: 'Ripening', type: 'irrigation', task: 'Reduce irrigation frequency. Spray calcium foliar (2g/L) to firm up fruits. Avoid nitrogen application.', product: 'Calcium Foliar', productCategory: 'micronutrients' },
      { week: 'Week 16+', label: 'Harvest', type: 'harvest', task: 'Harvest when fruits turn 50–70% red (for transport) or fully red (for local market). Pick every 3–4 days.', product: undefined, productCategory: undefined },
    ],
  },
  paddy: {
    name: 'Paddy / Rice',
    emoji: '🌾',
    season: 'Kharif',
    sowingMonths: 'June–July',
    harvestMonths: 'October–November',
    duration: '100–150 days',
    schedule: [
      { week: 'Week 1–2', label: 'Nursery Preparation', type: 'sowing', task: 'Prepare nursery beds. Soak seeds in water for 24 hours, then incubate for 24 hours. Treat with carbendazim (2g/kg seed) before sowing.', product: 'Carbendazim 50% WP', productCategory: 'fungicides' },
      { week: 'Week 3', label: 'Transplanting', type: 'sowing', task: 'Transplant 21–25 day old seedlings in puddled field at 20×15cm spacing. Apply basal dose of DAP (50 kg/acre).', product: 'DAP Fertilizer', productCategory: 'fertilizers' },
      { week: 'Week 4–5', label: 'Tillering', type: 'fertilizer', task: 'Apply urea (25 kg/acre) at active tillering stage. Control weeds using 2,4-D Amine (500ml/acre) at 20–25 DAT.', product: '2,4-D Amine Salt Herbicide', productCategory: 'herbicides' },
      { week: 'Week 6–7', label: 'Pest Watch', type: 'pesticide', task: 'Monitor for stem borer and leaf folder. Apply Chlorpyrifos 20% EC (800ml/acre) if damage threshold is crossed.', product: 'Chlorpyrifos 20% EC', productCategory: 'insecticides' },
      { week: 'Week 8–9', label: 'Panicle Initiation', type: 'fertilizer', task: 'Apply potassium (MOP 25 kg/acre) + urea (12 kg/acre) top dressing. Maintain 5cm water level.', product: 'MOP (Muriate of Potash)', productCategory: 'fertilizers' },
      { week: 'Week 10–12', label: 'Flowering', type: 'pesticide', task: 'Spray systemic fungicide if sheath blight is observed. Maintain water level at panicle emergence.', product: 'Hexaconazole 5% EC', productCategory: 'fungicides' },
      { week: 'Week 13–16', label: 'Grain Filling', type: 'irrigation', task: 'Reduce irrigation. Alternate wetting and drying to improve grain quality. Stop irrigation 10 days before harvest.', product: undefined, productCategory: undefined },
      { week: 'Week 17–21', label: 'Harvest', type: 'harvest', task: 'Harvest when 80–85% of grains turn golden yellow (straw-coloured). Use combine harvester or manual cutting.', product: undefined, productCategory: undefined },
    ],
  },
  wheat: {
    name: 'Wheat',
    emoji: '🌻',
    season: 'Rabi',
    sowingMonths: 'November–December',
    harvestMonths: 'March–April',
    duration: '110–150 days',
    schedule: [
      { week: 'Week 1', label: 'Land Prep & Sowing', type: 'sowing', task: 'Deep plough, apply FYM (5 tonnes/acre). Sow seeds at 100kg/acre, 4–5cm depth. Apply basal DAP 50kg + MOP 25kg/acre.', product: 'DAP Fertilizer', productCategory: 'fertilizers' },
      { week: 'Week 2–3', label: 'Germination', type: 'irrigation', task: 'Apply first irrigation (Crown Root Initiation - CRI) at 20–25 DAS. This is critical for tillering.', product: undefined, productCategory: undefined },
      { week: 'Week 4–5', label: 'Tillering', type: 'fertilizer', task: 'Apply urea (30kg/acre) with first irrigation. Control broad-leaf weeds with Metsulfuron 20% WP (8g/acre).', product: 'Metsulfuron Herbicide', productCategory: 'herbicides' },
      { week: 'Week 6–8', label: 'Stem Elongation', type: 'fertilizer', task: 'Apply second irrigation. Apply sulphur (10kg/acre) if deficiency symptoms noticed. Watch for aphids.', product: 'Sulphur 80% WG', productCategory: 'fertilizers' },
      { week: 'Week 9–12', label: 'Jointing/Booting', type: 'pesticide', task: 'Apply Propiconazole (200ml/acre) to prevent yellow rust if symptoms appear. Third irrigation at boot stage.', product: 'Propiconazole 25% EC', productCategory: 'fungicides' },
      { week: 'Week 13–16', label: 'Grain Filling', type: 'irrigation', task: 'Apply fourth irrigation at grain filling. Avoid over-irrigation. No nitrogen at this stage.', product: undefined, productCategory: undefined },
      { week: 'Week 17–21', label: 'Harvest', type: 'harvest', task: 'Harvest when grain moisture is 12–14% (grain hard, golden colour). Use combine harvester for large fields.', product: undefined, productCategory: undefined },
    ],
  },
  cotton: {
    name: 'Cotton',
    emoji: '☁️',
    season: 'Kharif',
    sowingMonths: 'April–June',
    harvestMonths: 'October–January',
    duration: '150–180 days',
    schedule: [
      { week: 'Week 1–2', label: 'Sowing', type: 'sowing', task: 'Sow BT Cotton seeds at 1–2 seeds per hill, 90×60cm spacing. Treat seeds with Imidacloprid 70% WS to prevent early sucking pest damage.', product: 'Imidacloprid Seed Treatment', productCategory: 'insecticides' },
      { week: 'Week 3–5', label: 'Early Growth', type: 'fertilizer', task: 'Apply basal urea (25kg/acre) + DAP (50kg/acre). Control weeds manually or with Pendimethalin pre-emergence herbicide.', product: 'Pendimethalin 30% EC', productCategory: 'herbicides' },
      { week: 'Week 6–8', label: 'Squaring', type: 'fertilizer', task: 'Apply second dose urea (25kg/acre). Spray K₂SO₄ (5g/L) foliar to improve boll retention. Monitor for whitefly.', product: 'Potassium Sulphate 0:0:50', productCategory: 'fertilizers' },
      { week: 'Week 9–12', label: 'Flowering & Boll Set', type: 'pesticide', task: 'Critical pest monitoring period. Spray Spinosad (50ml/acre) for pink bollworm if threshold crossed. Spray boron + calcium for boll retention.', product: 'Spinosad 45% SC', productCategory: 'insecticides' },
      { week: 'Week 13–18', label: 'Boll Development', type: 'pesticide', task: 'Continue monitoring for sucking pests and bollworm. Spray systemic insecticides in rotation to prevent resistance.', product: 'Thiamethoxam 25% WG', productCategory: 'insecticides' },
      { week: 'Week 19–26', label: 'Harvest', type: 'harvest', task: 'Pick cotton in 2–3 rounds when 60–70% of bolls are open. Avoid picking in wet conditions.', product: undefined, productCategory: undefined },
    ],
  },
  chilli: {
    name: 'Chilli',
    emoji: '🌶️',
    season: 'Kharif / Rabi',
    sowingMonths: 'June–July / October–November',
    harvestMonths: 'October–March',
    duration: '120–150 days',
    schedule: [
      { week: 'Week 1–3', label: 'Nursery', type: 'sowing', task: 'Prepare raised nursery beds. Sow seeds 0.5–1cm deep. Drench nursery with Carbendazim (1g/L) to prevent damping-off.', product: 'Carbendazim 50% WP', productCategory: 'fungicides' },
      { week: 'Week 4–5', label: 'Transplanting', type: 'sowing', task: 'Transplant 30–35 day seedlings at 60×45cm spacing. Apply basal FYM + DAP. Install drip lines.', product: 'DAP Fertilizer', productCategory: 'fertilizers' },
      { week: 'Week 6–8', label: 'Vegetative Growth', type: 'fertilizer', task: 'Apply NPK 19:19:19 via drip (2kg/acre). Spray neem oil weekly to suppress thrips and mites.', product: 'NPK 19:19:19 Water Soluble', productCategory: 'fertilizers' },
      { week: 'Week 9–11', label: 'Flowering', type: 'fertilizer', task: 'Apply MOP (15kg/acre) + boron (1g/L foliar). Monitor for chilli thrips and broad mites.', product: 'MOP (Muriate of Potash)', productCategory: 'fertilizers' },
      { week: 'Week 12–15', label: 'Fruit Set', type: 'pesticide', task: 'Spray Profenofos + Cypermethrin for fruit borer. Apply copper-based fungicide if anthracnose symptoms appear.', product: 'Copper Fungicide WP', productCategory: 'fungicides' },
      { week: 'Week 16–21', label: 'Harvest', type: 'harvest', task: 'Pick green chillies from 75 DAS. For red chillies, allow full maturation. Harvest every 7–10 days.', product: undefined, productCategory: undefined },
    ],
  },
}

const TYPE_CONFIG = {
  sowing:     { color: 'bg-green-100 text-green-800 border-green-200',    icon: Sprout,   label: 'Sowing/Transplanting' },
  fertilizer: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Leaf,     label: 'Fertilization' },
  pesticide:  { color: 'bg-red-100 text-red-800 border-red-200',          icon: Bug,      label: 'Crop Protection' },
  irrigation: { color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: Droplets, label: 'Irrigation' },
  harvest:    { color: 'bg-amber-100 text-amber-800 border-amber-200',     icon: Calendar, label: 'Harvest' },
}

export default function CropCalendarPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato')
  const crop = CROP_CALENDARS[selectedCrop]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Calendar className="w-14 h-14 mx-auto mb-4 text-emerald-100" />
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Crop Calendar & Planner</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Week-by-week seasonal input schedule for major Indian crops — with exact product recommendations and dosages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-600 font-semibold transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">Crop Calendar</span>
        </nav>

        {/* Crop Selector */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-extrabold text-gray-800 mb-4 text-sm uppercase tracking-wide">Select Your Crop</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CROP_CALENDARS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedCrop(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition ${
                  selectedCrop === key
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                }`}
              >
                <span>{data.emoji}</span> {data.name}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Overview Card */}
        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap gap-6 items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{crop.emoji}</span>
                <h2 className="text-2xl font-extrabold text-gray-900">{crop.name} Calendar</h2>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-700">Season:</span> {crop.season} &nbsp;·&nbsp;
                <span className="font-bold text-gray-700">Duration:</span> {crop.duration}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div><span className="font-bold text-gray-600">Sowing Window:</span> <span className="text-green-700 font-bold">{crop.sowingMonths}</span></div>
              <div><span className="font-bold text-gray-600">Harvest Period:</span> <span className="text-amber-700 font-bold">{crop.harvestMonths}</span></div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <div key={type} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.color}`}>
              <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
            </div>
          ))}
        </div>

        {/* Schedule Timeline */}
        <div className="space-y-4">
          {crop.schedule.map((task, idx) => {
            const cfg = TYPE_CONFIG[task.type]
            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4">
                {/* Week badge */}
                <div className="flex-shrink-0">
                  <div className="bg-gray-900 text-white rounded-xl px-4 py-2 text-center min-w-[100px]">
                    <div className="text-xs text-gray-400 font-semibold">{task.week}</div>
                    <div className="text-sm font-extrabold leading-tight">{task.label}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                      <cfg.icon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{task.task}</p>
                </div>

                {/* Product link */}
                {task.product && task.productCategory && (
                  <div className="flex-shrink-0 flex items-start">
                    <Link
                      href={`/products?category=${task.productCategory}`}
                      className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {task.product}
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Advisory note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-8 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">Advisory Disclaimer</p>
            <p className="text-amber-700 text-xs leading-relaxed">
              This calendar provides general guidance based on typical agro-climatic conditions. Actual crop performance
              depends on soil type, local weather, variety, and field conditions. Always consult a certified agronomist or
              your local KVK for region-specific advice. Product dosages should be verified from manufacturer labels.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/crop-doctor"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-extrabold text-lg mb-1">AI Crop Doctor</h3>
            <p className="text-emerald-100 text-sm">Diagnose disease symptoms instantly — upload a photo</p>
          </Link>
          <Link
            href="/products"
            className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🛒</div>
            <h3 className="font-extrabold text-lg mb-1">Shop Crop Inputs</h3>
            <p className="text-gray-300 text-sm">All products from this calendar available online</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
