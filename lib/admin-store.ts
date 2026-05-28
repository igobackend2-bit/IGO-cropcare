/**
 * Admin Store — localStorage-backed CRUD for all admin operations.
 * Every function reads/writes localStorage and optionally syncs Supabase.
 */
import { Product, Order, Banner, PageView, Lead, ProductOverride } from './types'
import { FULL_CATALOG } from './supabase/db'

const isBrowser = typeof window !== 'undefined'
const ls = {
  get: (key: string) => {
    if (!isBrowser) return null
    try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
  },
  set: (key: string, val: unknown) => {
    if (!isBrowser) return
    localStorage.setItem(key, JSON.stringify(val))
  },
}

// ─────────────────────────────────────────────
// KEYS
// ─────────────────────────────────────────────
const KEYS = {
  ADMIN_PRODUCTS: 'cc_admin_products',       // admin-added products
  PRODUCT_OVERRIDES: 'cc_product_overrides', // edits to existing products
  DELETED_PRODUCTS: 'cc_deleted_products',   // IDs of deleted products
  BANNERS: 'cc_banners',
  PAGE_VIEWS: 'cc_page_views',
  LEADS: 'cc_leads',
  ORDERS: 'cc_orders',
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

/** Get the live merged catalog (base + admin adds + overrides - deleted) */
export const getAdminProducts = (): Product[] => {
  const adminAdded: Product[] = ls.get(KEYS.ADMIN_PRODUCTS) || []
  const overrides: ProductOverride[] = ls.get(KEYS.PRODUCT_OVERRIDES) || []
  const deletedIds: string[] = ls.get(KEYS.DELETED_PRODUCTS) || []

  const overrideMap = new Map(overrides.map(o => [o.id, o.changes]))

  const base = FULL_CATALOG
    .filter(p => !deletedIds.includes(p.id))
    .map(p => overrideMap.has(p.id) ? { ...p, ...overrideMap.get(p.id) } : p)

  return [...base, ...adminAdded.filter(p => !deletedIds.includes(p.id))]
}

/** Add a brand-new product */
export const adminAddProduct = (product: Omit<Product, 'id' | 'created_at'>): Product => {
  const newProduct: Product = {
    ...product,
    id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    isAdminAdded: true,
    rating: product.rating || 0,
    reviews_count: product.reviews_count || 0,
  }
  const existing: Product[] = ls.get(KEYS.ADMIN_PRODUCTS) || []
  ls.set(KEYS.ADMIN_PRODUCTS, [...existing, newProduct])
  return newProduct
}

/** Edit any field of any product (base or admin-added) */
export const adminUpdateProduct = (id: string, changes: Partial<Product>): void => {
  // Check if it's an admin-added product
  const adminProducts: Product[] = ls.get(KEYS.ADMIN_PRODUCTS) || []
  const adminIdx = adminProducts.findIndex(p => p.id === id)
  if (adminIdx >= 0) {
    adminProducts[adminIdx] = { ...adminProducts[adminIdx], ...changes }
    ls.set(KEYS.ADMIN_PRODUCTS, adminProducts)
    return
  }
  // Otherwise add/merge override for base product
  const overrides: ProductOverride[] = ls.get(KEYS.PRODUCT_OVERRIDES) || []
  const oIdx = overrides.findIndex(o => o.id === id)
  if (oIdx >= 0) {
    overrides[oIdx] = { ...overrides[oIdx], changes: { ...overrides[oIdx].changes, ...changes }, updatedAt: new Date().toISOString() }
  } else {
    overrides.push({ id, changes, updatedAt: new Date().toISOString() })
  }
  ls.set(KEYS.PRODUCT_OVERRIDES, overrides)
}

/** Soft-delete a product */
export const adminDeleteProduct = (id: string): void => {
  const deleted: string[] = ls.get(KEYS.DELETED_PRODUCTS) || []
  if (!deleted.includes(id)) ls.set(KEYS.DELETED_PRODUCTS, [...deleted, id])
}

/** Restore a deleted product */
export const adminRestoreProduct = (id: string): void => {
  const deleted: string[] = ls.get(KEYS.DELETED_PRODUCTS) || []
  ls.set(KEYS.DELETED_PRODUCTS, deleted.filter(d => d !== id))
}

/** Get list of deleted product IDs */
export const getDeletedProductIds = (): string[] => ls.get(KEYS.DELETED_PRODUCTS) || []

/** Update stock only */
export const adminSetStock = (id: string, stock: number): void => {
  adminUpdateProduct(id, { stock })
}

// ─────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────

export const getBanners = (): Banner[] => ls.get(KEYS.BANNERS) || []

export const getActiveBanners = (): Banner[] =>
  getBanners().filter(b => b.isActive)

export const saveBanner = (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Banner => {
  const newBanner: Banner = {
    ...banner,
    id: `banner-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  ls.set(KEYS.BANNERS, [...getBanners(), newBanner])
  return newBanner
}

export const updateBanner = (id: string, changes: Partial<Banner>): void => {
  const banners = getBanners().map(b =>
    b.id === id ? { ...b, ...changes, updatedAt: new Date().toISOString() } : b
  )
  ls.set(KEYS.BANNERS, banners)
}

export const deleteBanner = (id: string): void => {
  ls.set(KEYS.BANNERS, getBanners().filter(b => b.id !== id))
}

// ─────────────────────────────────────────────
// ANALYTICS / PAGE VIEWS
// ─────────────────────────────────────────────

export const trackPageView = (view: Omit<PageView, 'id' | 'timestamp'>): void => {
  const views: PageView[] = ls.get(KEYS.PAGE_VIEWS) || []
  const newView: PageView = {
    ...view,
    id: `pv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  }
  // Keep last 2000 views
  const updated = [...views, newView].slice(-2000)
  ls.set(KEYS.PAGE_VIEWS, updated)
}

export const getPageViews = (): PageView[] => ls.get(KEYS.PAGE_VIEWS) || []

export const getTopProducts = (limit = 10): { productId: string; productName: string; views: number; category: string }[] => {
  const views = getPageViews().filter(v => v.productId)
  const counts = new Map<string, { name: string; count: number; category: string }>()
  for (const v of views) {
    if (!v.productId) continue
    const cur = counts.get(v.productId) || { name: v.productName || '', count: 0, category: v.category || '' }
    counts.set(v.productId, { ...cur, count: cur.count + 1 })
  }
  return [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([id, val]) => ({ productId: id, productName: val.name, views: val.count, category: val.category }))
}

// ─────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────

export const getLeads = (): Lead[] => ls.get(KEYS.LEADS) || []

export const saveLead = (lead: Omit<Lead, 'id' | 'capturedAt'>): Lead => {
  const leads = getLeads()
  // Update existing if same email
  const existingIdx = leads.findIndex(l => l.email === lead.email)
  if (existingIdx >= 0) {
    const updated = { ...leads[existingIdx], ...lead, capturedAt: leads[existingIdx].capturedAt }
    leads[existingIdx] = updated
    ls.set(KEYS.LEADS, leads)
    return updated
  }
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}`,
    capturedAt: new Date().toISOString(),
  }
  ls.set(KEYS.LEADS, [...leads, newLead])
  return newLead
}

// ─────────────────────────────────────────────
// ORDERS (admin read + status update)
// ─────────────────────────────────────────────

export const getAllOrders = (): Order[] => ls.get(KEYS.ORDERS) || []

export const adminUpdateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getAllOrders().map(o =>
    o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
  )
  ls.set(KEYS.ORDERS, orders)
}

// ─────────────────────────────────────────────
// EXPORT HELPERS
// ─────────────────────────────────────────────

export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (!isBrowser || data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h]
      const str = val === null || val === undefined ? '' : String(val)
      return `"${str.replace(/"/g, '""')}"`
    }).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const printAsPDF = (): void => {
  if (isBrowser) window.print()
}

// ─────────────────────────────────────────────
// SESSION ID (per-browser visitor)
// ─────────────────────────────────────────────

export const getSessionId = (): string => {
  if (!isBrowser) return 'server'
  let sid = sessionStorage.getItem('cc_sid')
  if (!sid) {
    sid = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('cc_sid', sid)
  }
  return sid
}
