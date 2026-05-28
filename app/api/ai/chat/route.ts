import { NextResponse } from 'next/server';

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

const DISEASE_DB: { keywords: string[]; result: DiagnosisResult }[] = [
  {
    keywords: ['yellow leaves', 'yellowing', 'yellow', 'nitrogen', 'pale', 'chlorosis'],
    result: {
      disease: 'Nitrogen Deficiency (Chlorosis)',
      confidence: 0.88,
      severity: 'Medium',
      description: 'The plant shows classic nitrogen deficiency — older leaves turn yellow while young leaves stay green. Common in sandy soils or after heavy rains.',
      symptoms: ['Yellowing of older/lower leaves', 'Stunted growth', 'Pale green new leaves', 'Reduced stem thickness'],
      causes: ['Insufficient nitrogen in soil', 'Waterlogged roots blocking uptake', 'Alkaline pH locking nutrients'],
      treatment: 'Apply foliar urea spray (2% solution) immediately and follow with NPK 46-0-0 or DAP soil application. Ensure soil pH is 6.0-6.5.',
      products: [
        { id: '2', name: 'NPK 19:19:19 Water Soluble Fertilizer', dosage: '3g per liter — foliar spray weekly', price: 450, urgency: 'Apply within 48 hours', category: 'fertilizers' },
        { id: 'f2', name: 'Urea 46% N Granular Fertilizer', dosage: '25-30 kg per acre, soil application', price: 280, urgency: 'Apply this week', category: 'fertilizers' },
        { id: 'f3', name: 'Micronutrient Mix + Zinc Sulphate', dosage: '1.5g per liter foliar spray', price: 199, urgency: 'Apply alongside nitrogen', category: 'fertilizers' },
      ],
      prevention: ['Test soil before each season and correct pH', 'Split fertilizer doses', 'Use drip fertigation for steady nutrient delivery'],
      tips: ['Spray early morning or evening to avoid leaf burn', 'For severe deficiency, combine foliar + soil application', 'Re-check after 10 days; new growth should be green'],
    },
  },
  {
    keywords: ['brown spots', 'blight', 'early blight', 'alternaria', 'dark spots', 'circular spots'],
    result: {
      disease: 'Early Blight (Alternaria solani)',
      confidence: 0.91,
      severity: 'High',
      description: 'Fungal disease causing dark brown concentric ring spots on leaves. Starts on older leaves and spreads upward. Very common in tomato, potato, and brinjal.',
      symptoms: ['Dark brown spots with concentric rings', 'Yellow halo around spots', 'Leaf drop from bottom upward', 'Black lesions on stems'],
      causes: ['High humidity above 80%', 'Alternating wet and dry conditions', 'Infected seed or crop debris'],
      treatment: 'Remove infected leaves. Apply Mancozeb 75% WP at 2.5g/liter or Chlorothalonil 75% WP at 2g/liter every 7-10 days.',
      products: [
        { id: '5', name: 'Mancozeb Fungicide 75% WP', dosage: '2-2.5g per liter of water', price: 299, urgency: 'Apply within 24 hours', category: 'fungicides' },
        { id: 'f4', name: 'Copper Oxychloride 50% WP', dosage: '3g per liter — preventive spray', price: 185, urgency: 'Follow up in 7 days', category: 'fungicides' },
        { id: 'f5', name: 'Tebuconazole 25% EC Systemic Fungicide', dosage: '1ml per liter — curative', price: 420, urgency: 'Use if infection is severe', category: 'fungicides' },
      ],
      prevention: ['Avoid overhead irrigation; use drip', 'Remove and burn infected crop debris after harvest', 'Use certified disease-free seeds with proper spacing'],
      tips: ['Spray in the morning so leaves dry before evening', 'Alternate between contact and systemic fungicides', 'Stake plants to improve air circulation'],
    },
  },
  {
    keywords: ['white powder', 'powdery', 'white coating', 'mildew', 'white dust'],
    result: {
      disease: 'Powdery Mildew (Erysiphe sp.)',
      confidence: 0.93,
      severity: 'High',
      description: 'Powdery mildew forms white powder on leaf surfaces. Thrives in dry weather with cool nights.',
      symptoms: ['White powdery coating on leaves and stems', 'Distorted or curled leaves', 'Premature leaf drop', 'Stunted shoot growth'],
      causes: ['Low humidity + warm temperatures', 'Dense canopy with poor air flow', 'Excess nitrogen fertilization'],
      treatment: 'Spray Sulphur 80% WP at 3g/liter or Hexaconazole 5% SC at 2ml/liter. Repeat every 7 days.',
      products: [
        { id: 'f6', name: 'Wettable Sulphur 80% WP', dosage: '3g per liter — thorough spray', price: 145, urgency: 'Apply today', category: 'fungicides' },
        { id: 'f7', name: 'Hexaconazole 5% SC Systemic Fungicide', dosage: '2ml per liter of water', price: 310, urgency: 'Use for severe infection', category: 'fungicides' },
        { id: '4', name: 'Organic Neem Oil 10000 PPM', dosage: '5ml per liter + emulsifier', price: 850, urgency: 'Organic alternative', category: 'insecticides' },
      ],
      prevention: ['Maintain proper spacing for air circulation', 'Avoid excessive nitrogen', 'Apply preventive sulphur spray during dry weather'],
      tips: ['Do not spray sulphur when temperature is above 35 degrees C', 'Spray both upper and lower leaf surfaces', 'Clean equipment after use to prevent spread'],
    },
  },
  {
    keywords: ['wilting', 'wilt', 'dying', 'base', 'stem rot', 'collar rot', 'fusarium', 'root rot'],
    result: {
      disease: 'Fusarium Wilt / Root and Collar Rot',
      confidence: 0.85,
      severity: 'Critical',
      description: 'Soil-borne fungal pathogen attacking roots and stem base. Plants wilt suddenly even when soil is moist. Very difficult to cure once established.',
      symptoms: ['Sudden wilting despite adequate moisture', 'Brown discoloration of stem at ground level', 'Root blackening and decay', 'Yellow leaves on one side of plant'],
      causes: ['Waterlogged soil / poor drainage', 'Infected soil from previous crops', 'Overcrowding and poor sanitation'],
      treatment: 'Drench soil with Carbendazim 50% WP at 2g/liter + Copper Oxychloride at 3g/liter. Remove and destroy infected plants.',
      products: [
        { id: 'f8', name: 'Carbendazim 50% WP Soil Drench Fungicide', dosage: '2g per liter — drench root zone', price: 195, urgency: 'Apply immediately today', category: 'fungicides' },
        { id: 'f9', name: 'Trichoderma Viride Bio-fungicide', dosage: '5g per liter — drench + soil mix', price: 220, urgency: 'Use for prevention and recovery', category: 'organic' },
        { id: 'f10', name: 'Copper Oxychloride 50% WP', dosage: '3g per liter — preventive soil drench', price: 185, urgency: 'Follow up in 10 days', category: 'fungicides' },
      ],
      prevention: ['Improve drainage — avoid waterlogging', 'Practice 3-year crop rotation', 'Treat seeds with Trichoderma before sowing'],
      tips: ['Isolate infected plants immediately', 'Sterilize tools that touch infected plants', 'After harvest, deep plough and expose soil to sun for 3 weeks'],
    },
  },
  {
    keywords: ['insects', 'bugs', 'aphids', 'whitefly', 'holes in leaves', 'eating leaves', 'pest', 'attack', 'sucking'],
    result: {
      disease: 'Sucking Pest Complex (Aphids / Whitefly / Thrips)',
      confidence: 0.87,
      severity: 'High',
      description: 'Multiple sucking insects feeding on sap, causing yellowing, curling, and distortion of leaves. Whiteflies and aphids also spread viral diseases.',
      symptoms: ['Curling and distorted young leaves', 'Sticky honeydew on leaves', 'Small white insects flying when disturbed', 'Silver streaks on leaves'],
      causes: ['Hot dry weather favouring insect multiplication', 'Nearby weeds acting as alternate hosts', 'Absence of natural enemies'],
      treatment: 'Spray Imidacloprid 17.8% SL at 0.5ml/liter or Thiamethoxam 25% WG at 0.3g/liter. Cover both leaf surfaces. Repeat after 7-10 days.',
      products: [
        { id: 'i1', name: 'Imidacloprid 17.8% SL Systemic Insecticide', dosage: '0.3-0.5ml per liter of water', price: 285, urgency: 'Apply within 24 hours', category: 'insecticides' },
        { id: 'i2', name: 'Spinosad 45% SC Organic Insecticide', dosage: '0.5ml per liter — thrips control', price: 650, urgency: 'Rotate with Imidacloprid', category: 'insecticides' },
        { id: '4', name: 'Organic Neem Oil 10000 PPM', dosage: '5ml per liter + 2 drops soap', price: 850, urgency: 'Organic preventive option', category: 'insecticides' },
      ],
      prevention: ['Use yellow sticky traps to monitor insects', 'Maintain weed-free zone around field', 'Install reflective mulch to deter whiteflies'],
      tips: ['Spray early morning or late evening for best effect', 'Always cover the underside of leaves', 'Rotate insecticide groups to prevent resistance'],
    },
  },
  {
    keywords: ['rust', 'orange', 'red rust', 'reddish', 'pustules', 'rust spots'],
    result: {
      disease: 'Leaf Rust (Puccinia sp.)',
      confidence: 0.89,
      severity: 'High',
      description: 'Fungal rust disease causing orange-red powdery pustules on leaf undersides. Spreads rapidly via wind in humid conditions.',
      symptoms: ['Orange-red powdery pustules on leaf underside', 'Yellow-orange flecks on upper leaf surface', 'Premature leaf drying and fall', 'Weakened plant structure'],
      causes: ['High humidity and mild temperatures 15-25 degrees C', 'Dense canopy trapping moisture', 'Wind-borne spores from neighbouring fields'],
      treatment: 'Apply Propiconazole 25% EC at 1ml/liter or Tebuconazole 25% EC at 1ml/liter. Spray every 10-14 days.',
      products: [
        { id: 'f11', name: 'Propiconazole 25% EC Rust Fungicide', dosage: '1ml per liter — systemic action', price: 380, urgency: 'Apply within 24 hours', category: 'fungicides' },
        { id: 'f5', name: 'Tebuconazole 25% EC Systemic Fungicide', dosage: '1ml per liter of water', price: 420, urgency: 'Rotate with Propiconazole', category: 'fungicides' },
        { id: 'f6', name: 'Wettable Sulphur 80% WP', dosage: '3g per liter — preventive use', price: 145, urgency: 'Preventive follow-up spray', category: 'fungicides' },
      ],
      prevention: ['Use rust-resistant varieties where available', 'Apply preventive fungicide at booting stage', 'Ensure proper plant spacing for air movement'],
      tips: ['Start spray at first sign of disease', 'Spray in evening when wind is low', 'Repeat in 10-14 days for full control'],
    },
  },
  {
    keywords: ['caterpillar', 'worm', 'larvae', 'borer', 'stem borer', 'leaf roller', 'spodoptera', 'armyworm'],
    result: {
      disease: 'Caterpillar / Armyworm Infestation',
      confidence: 0.90,
      severity: 'Critical',
      description: 'Lepidopteran larvae cause severe defoliation, stem tunnelling, and fruit damage. Can destroy entire crop if not controlled in 24-48 hours.',
      symptoms: ['Irregular holes and tears in leaves', 'Frass on leaves and in shoots', 'Dead hearts in cereals from stem borer', 'Scraped leaf surface from armyworm'],
      causes: ['High pest pressure from neighbouring fields', 'Insufficient natural enemy population', 'Continuous cropping of same crop'],
      treatment: 'Spray Chlorpyrifos 20% EC at 2ml/liter or Emamectin Benzoate 5% SG at 0.5g/liter. Drench the canopy thoroughly. Repeat in 5-7 days.',
      products: [
        { id: 'i3', name: 'Emamectin Benzoate 5% SG Caterpillar Control', dosage: '0.4-0.5g per liter of water', price: 520, urgency: 'Apply TODAY — do not delay', category: 'insecticides' },
        { id: 'i4', name: 'Chlorpyrifos 20% EC Broad Spectrum', dosage: '2ml per liter, full canopy cover', price: 195, urgency: 'Emergency application', category: 'insecticides' },
        { id: 'i5', name: 'Spinosad 45% SC', dosage: '0.5ml per liter — organic option', price: 650, urgency: 'Organic alternative', category: 'insecticides' },
      ],
      prevention: ['Install pheromone traps to monitor adult moths', 'Practice intercropping as trap crops', 'Conserve natural predators'],
      tips: ['Spray at dusk when caterpillars are most active', 'Target growing point and leaf axils where larvae hide', 'Check pheromone trap catches daily for early warning'],
    },
  },
];

const DEFAULT_RESULT: DiagnosisResult = {
  disease: 'General Crop Stress — Further Diagnosis Needed',
  confidence: 0.65,
  severity: 'Medium',
  description: 'Based on your description, the plant may be experiencing multiple stress factors. For accurate diagnosis, please upload a clear photo of the affected leaf or stem.',
  symptoms: ['Visible leaf discoloration or lesions', 'Abnormal growth or wilting', 'Reduced crop vigor'],
  causes: ['Environmental stress', 'Nutrient imbalance', 'Possible fungal or bacterial infection'],
  treatment: 'Apply a broad-spectrum fungicide (Mancozeb 2.5g/L) + foliar micronutrient mix. Ensure proper irrigation and check soil pH.',
  products: [
    { id: '5', name: 'Mancozeb Fungicide 75% WP', dosage: '2.5g per liter — broad protection', price: 299, urgency: 'Apply as precaution', category: 'fungicides' },
    { id: '2', name: 'NPK 19:19:19 Water Soluble Fertilizer', dosage: '3g per liter foliar spray', price: 450, urgency: 'Boost plant immunity', category: 'fertilizers' },
  ],
  prevention: ['Maintain crop hygiene and remove diseased material', 'Regular scouting every 3-4 days'],
  tips: ['Upload a clear photo for a more accurate AI diagnosis', 'Contact our agronomy team on WhatsApp for expert help', 'Visit our Knowledge Hub for crop-specific guides'],
};

function mockDiagnose(message: string): DiagnosisResult {
  const lower = message.toLowerCase();
  for (const entry of DISEASE_DB) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.result;
    }
  }
  return DEFAULT_RESULT;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // To use real AI, replace mockDiagnose() with:
    // Google Gemini: import { GoogleGenerativeAI } from '@google/generative-ai'
    //   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    //   const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    //   const result = await model.generateContent(`Diagnose: ${message}`)
    // OR OpenAI: import OpenAI from 'openai' — see SUPABASE_HOSTINGER_GUIDE.md

    const result = mockDiagnose(message);

    return NextResponse.json({
      reply: `Diagnosis complete: ${result.disease} detected with ${Math.round(result.confidence * 100)}% confidence.`,
      result,
    });
  } catch (error) {
    console.error('AgriBot Chat Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
