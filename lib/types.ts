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
