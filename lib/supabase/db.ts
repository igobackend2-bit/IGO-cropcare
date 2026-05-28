import { supabase } from './client'
import { Product, User, Order, Review } from '../types'
import { ALL_PRODUCTS, ExtendedProduct } from '../products-data'

const isBrowser = typeof window !== 'undefined'
const safeLocalStorage = isBrowser ? window.localStorage : null

// Convert ExtendedProduct to Product to match DB typing
// ExtendedProduct: price = selling price, mrp = original price, discount = % off
// Product (ProductCard): price = MRP shown strikethrough, discount = rupee amount off
const convertExtendedProduct = (ep: ExtendedProduct): Product => ({
  ...ep,
  price: ep.mrp,                  // MRP shown as strikethrough original price
  discount: ep.mrp - ep.price,    // actual rupee discount amount
  category: ep.category as any,   // Cast to exact enum
  created_at: new Date().toISOString(),
})

// Default mock products matching the e-commerce category lists
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Tomato Seeds - F1 Hybrid',
    description: 'High-yield F1 hybrid tomato seeds with excellent disease resistance. Produces uniform, bright red fruits. Perfect for commercial and home gardens. Germination rate: 95%+. Best suited for winter and spring planting.',
    category: 'seeds',
    price: 1200,
    discount: 200,
    image_url: '/products/seeds_tomato.png',
    rating: 4.8,
    reviews_count: 1245,
    stock: 150,
    brand: 'SeedMaster',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'NPK 19:19:19 Premium Fertilizer',
    description: 'Complete balanced water-soluble fertilizer. Instantly available nutrients for rapid growth. Enhanced with essential micronutrients (Zn, B, Mo) to prevent nutrient deficiencies. Perfect for all crops. Dissolve 1g to 2g per liter of water for foliage spray or drip irrigation.',
    category: 'fertilizers',
    price: 450,
    discount: 75,
    image_url: '/products/seeds_tomato.png',
    rating: 4.9,
    reviews_count: 2389,
    stock: 200,
    brand: 'EcoGrow',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Broad Spectrum Herbicide 41% SL',
    description: 'Non-selective, systemic post-emergence herbicide used to control annual and perennial weeds. Highly effective on broadleaf weeds and grasses. Absorbs through foliage and translocates throughout the plant down to root systems.',
    category: 'herbicides',
    price: 225,
    discount: 50,
    image_url: '/products/fertilizer_npk.png',
    rating: 4.6,
    reviews_count: 156,
    stock: 80,
    brand: 'AgriTech Solutions',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Organic Neem Oil Insecticide',
    description: 'Pure cold-pressed organic neem oil formulation with 10,000 PPM Azadirachtin. Controls whiteflies, aphids, thrips, spider mites, and scale insects. 100% natural and biodegradable, certified for organic farming. Spray mix: 5ml per Liter of water with emulsifier.',
    category: 'insecticides',
    price: 1150,
    discount: 300,
    image_url: '/products/insecticide_bottle.png',
    rating: 4.7,
    reviews_count: 423,
    stock: 60,
    brand: 'NatureCare',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Systemic Fungicide 75% WP',
    description: 'Broad-spectrum contact fungicide with multi-site action. Effective against a wide range of fungal diseases like downy mildew, early and late blights, leaf spots, and rusts. Excellent weatherability and stickiness. Recommended dosage: 2-2.5g per Liter of water.',
    category: 'fungicides',
    price: 299,
    discount: 45,
    image_url: '/products/fungicide_copper.png',
    rating: 4.6,
    reviews_count: 978,
    stock: 180,
    brand: 'PlantShield',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Professional Hand Weeder Set',
    description: 'Premium quality gardening hand tools crafted with rust-resistant heavy-duty stainless steel. Ergonomically shaped soft-grip handles reduce fatigue. Complete set includes a manual weeder, cultivator, and graduation transplanter trowel.',
    category: 'tools',
    price: 799,
    discount: 150,
    image_url: '/products/fertilizer_npk.png',
    rating: 4.5,
    reviews_count: 542,
    stock: 250,
    brand: 'AgriTools',
    created_at: new Date().toISOString(),
  },
]


// Force rebuild to clear Turbopack cache
// Create a unified master catalog combining initial basic products with the massive rich catalog
export const FULL_CATALOG: Product[] = [
  ...INITIAL_PRODUCTS,
  ...ALL_PRODUCTS.map(convertExtendedProduct)
]

// Check if Supabase variables are set and look correct
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && !url.includes('your_supabase_project_url') && !key.includes('your_supabase_anon_key'))
}

// -------------------------------------------------------------
// PRODUCTS ACTIONS
// -------------------------------------------------------------

export const getProducts = async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) {
    // Return FULL_CATALOG directly for local development so updates apply immediately
    return FULL_CATALOG
  }

  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    if (data && data.length > 0) return data as Product[]
    
    // Seed initial products if DB is empty
    await supabase.from('products').insert(FULL_CATALOG)
    return FULL_CATALOG
  } catch (err) {
    console.error('Supabase getProducts error, falling back:', err)
    return FULL_CATALOG
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const products = await getProducts()
  return products.find(p => p.id === id) || null
}

// -------------------------------------------------------------
// USER ACTIONS
// -------------------------------------------------------------

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    const localUser = safeLocalStorage?.getItem('cc_user')
    if (localUser) {
      const parsed = JSON.parse(localUser)
      if (parsed.id === userId) {
        const updated = { ...parsed, ...userData }
        safeLocalStorage?.setItem('cc_user', JSON.stringify(updated))
        return updated
      }
    }
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    localStorage.setItem('cc_user', JSON.stringify(data))
    return data as User
  } catch (err) {
    console.error('Supabase updateUserProfile error:', err)
    return null
  }
}

// -------------------------------------------------------------
// ORDER ACTIONS
// -------------------------------------------------------------

export const createOrderInDB = async (
  userId: string, 
  totalAmount: number, 
  items: Array<{ product_id: string; quantity: number; price: number }>
): Promise<Order | null> => {
  const newOrderData = {
    id: crypto.randomUUID(),
    user_id: userId,
    total_amount: totalAmount,
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (!isSupabaseConfigured()) {
    // Mock local storage save
    const localOrdersRaw = safeLocalStorage?.getItem('cc_orders')
    const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : []
    
    // Attach product descriptions for display in order history
    const products = await getProducts()
    const populatedItems = items.map(item => ({
      id: crypto.randomUUID(),
      order_id: newOrderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product: products.find(p => p.id === item.product_id)
    }))

    const fullOrder: Order = {
      ...newOrderData,
      items: populatedItems,
    }

    localOrders.push(fullOrder)
    localStorage.setItem('cc_orders', JSON.stringify(localOrders))
    return fullOrder
  }

  try {
    // Insert order header
    const { data: orderHeader, error: orderErr } = await supabase
      .from('orders')
      .insert({
        id: newOrderData.id,
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single()

    if (orderErr) throw orderErr

    // Insert order items
    const orderItemsPayload = items.map(item => ({
      order_id: newOrderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsPayload)

    if (itemsErr) throw itemsErr

    // Fetch full populated order
    const products = await getProducts()
    const fullOrder: Order = {
      id: orderHeader.id,
      user_id: orderHeader.user_id,
      total_amount: parseFloat(orderHeader.total_amount),
      status: orderHeader.status,
      created_at: orderHeader.created_at,
      updated_at: orderHeader.created_at,
      items: items.map(item => ({
        id: crypto.randomUUID(), // Temp ID for list keying
        order_id: orderHeader.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product: products.find(p => p.id === item.product_id)
      }))
    }

    // Save order history state to localStorage for offline resilience
    const localOrdersRaw = localStorage.getItem('cc_orders')
    const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : []
    localOrders.push(fullOrder)
    safeLocalStorage?.setItem('cc_orders', JSON.stringify(localOrders))

    return fullOrder
  } catch (err) {
    console.error('Supabase createOrder error, falling back locally:', err)
    return null
  }
}

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  // Always check localStorage orders first to guarantee immediate responsive display
const localOrdersRaw = safeLocalStorage?.getItem('cc_orders')
  const localOrders = localOrdersRaw ? JSON.parse(localOrdersRaw) : []
  const filteredLocal = localOrders.filter((ord: any) => ord.user_id === userId)
  
  if (!isSupabaseConfigured()) {
    return filteredLocal
  }

  try {
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    if (!dbOrders || dbOrders.length === 0) {
      return filteredLocal
    }

    const products = await getProducts()

    const formattedOrders: Order[] = dbOrders.map((ord: any) => {
      const items = (ord.order_items || []).map((item: any) => ({
        id: item.id,
        order_id: ord.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        product: products.find(p => p.id === item.product_id)
      }))

      return {
        id: ord.id,
        user_id: ord.user_id,
        total_amount: parseFloat(ord.total_amount),
        status: ord.status,
        created_at: ord.created_at,
        updated_at: ord.created_at,
        items
      }
    })

    // Sync localStorage cache
    safeLocalStorage?.setItem('cc_orders', JSON.stringify(formattedOrders))
    return formattedOrders
  } catch (err) {
    console.error('Supabase getUserOrders error, using cached:', err)
    return filteredLocal
  }
}

// -------------------------------------------------------------
// REVIEWS ACTIONS
// -------------------------------------------------------------

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const localKey = `cc_reviews_${productId}`
  const localReviews = safeLocalStorage?.getItem(localKey)
  const defaultReviews: Review[] = [
    {
      id: 'rev-1',
      product_id: productId,
      user_id: 'u-1',
      rating: 5,
      comment: 'Excellent product! Increased my yield and worked exactly as specified.',
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      user: { first_name: 'Rajesh', last_name: 'Sharma' } as User
    },
    {
      id: 'rev-2',
      product_id: productId,
      user_id: 'u-2',
      rating: 4,
      comment: 'Satisfactory results. The delivery was fast and the packaging was solid.',
      created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      user: { first_name: 'Priya', last_name: 'Patel' } as User
    }
  ]

  if (localReviews) return JSON.parse(localReviews)
  safeLocalStorage?.setItem(localKey, JSON.stringify(defaultReviews))
  return defaultReviews
}

export const submitProductReview = async (
  productId: string, 
  userId: string, 
  userName: string,
  rating: number, 
  comment: string
): Promise<Review> => {
  const newReview: Review = {
    id: crypto.randomUUID(),
    product_id: productId,
    user_id: userId,
    rating,
    comment,
    created_at: new Date().toISOString(),
    user: {
      first_name: userName.split(' ')[0] || 'Farmer',
      last_name: userName.split(' ')[1] || 'User'
    } as User
  }

  const localKey = `cc_reviews_${productId}`
  const localRaw = safeLocalStorage?.getItem(localKey)
  const reviews = localRaw ? JSON.parse(localRaw) : []
  reviews.unshift(newReview)
  safeLocalStorage?.setItem(localKey, JSON.stringify(reviews))

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('reviews').insert({
        product_id: productId,
        user_id: userId,
        rating,
        comment,
      })
    } catch (err) {
      console.error('Supabase submitReview error:', err)
    }
  }

  return newReview
}
