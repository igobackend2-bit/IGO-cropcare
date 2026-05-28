import { NextResponse } from 'next/server';

// ─── Vision AI Route ───────────────────────────────────────────────────────
// Currently uses an intelligent mock that returns realistic disease data.
// To integrate a real vision model, replace the mockVisionDiagnose() body:
//
//  OPTION A – Google Gemini Vision:
//  import { GoogleGenerativeAI } from '@google/generative-ai'
//  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
//  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
//  const imageData = { inlineData: { data: base64, mimeType: 'image/jpeg' } }
//  const prompt = `You are an expert plant pathologist. Analyze this crop photo and
//    identify any disease, pest, or nutrient deficiency. Return a JSON matching this
//    TypeScript interface: { disease, confidence, severity, description, symptoms,
//    causes, treatment, products: [{id,name,dosage,price,urgency,category}],
//    prevention, tips }`
//  const result = await model.generateContent([prompt, imageData])
//  return JSON.parse(result.response.text())
//
//  OPTION B – OpenAI GPT-4 Vision:
//  import OpenAI from 'openai'
//  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//  const completion = await openai.chat.completions.create({
//    model: 'gpt-4-vision-preview',
//    messages: [{ role: 'user', content: [
//      { type: 'text', text: 'Diagnose the crop disease in this image. Return JSON with: disease, confidence (0-1), severity (Low/Medium/High/Critical), description, symptoms (array), causes (array), treatment, products (array of {id,name,dosage,price,urgency,category}), prevention (array), tips (array).' },
//      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
//    ]}]
//  })
//  return JSON.parse(completion.choices[0].message.content!)
// ─────────────────────────────────────────────────────────────────────────────

const VISION_DIAGNOSES = [
  {
    disease: 'Late Blight (Phytophthora infestans)',
    confidence: 0.94,
    severity: 'Critical' as const,
    description:
      'Phytophthora infestans detected — a destructive oomycete causing rapid leaf and stem decay. Common in tomato and potato during cool, humid weather. Can wipe out a field in 3–5 days.',
    symptoms: [
      'Dark water-soaked lesions on leaf edges',
      'White mold on leaf undersides in humid mornings',
      'Brown-black stems at soil level',
      'Rapidly spreading lesions across the canopy',
    ],
    causes: [
      'Night temperatures below 15°C combined with high humidity',
      'Overhead irrigation or prolonged rain',
      'Infected seed tubers or transplants',
    ],
    treatment:
      'Apply Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5g/liter immediately. Repeat every 5–7 days. Remove and destroy infected parts. Avoid wetting leaves during irrigation.',
    products: [
      {
        id: 'f12',
        name: 'Ridomil Gold (Metalaxyl 4% + Mancozeb 64%)',
        dosage: '2.5g per liter of water',
        price: 680,
        urgency: 'Apply IMMEDIATELY today',
        category: 'fungicides',
      },
      {
        id: 'f13',
        name: 'Cymoxanil 8% + Mancozeb 64% WP',
        dosage: '2g per liter — alternating spray',
        price: 390,
        urgency: 'Follow up in 5–7 days',
        category: 'fungicides',
      },
      {
        id: 'f4',
        name: 'Copper Oxychloride 50% WP',
        dosage: '3g per liter — protective coat',
        price: 185,
        urgency: 'Apply between main sprays',
        category: 'fungicides',
      },
    ],
    prevention: [
      'Plant in raised beds with good drainage',
      'Use resistant varieties (e.g., Arka Rakshak tomato)',
      'Apply preventive copper spray before monsoon season',
    ],
    tips: [
      'Spray coverage must be 100% — use a high-pressure sprayer',
      'Start spray at first symptom — do not wait',
      'Dispose of infected debris away from field (burn or bury deep)',
    ],
  },
  {
    disease: 'Bacterial Leaf Spot (Xanthomonas sp.)',
    confidence: 0.87,
    severity: 'High' as const,
    description:
      'Bacterial pathogen causing water-soaked spots that turn brown with yellow halos. Spreads through rain splash, contaminated tools, and infected seeds. Common in tomato, capsicum, and cucurbits.',
    symptoms: [
      'Water-soaked circular spots turning brown',
      'Yellow halo surrounding lesions',
      'Spots angular in shape (limited by leaf veins)',
      'Defoliation in severe cases',
    ],
    causes: [
      'Warm temperatures (25–30°C) with high humidity',
      'Contaminated irrigation water or rain splash',
      'Seed-borne infection from uncertified seeds',
    ],
    treatment:
      'Spray Copper Hydroxide 77% WP @ 2.5g/liter or Streptomycin Sulphate @ 500ppm. Remove infected leaves immediately. Improve air circulation and switch to drip irrigation.',
    products: [
      {
        id: 'b1',
        name: 'Copper Hydroxide 77% WP (Kocide)',
        dosage: '2.5g per liter — bactericide',
        price: 320,
        urgency: 'Apply within 24 hours',
        category: 'fungicides',
      },
      {
        id: 'b2',
        name: 'Streptomycin + Tetracycline Bactericide',
        dosage: '0.1g per liter of water',
        price: 145,
        urgency: 'Use for severe bacterial infection',
        category: 'fungicides',
      },
      {
        id: '5',
        name: 'Mancozeb Fungicide 75% WP',
        dosage: '2.5g per liter — combined protection',
        price: 299,
        urgency: 'Combine with copper spray',
        category: 'fungicides',
      },
    ],
    prevention: [
      'Use certified, hot-water treated seeds',
      'Avoid overhead irrigation — use drip system',
      'Disinfect cutting tools with 1% bleach solution between plants',
    ],
    tips: [
      'Copper sprays work best as preventive and early curative',
      "Don't spray copper above 30°C — causes phytotoxicity",
      'Allow field to dry between irrigations',
    ],
  },
  {
    disease: 'Powdery Mildew (Erysiphe cichoracearum)',
    confidence: 0.92,
    severity: 'High' as const,
    description:
      'White powdery growth of fungal mycelium on leaf surfaces. Unlike most fungi, it thrives in dry conditions with 45–70% humidity and moderate temperatures (20–25°C). Common in cucurbits, grapes, and solanaceous crops.',
    symptoms: [
      'White powdery coating on upper leaf surface',
      'Affected leaves curl upward and become brittle',
      'Stunted shoot tips and distorted young leaves',
      'Yellowing followed by premature leaf death',
    ],
    causes: [
      'Dry weather with cool nights (low humidity paradoxically favours this fungus)',
      'Poor air circulation in dense or overcrowded canopy',
      'Excess nitrogen fertilization promoting soft leaf growth',
    ],
    treatment:
      'Spray Sulphur 80% WP @ 3g/liter or Hexaconazole 5% SC @ 2ml/liter. Ensure thorough coverage of both leaf surfaces. Apply every 7 days for 3 consecutive sprays.',
    products: [
      {
        id: 'f6',
        name: 'Wettable Sulphur 80% WP',
        dosage: '3g per liter — immediate control',
        price: 145,
        urgency: 'Apply today',
        category: 'fungicides',
      },
      {
        id: 'f7',
        name: 'Hexaconazole 5% SC Systemic Fungicide',
        dosage: '2ml per liter of water',
        price: 310,
        urgency: 'Follow up in 7 days',
        category: 'fungicides',
      },
      {
        id: '4',
        name: 'Neem Oil 10000 PPM Organic Fungicide',
        dosage: '5ml per liter + emulsifier',
        price: 850,
        urgency: 'Organic preventive option',
        category: 'insecticides',
      },
    ],
    prevention: [
      'Avoid overhead irrigation — use drip system',
      'Maintain proper plant spacing (50cm+) for air circulation',
      'Apply sulphur preventively every 2 weeks during susceptible period',
    ],
    tips: [
      'Do not spray sulphur when temperature exceeds 35°C',
      'Spray both upper and lower leaf surfaces completely',
      'Early morning spraying gives best results before sun intensity peaks',
    ],
  },
];

let diagnosisIndex = 0;

function mockVisionDiagnose() {
  // Cycles through diagnoses to demo different scenarios on repeated use
  const result = VISION_DIAGNOSES[diagnosisIndex % VISION_DIAGNOSES.length];
  diagnosisIndex++;
  return result;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    if (image instanceof Blob) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(image.type)) {
        return NextResponse.json(
          { error: 'Unsupported image format. Use JPG, PNG, or WEBP.' },
          { status: 400 }
        );
      }
    }

    // ─── Replace this block with real AI vision call (see comments at top) ───
    const result = mockVisionDiagnose();
    // ──────────────────────────────────────────────────────────────────────────

    return NextResponse.json(result);
  } catch (error) {
    console.error('Vision AI Error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
