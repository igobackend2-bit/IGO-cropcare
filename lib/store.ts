'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, User } from './types'

interface AuthStore {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  setIsLoggedIn: (status: boolean) => void
  logout: () => void
}

interface CartStore {
  items: CartItem[]
  lastAdded: CartItem | null
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  clearLastAdded: () => void
}

interface WishlistStore {
  items: string[] // Array of product IDs
  toggleItem: (productId: string) => void
  clearWishlist: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'cc_auth_state',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
      version: 1,
    }
  )
)

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: null,
      addItem: (item) => {
        const state = get()
        const existingItem = state.items.find((i) => i.product_id === item.product_id)
        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            lastAdded: item,
          })
        } else {
          set({ items: [...state.items, item], lastAdded: item })
        }
      },
      removeItem: (itemId) => set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      clearLastAdded: () => set({ lastAdded: null }),
      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cc_cart_state',
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
)

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        const state = get()
        const isExisting = state.items.includes(productId)
        if (isExisting) {
          set({ items: state.items.filter(id => id !== productId) })
        } else {
          set({ items: [...state.items, productId] })
        }
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'cc_wishlist_state',
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
)

interface NotificationStore {
  hasRead: boolean
  markAsRead: () => void
  resetNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      hasRead: false,
      markAsRead: () => set({ hasRead: true }),
      resetNotifications: () => set({ hasRead: false }),
    }),
    {
      name: 'cc_notifications_state',
      version: 1,
    }
  )
)
