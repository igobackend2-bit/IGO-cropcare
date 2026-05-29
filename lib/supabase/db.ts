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
  category: ep.category as Product['category'],   // Cast to exact enum
  created_at: new Date().toISOString(),
})

// Real Chemica Fertilizers product catalog — no demo products
export const FULL_CATALOG: Product[] = [
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
  // Always serve from local FULL_CATALOG first.
  // Supabase products table is only used for admin-added products (stock updates etc.)
  // This ensures the Chemica catalog is ALWAYS shown regardless of DB state.
  if (!isSupabaseConfigured()) {
    return FULL_CATALOG
  }

  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error

    // If DB has products that are NOT in our local catalog (admin-added),
    // merge them in. Otherwise always return local catalog.
    if (data && data.length > 0) {
      const localIds = new Set(FULL_CATALOG.map(p => p.id))
      const adminAdded = (data as Product[]).filter(p => !localIds.has(p.id))
      if (adminAdded.length > 0) {
        return [...FULL_CATALOG, ...adminAdded]
      }
    }
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
  const filteredLocal = localOrders.filter((ord: { user_id: string }) => ord.user_id === userId)
  
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOrders: Order[] = (dbOrders as any[]).map((ord) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = ((ord.order_items as any[]) || []).map((item: { id: string; product_id: string; quantity: number; price: string }) => ({
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

// -------------------------------------------------------------
// ADMIN & CRM ACTIONS
// -------------------------------------------------------------

export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('products').insert(productData).select().single()
    if (error) throw error
    return data as Product
  } catch (err) {
    console.error('Error creating product:', err)
    return null
  }
}

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select().single()
    if (error) throw error
    return data as Product
  } catch (err) {
    console.error('Error updating product:', err)
    return null
  }
}

export const captureLead = async (leadData: Partial<import('../types').Lead>): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('leads').insert(leadData)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error capturing lead:', err)
    return false
  }
}

export const recordPageView = async (path: string, productId?: string, userId?: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('page_views').insert({ path, product_id: productId, user_id: userId })
  } catch (err) {
    console.error('Error recording page view:', err)
  }
}

export const getAdminSetting = async (key: string): Promise<unknown | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', key).single()
    if (error) throw error
    return data?.setting_value
  } catch (err) {
    console.error('Error getting admin setting:', err)
    return null
  }
}

export const setAdminSetting = async (key: string, value: unknown): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('admin_settings').upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' })
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error setting admin setting:', err)
    return false
  }
}
