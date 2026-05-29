import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/db'

const matchesFormulation = (
  productName: string,
  description: string,
  composition: string | undefined,
  formulation: string
) => {
  const text = `${productName.toLowerCase()} ${description.toLowerCase()} ${(composition || '').toLowerCase()}`
  if (formulation === 'liquid') {
    const keywords = ['sl', 'ec', 'sc', 'cs', 'liquid', 'solution', 'oil', 'ml', '1l', 'liter', 'litre', 'aqueous']
    return keywords.some(k => text.includes(k))
  }
  if (formulation === 'powder') {
    const keywords = ['wp', 'sp', 'powder', 'dust', 'wettable', 'soluble powder', 'dry']
    return keywords.some(k => text.includes(k))
  }
  if (formulation === 'granule') {
    const keywords = ['gr', 'wg', 'granule', 'cake', 'basal', 'pellet', 'prilled', 'kg bag']
    return keywords.some(k => text.includes(k))
  }
  return true
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const search      = url.searchParams.get('search')?.trim().toLowerCase() || ''
  const category    = url.searchParams.get('category') || 'all'
  const subCat      = url.searchParams.get('sub') || 'all'
  const brand       = url.searchParams.get('brand') || 'all'
  const formulation = url.searchParams.get('formulation') || 'all'
  const pest        = url.searchParams.get('pest') || 'all'
  const minPrice    = Number(url.searchParams.get('minPrice') || '0')
  const maxPrice    = Number(url.searchParams.get('maxPrice') || '1000000')
  const sortBy      = url.searchParams.get('sortBy') || 'popular'

  try {
    const products = await getProducts()

    const filtered = products.filter((product) => {
      // Category filter
      if (category !== 'all') {
        if (category === 'crop-protection') {
          if (!['insecticides', 'herbicides', 'fungicides'].includes(product.category)) return false
        } else if (category === 'organic') {
          // Backward-compatible shortcut used by the homepage Bio / Organic link.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (product.category !== 'fertilizers' || (product as any).subCategory !== 'organic') return false
        } else {
          if (product.category !== category) return false
        }
      }

      // Subcategory filter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (subCat !== 'all' && (product as any).subCategory && (product as any).subCategory !== subCat) return false

      if (brand !== 'all' && product.brand !== brand) return false

      // Selling price = price - discount
      const sellingPrice = product.discount ? product.price - product.discount : product.price
      if (sellingPrice < minPrice || sellingPrice > maxPrice) return false

      if (formulation !== 'all' && !matchesFormulation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product.name, product.description, (product as any).composition, formulation
      )) {
        return false
      }

      if (pest !== 'all') {
        const text = `${product.name.toLowerCase()} ${product.description.toLowerCase()}`
        let matched = false
        if (pest === 'aphid' && text.match(/aphid|jassid|thrip|hopper|sucking/)) matched = true
        else if (pest === 'whitefly' && text.match(/whitefl/)) matched = true
        else if (pest === 'blight' && text.match(/blight|leaf spot|mildew|rust|fungi/)) matched = true
        else if (pest === 'bollworm' && text.match(/bollworm|caterpillar|larva|spodoptera|worm/)) matched = true
        else if (pest === 'weed' && text.match(/weed|broadleaf|grass/)) matched = true
        if (!matched) return false
      }

      if (search) {
        const q = search.toLowerCase()
        const ok = product.name.toLowerCase().includes(q) ||
                   product.description.toLowerCase().includes(q) ||
                   product.brand.toLowerCase().includes(q)
        if (!ok) return false
      }

      return true
    })

    const sorted = filtered.sort((a, b) => {
      const aPrice = a.discount ? a.price - a.discount : a.price
      const bPrice = b.discount ? b.price - b.discount : b.price
      if (sortBy === 'price-low')  return aPrice - bPrice
      if (sortBy === 'price-high') return bPrice - aPrice
      if (sortBy === 'rating')     return b.rating - a.rating
      if (sortBy === 'discount') {
        const aDis = a.discount && a.price > 0 ? (a.discount / a.price) * 100 : 0
        const bDis = b.discount && b.price > 0 ? (b.discount / b.price) * 100 : 0
        return bDis - aDis
      }
      return b.reviews_count - a.reviews_count
    })

    return NextResponse.json(sorted)
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
