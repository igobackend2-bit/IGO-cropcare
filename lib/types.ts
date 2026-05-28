// Product Types
export interface Product {
  id: string
  name: string
  description: string
  category: 'insecticides' | 'herbicides' | 'fungicides' | 'fertilizers' | 'seeds' | 'tools'
  price: number
  discount?: number
  image_url: string
  rating: number
  reviews_count: number
  stock: number
  brand: string
  created_at: string
  // Extended agricultural fields
  subCategory?: string
  dosage?: string
  composition?: string
  crops?: string[]
  badge?: string
  isOrganic?: boolean
  tags?: string[]
  aiImagePrompt?: string
  // Admin fields
  is_active?: boolean
  isDeleted?: boolean
  isAdminAdded?: boolean
  restoredAt?: string
}

// User Types
export interface User {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  pincode: string
  created_at: string
  role?: 'user' | 'admin'
}

// Cart Item Type
export interface CartItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

// Order Types
export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  created_at: string
  updated_at: string
  // Customer snapshot
  customer_name?: string
  customer_email?: string
  customer_phone?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

// Review Type
export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
  user?: User
}

// Banner Type (Admin-managed header announcements)
export interface Banner {
  id: string
  text: string
  link?: string
  linkText?: string
  bgColor: string
  textColor: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Analytics / Page View Type
export interface PageView {
  id: string
  sessionId: string
  page: string
  productId?: string
  productName?: string
  category?: string
  timestamp: string
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
}

// Lead Type (CRM)
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  intent_product_id?: string
  created_at: string
}

// Page View Type (Analytics)
export interface PageView {
  id: string
  path: string
  product_id?: string
  user_id?: string
  created_at: string
}

// Admin Setting Type (Banners)
export interface AdminSetting {
  id: string
  setting_key: string
  setting_value: unknown
  updated_at: string
}

// Admin Product Override (edits to existing products)
export interface ProductOverride {
  id: string        // matches original product ID
  changes: Partial<Product>
  updatedAt: string
}
