// lib/products-data.ts
// ─── IGO CropCare — Chemica Fertilizers Real Product Catalog ─────────────────
// All images are in /public/products/chemica/ (clean, space-free filenames)
// 16 products mapped 1:1 to actual uploaded images

export interface ExtendedProduct {
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  category: string;
  subCategory: string;
  price: number;
  mrp: number;
  discount: number;
  image_url: string;
  rating: number;
  reviews_count: number;
  stock: number;
  brand: string;
  dosage: string;
  composition: string;
  crops: string[];
  badge?: string;
  isOrganic: boolean;
  tags: string[];
  aiImagePrompt: string;
}

// ─── CHEMICAL FERTILIZERS (6 products) ───────────────────────────────────────

export const CHEMICAL_FERTILIZERS: ExtendedProduct[] = [
  {
    id: 'ch-f-001',
    name: 'Chemica Urea 45kg (Neem Coated)',
    description: 'Neem-coated granular urea with 46% Nitrogen — the most widely used nitrogenous fertilizer in India. Neem coating slows nitrification, reducing nitrogen losses by up to 15% and prolonging availability to roots. Supports vigorous vegetative growth, deep green foliage and high yield in all major crops. Government MRP product with pan-India availability.',
    shortDesc: 'Neem-coated urea — 46% N, reduces nitrogen loss by 15%',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 267,
    mrp: 267,
    discount: 0,
    image_url: '/products/chemica/urea.png',
    rating: 4.7,
    reviews_count: 4210,
    stock: 1000,
    brand: 'Chemica',
    dosage: '25–30 kg per acre as top dressing at 25–30 DAS',
    composition: 'Nitrogen (N) 46% as Urea + Neem Oil coating 0.5%',
    crops: ['Paddy', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Vegetables', 'All Crops'],
    badge: '🌾 Govt. MRP',
    isOrganic: false,
    tags: ['urea', 'nitrogen', 'neem-coated', 'granular', 'top-dressing'],
    aiImagePrompt: 'Chemica Urea neem coated 45kg white bag fertilizer',
  },
  {
    id: 'ch-f-002',
    name: 'Chemica DAP 50kg (Di-Ammonium Phosphate)',
    description: 'Premium Di-Ammonium Phosphate — the gold standard phosphatic fertilizer for Indian agriculture. With 46% P₂O₅ and 18% N, DAP provides high phosphorus for root establishment, early growth and flowering. Applied as basal dose before sowing for all field and horticultural crops. One of the most consumed fertilizers in India.',
    shortDesc: 'Gold-standard phosphatic fertilizer — basal dose for all crops',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 1350,
    mrp: 1500,
    discount: 10,
    image_url: '/products/chemica/dap.png',
    rating: 4.8,
    reviews_count: 3892,
    stock: 500,
    brand: 'Chemica',
    dosage: '50–60 kg per acre as basal dose before or at sowing',
    composition: 'Nitrogen (N) 18% + Phosphorus (P₂O₅) 46%',
    crops: ['Paddy', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'All Crops'],
    badge: '🏆 Most Popular',
    isOrganic: false,
    tags: ['dap', 'phosphorus', 'basal', 'nitrogen', 'fertilizer'],
    aiImagePrompt: 'Chemica DAP Di-Ammonium Phosphate 50kg grey bag fertilizer',
  },
  {
    id: 'ch-f-003',
    name: 'Chemica Ammonium Nitrate (34% N)',
    description: 'High-analysis nitrogen fertilizer with equal parts ammonical and nitrate nitrogen. The dual nitrogen form provides both immediate (nitrate) and sustained (ammonical) nutrition. Highly soluble and fast-acting. Preferred for fertigation, top dressing and hi-tech horticulture where precision nutrition is essential.',
    shortDesc: 'Dual-form N — immediate + sustained nitrogen for fertigation',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 580,
    mrp: 750,
    discount: 23,
    image_url: '/products/chemica/ammonium-nitrate.png',
    rating: 4.6,
    reviews_count: 876,
    stock: 400,
    brand: 'Chemica',
    dosage: '20–25 kg per acre as top dressing or 2–3g/L via fertigation',
    composition: 'Ammonium Nitrate — Nitrogen (N) 34% (17% NO₃⁻ + 17% NH₄⁺)',
    crops: ['Vegetables', 'Fruits', 'Floriculture', 'Potato', 'Onion', 'Grapes'],
    badge: '⚡ Fast + Sustained',
    isOrganic: false,
    tags: ['ammonium-nitrate', 'nitrogen', 'fertigation', 'dual-form'],
    aiImagePrompt: 'Chemica Ammonium Nitrate 34N fertilizer granular bag product',
  },
  {
    id: 'ch-f-004',
    name: 'Chemica Ammonium Sulphate (21% N + 24% S)',
    description: 'Nitrogen and sulphur fertilizer in ammonical form. Particularly beneficial for oilseed crops, pulses and alkaline soils where sulphur deficiency is common. Lowers soil pH slightly making it ideal for alkaline black cotton soils. Sulphur improves protein content, oil percentage in oilseeds and pungency in onion-garlic.',
    shortDesc: '21% N + 24% S — ideal for oilseeds and alkaline soils',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 420,
    mrp: 560,
    discount: 25,
    image_url: '/products/chemica/ammonium-sulphate.png',
    rating: 4.5,
    reviews_count: 1245,
    stock: 600,
    brand: 'Chemica',
    dosage: '25–30 kg per acre basal or top dressing',
    composition: 'Nitrogen (N) 21% + Sulphur (S) 24% as Ammonium Sulphate',
    crops: ['Groundnut', 'Mustard', 'Sunflower', 'Onion', 'Garlic', 'Paddy', 'Tea'],
    isOrganic: false,
    tags: ['ammonium-sulphate', 'nitrogen', 'sulphur', 'oilseeds'],
    aiImagePrompt: 'Chemica Ammonium Sulphate 21N white crystalline fertilizer bag',
  },
  {
    id: 'ch-f-005',
    name: 'Chemica CAN (Calcium Ammonium Nitrate)',
    description: 'Calcium Ammonium Nitrate provides nitrogen in ammonical + nitrate form along with calcium. Ideal for acid soils as calcium neutralizes soil acidity. Prevents blossom end rot in tomato and tip burn in lettuce. Non-acidifying nitrogen source widely used in European-style precision farming and Indian hi-tech greenhouses.',
    shortDesc: 'CAN — nitrogen + calcium for acid soils and greenhouse crops',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 680,
    mrp: 880,
    discount: 23,
    image_url: '/products/chemica/calcium-ammonium-nitrate.png',
    rating: 4.7,
    reviews_count: 654,
    stock: 350,
    brand: 'Chemica',
    dosage: '25–30 kg per acre as top dressing or 2–3g/L fertigation',
    composition: 'Nitrogen (N) 26% + Calcium (Ca) 8% as CAN',
    crops: ['Tomato', 'Capsicum', 'Lettuce', 'Strawberry', 'Floriculture', 'Potato'],
    badge: '🌱 Greenhouse Preferred',
    isOrganic: false,
    tags: ['can', 'calcium-ammonium-nitrate', 'calcium', 'nitrogen', 'greenhouse'],
    aiImagePrompt: 'Chemica CAN Calcium Ammonium Nitrate 26N fertilizer granular bag',
  },
  {
    id: 'ch-f-006',
    name: 'Chemica Sodium Nitrate (16% N)',
    description: 'Water-soluble sodium nitrate providing nitrate nitrogen for rapid uptake. Particularly effective in low-temperature soils where ammonical forms are slow. Used in fertigation for leafy vegetables, beet crops and greenhouse production. Also supplies sodium for beet and celery crops. Ideal as supplemental N during fruiting.',
    shortDesc: 'Sodium nitrate — rapid nitrate-N uptake, ideal for cool soils',
    category: 'fertilizers',
    subCategory: 'chemical',
    price: 540,
    mrp: 699,
    discount: 23,
    image_url: '/products/chemica/sodium-nitrate.png',
    rating: 4.4,
    reviews_count: 432,
    stock: 300,
    brand: 'Chemica',
    dosage: '10–15 kg per acre or 1–2g/L via fertigation',
    composition: 'Nitrogen (N) 16% as Sodium Nitrate (NaNO₃)',
    crops: ['Beet', 'Celery', 'Leafy Vegetables', 'Tomato', 'Greenhouse Crops'],
    isOrganic: false,
    tags: ['sodium-nitrate', 'nitrate-nitrogen', 'fertigation', 'cool-soil'],
    aiImagePrompt: 'Chemica Sodium Nitrate 16N white crystalline fertilizer product',
  },
];

// ─── ORGANIC FERTILIZERS (5 products) ────────────────────────────────────────

export const ORGANIC_FERTILIZERS: ExtendedProduct[] = [
  {
    id: 'ch-o-001',
    name: 'Chemica Bio Compost (Enriched)',
    description: 'Microbially enriched bio-compost made from agricultural waste with accelerated decomposition. Contains beneficial bacteria, fungi and humic compounds. Improves soil water-holding capacity, aeration and microbial diversity. Provides slow-release macro and micro nutrients. NPOP certified for organic farming use.',
    shortDesc: 'Microbially enriched bio-compost — soil life builder',
    category: 'organic',
    subCategory: 'compost',
    price: 299,
    mrp: 399,
    discount: 25,
    image_url: '/products/chemica/bio-compost.png',
    rating: 4.8,
    reviews_count: 1456,
    stock: 800,
    brand: 'Chemica',
    dosage: '1–2 tonnes per acre as basal; 100–200g per plant',
    composition: 'Bio-composted organic matter >25%, N 1.5%, P 0.8%, K 1.2%, microbes',
    crops: ['All Crops', 'Vegetables', 'Fruits', 'Flowers', 'Nursery'],
    badge: '🌿 NPOP Certified',
    isOrganic: true,
    tags: ['bio-compost', 'organic', 'soil-health', 'compost', 'certified'],
    aiImagePrompt: 'Chemica Bio Compost enriched organic fertilizer bag green label',
  },
  {
    id: 'ch-o-002',
    name: 'Chemica Coco Peat Block 5kg',
    description: 'Premium compressed coco peat (coconut coir pith) from high-quality coconut husks. Expands to 60–70 litres when hydrated. Excellent water retention (800% of weight), good aeration and neutral pH 5.8–6.5. Ideal growing media for nurseries, seedling trays, hydroponics and potting mix. Naturally disease-suppressive. EC < 0.5 ms/cm.',
    shortDesc: 'Premium coco peat block — expands to 70L, perfect for nurseries',
    category: 'organic',
    subCategory: 'growing-media',
    price: 180,
    mrp: 249,
    discount: 28,
    image_url: '/products/chemica/coco-peat.png',
    rating: 4.9,
    reviews_count: 2310,
    stock: 1000,
    brand: 'Chemica',
    dosage: 'Hydrate with 15–20L water per block; mix with soil 30–40%',
    composition: 'Coconut Coir Pith 100% — pH 5.8–6.5, EC <0.5 ms/cm',
    crops: ['Nursery', 'Seedlings', 'Hydroponics', 'Potting Mix', 'All Crops'],
    badge: '🥥 Pure Coco Peat',
    isOrganic: true,
    tags: ['coco-peat', 'growing-media', 'nursery', 'hydroponics', 'organic'],
    aiImagePrompt: 'Chemica Coco Peat compressed block 5kg brown agricultural product',
  },
  {
    id: 'ch-o-003',
    name: 'Chemica Cow Dung Compost (Dried) 10kg',
    description: 'Well-decomposed, sun-dried cow dung compost — the most traditional and trusted soil amendment in Indian farming. Rich in macro and micronutrients, beneficial bacteria and organic matter. Improves soil structure dramatically, buffers pH and provides slow-release nutrition. Safe for all crops at any stage.',
    shortDesc: 'Traditional dried cow dung compost — all-round soil health',
    category: 'organic',
    subCategory: 'compost',
    price: 150,
    mrp: 199,
    discount: 25,
    image_url: '/products/chemica/cow-dung-compost.png',
    rating: 4.7,
    reviews_count: 3210,
    stock: 2000,
    brand: 'Chemica',
    dosage: '2–3 tonnes per acre or 500g–1kg per plant',
    composition: 'Dried Cow Dung Compost — Organic Matter >20%, N 1%, P 0.5%, K 0.8%',
    crops: ['All Crops', 'Vegetables', 'Fruits', 'Flowers', 'Paddy', 'Wheat'],
    badge: '🐄 Traditional Organic',
    isOrganic: true,
    tags: ['cow-dung', 'organic', 'compost', 'soil-amendment', 'traditional'],
    aiImagePrompt: 'Chemica Cow Dung Compost dried 10kg bag traditional organic fertilizer',
  },
  {
    id: 'ch-o-004',
    name: 'Chemica Kitchen Waste Compost 5kg',
    description: 'Premium compost made from processed kitchen and vegetable waste with aerobic decomposition. Rich in organic carbon, plant-available nutrients and diverse soil microbiome. Excellent for home gardens, terrace farming and urban agriculture. Certified free from pathogens and heavy metals. Improves water retention and nutrient cycling.',
    shortDesc: 'Kitchen waste compost — urban garden and terrace farming',
    category: 'organic',
    subCategory: 'compost',
    price: 199,
    mrp: 269,
    discount: 26,
    image_url: '/products/chemica/kitchen-waste-compost.png',
    rating: 4.6,
    reviews_count: 876,
    stock: 500,
    brand: 'Chemica',
    dosage: '200–500g per pot; 500kg per acre',
    composition: 'Composted kitchen-vegetable waste — Organic Matter >22%, tested pathogen-free',
    crops: ['Home Garden', 'Terrace Farming', 'Container Plants', 'Vegetables', 'Herbs'],
    badge: '♻️ Eco-Friendly',
    isOrganic: true,
    tags: ['kitchen-waste', 'compost', 'organic', 'home-garden', 'urban-farming'],
    aiImagePrompt: 'Chemica Kitchen Waste Compost 5kg packet eco organic fertilizer',
  },
  {
    id: 'ch-o-005',
    name: 'Chemica Leaf Compost (Forest Litter) 10kg',
    description: 'Naturally decomposed leaf mold compost from forest floor litter. Extremely rich in fungal mycelium, humic acids and micronutrients. Outstanding soil conditioner that dramatically improves drainage in heavy clay soils and water retention in sandy soils. Slightly acidic pH ideal for acid-loving crops.',
    shortDesc: 'Leaf mold compost — ideal for fruit trees and acid-loving crops',
    category: 'organic',
    subCategory: 'compost',
    price: 249,
    mrp: 329,
    discount: 24,
    image_url: '/products/chemica/leaf-compost.png',
    rating: 4.8,
    reviews_count: 543,
    stock: 400,
    brand: 'Chemica',
    dosage: '1–2 tonnes per acre; 1kg per tree/plant',
    composition: 'Decomposed leaf litter — pH 5.5–6.5, Organic Matter >30%, Humic acid >5%',
    crops: ['Fruit Trees', 'Tea', 'Coffee', 'Grapes', 'Blueberry', 'Ornamentals'],
    isOrganic: true,
    tags: ['leaf-compost', 'organic', 'humus', 'acid-loving', 'fruit-trees'],
    aiImagePrompt: 'Chemica Leaf Compost forest litter 10kg bag organic soil conditioner',
  },
];

// ─── FIELD CROP SEEDS (4 products) ───────────────────────────────────────────

export const FIELD_CROP_SEEDS: ExtendedProduct[] = [
  {
    id: 'ch-s-001',
    name: 'Chemica Paddy Seeds (Hybrid Short Duration)',
    description: 'Short-duration 105–110 day hybrid paddy with excellent yield potential of 28–35 quintals per acre. Fine grain variety with superior cooking quality, high milling recovery and low chalkiness. Moderate tolerance to blast, bacterial leaf blight and brown planthopper. Suitable for both transplanted and DSR (direct seeded rice) methods.',
    shortDesc: 'Short-duration hybrid paddy — 28–35 q/acre, blast tolerant',
    category: 'seeds',
    subCategory: 'field-crop',
    price: 580,
    mrp: 720,
    discount: 19,
    image_url: '/products/chemica/paddy-seed.png',
    rating: 4.8,
    reviews_count: 2876,
    stock: 800,
    brand: 'Chemica',
    dosage: '6–8 kg seeds per acre for nursery; 20–25 kg for DSR',
    composition: 'Hybrid Paddy Seeds — Germination: 85%+, Purity: 98%+, Vigour: High',
    crops: ['Paddy / Rice'],
    badge: '🌾 28–35 q/acre',
    isOrganic: false,
    tags: ['paddy', 'rice-seeds', 'hybrid', 'short-duration', 'high-yield'],
    aiImagePrompt: 'Chemica Hybrid Paddy rice seeds 5kg green bag agricultural product',
  },
  {
    id: 'ch-s-002',
    name: 'Chemica Wheat Seeds (HD-3086 Improved)',
    description: 'HD-3086 improved wheat variety with high yield potential of 20–25 quintals per acre. Bold grain with excellent chapati quality and high protein content. Resistant to leaf rust, yellow rust and powdery mildew. Tolerant to terminal heat stress making it ideal for late-sown conditions. ICAR recommended for north-west India.',
    shortDesc: 'HD-3086 wheat — rust resistant, 20–25 q/acre, heat tolerant',
    category: 'seeds',
    subCategory: 'field-crop',
    price: 320,
    mrp: 420,
    discount: 24,
    image_url: '/products/chemica/wheat-seed.png',
    rating: 4.7,
    reviews_count: 3120,
    stock: 1000,
    brand: 'Chemica',
    dosage: '40–50 kg per acre for normal sowing; 50–60 kg for late sowing',
    composition: 'Wheat Seeds HD-3086 — Germination: 90%+, Purity: 99%+',
    crops: ['Wheat'],
    badge: '🌻 ICAR Recommended',
    isOrganic: false,
    tags: ['wheat', 'seeds', 'hd-3086', 'rust-resistant', 'rabi'],
    aiImagePrompt: 'Chemica Wheat Seeds HD-3086 improved variety 10kg bag product',
  },
  {
    id: 'ch-s-003',
    name: 'Chemica Maize / Corn Seeds (Single Cross Hybrid)',
    description: 'High-yielding single-cross hybrid maize with 100–105 day maturity. Yield potential 28–32 quintals per acre. Tall, sturdy plant with good stay-green and stover quality. Tolerance to MLND (Maize Lethal Necrosis Disease) and turcicum blight. Suitable for grain and stover use in kharif and spring seasons.',
    shortDesc: 'Single-cross hybrid maize — 28–32 q/acre, MLND tolerant',
    category: 'seeds',
    subCategory: 'field-crop',
    price: 450,
    mrp: 600,
    discount: 25,
    image_url: '/products/chemica/maize-seed.png',
    rating: 4.7,
    reviews_count: 1543,
    stock: 700,
    brand: 'Chemica',
    dosage: '8–10 kg per acre; sow at 60×20 cm spacing',
    composition: 'Single-Cross Hybrid Maize — Germination: 90%+, Purity: 98%+',
    crops: ['Maize / Corn'],
    badge: '🌽 High Yield',
    isOrganic: false,
    tags: ['maize', 'corn', 'seeds', 'hybrid', 'single-cross', 'kharif'],
    aiImagePrompt: 'Chemica Maize Corn single cross hybrid seeds 5kg bag product',
  },
  {
    id: 'ch-s-004',
    name: 'Chemica Groundnut Seeds (Bold Spanish)',
    description: 'Bold-seeded Spanish groundnut variety with 110–120 day maturity. High shelling percentage (72–75%) and excellent oil content (48–50%). Tolerant to tikka leaf spot and stem rot. Compact plant habit suitable for mechanised harvesting. Performs well in red sandy loam and black cotton soils.',
    shortDesc: 'Bold Spanish groundnut — 48–50% oil, tikka tolerant, 110 days',
    category: 'seeds',
    subCategory: 'field-crop',
    price: 380,
    mrp: 499,
    discount: 24,
    image_url: '/products/chemica/groundnut-seed.png',
    rating: 4.6,
    reviews_count: 987,
    stock: 600,
    brand: 'Chemica',
    dosage: '50–60 kg per acre; sow 2 seeds per hill, 30×10 cm',
    composition: 'Spanish Groundnut Seeds — Germination: 85%+, Shelling %: 72–75%',
    crops: ['Groundnut'],
    badge: '🥜 High Oil Content',
    isOrganic: false,
    tags: ['groundnut', 'seeds', 'spanish', 'oilseed', 'bold'],
    aiImagePrompt: 'Chemica Groundnut Bold Spanish seeds 10kg bag oilseed product',
  },
];

// ─── FRUIT SEEDS (1 product) ──────────────────────────────────────────────────

export const FRUIT_PLANTATION_SEEDS: ExtendedProduct[] = [
  {
    id: 'ch-fs-001',
    name: 'Chemica Watermelon Seeds (F1 Hybrid Seedless)',
    description: 'F1 hybrid seedless watermelon with extremely sweet flesh (Brix 12–14°) and crisp texture. Fruit weight 6–8 kg, oblong shape, bright green exterior with dark stripes. Vine vigorous with good fruit set. Tolerant to powdery mildew and anthracnose. Suitable for kharif and summer seasons. High market demand and premium price realization.',
    shortDesc: 'F1 hybrid seedless watermelon — 12–14° Brix, 6–8 kg fruits',
    category: 'seeds',
    subCategory: 'fruit-plantation',
    price: 1200,
    mrp: 1599,
    discount: 25,
    image_url: '/products/chemica/watermelon-seed.png',
    rating: 4.8,
    reviews_count: 876,
    stock: 300,
    brand: 'Chemica',
    dosage: '150–200g per acre; transplant 30-day seedlings at 2×1m spacing',
    composition: 'F1 Hybrid Seedless Watermelon — Germination: 90%+, Purity: 98%+',
    crops: ['Watermelon'],
    badge: '🍉 Seedless F1',
    isOrganic: false,
    tags: ['watermelon', 'seeds', 'f1-hybrid', 'seedless', 'fruit'],
    aiImagePrompt: 'Chemica F1 Hybrid Seedless Watermelon seeds packet 50g product photo',
  },
];

export const VEGETABLE_SEEDS: ExtendedProduct[] = [];
export const FLOWER_HERBAL_SEEDS: ExtendedProduct[] = [];
export const LIVESTOCK_NUTRITION: ExtendedProduct[] = [];

// ─── INSECTICIDES / FUNGICIDES / HERBICIDES (empty — no images uploaded) ─────
// Will be populated when crop protection product images are added

export const INSECTICIDES: ExtendedProduct[] = [];
export const FUNGICIDES: ExtendedProduct[] = [];
export const HERBICIDES: ExtendedProduct[] = [];

// ─── AGGREGATED EXPORTS ───────────────────────────────────────────────────────

export const ALL_FERTILIZERS: ExtendedProduct[] = [
  ...CHEMICAL_FERTILIZERS,
  ...ORGANIC_FERTILIZERS,
];

export const ALL_SEEDS: ExtendedProduct[] = [
  ...FIELD_CROP_SEEDS,
  ...FRUIT_PLANTATION_SEEDS,
  ...VEGETABLE_SEEDS,
];

export const ALL_PROTEIN_CUTS: ExtendedProduct[] = [];

export const ALL_PRODUCTS: ExtendedProduct[] = [
  ...CHEMICAL_FERTILIZERS,
  ...ORGANIC_FERTILIZERS,
  ...FIELD_CROP_SEEDS,
  ...FRUIT_PLANTATION_SEEDS,
];

// ─── SUBCATEGORY METADATA ─────────────────────────────────────────────────────

export const FERTILIZER_SUBCATEGORIES = [
  { id: 'all', label: 'All Fertilizers', emoji: '🌿', count: ALL_FERTILIZERS.length },
  { id: 'chemical', label: 'Chemical / NPK', emoji: '🧪', count: CHEMICAL_FERTILIZERS.length },
  { id: 'organic', label: 'Organic / Bio', emoji: '🌱', count: ORGANIC_FERTILIZERS.length },
  { id: 'micronutrient', label: 'Micronutrients', emoji: '🔬', count: 0 },
];

export const SEED_SUBCATEGORIES = [
  { id: 'all', label: 'All Seeds', emoji: '🌱', count: ALL_SEEDS.length },
  { id: 'field-crops', label: 'Field Crops', emoji: '🌾', count: FIELD_CROP_SEEDS.length },
  { id: 'fruit-plantation', label: 'Fruits & Plantation', emoji: '🍉', count: FRUIT_PLANTATION_SEEDS.length },
  { id: 'vegetable', label: 'Vegetables', emoji: '🥦', count: VEGETABLE_SEEDS.length },
  { id: 'flower-herbal', label: 'Flowers & Herbal', emoji: '🌸', count: FLOWER_HERBAL_SEEDS.length },
];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  