import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile/', '/cart/', '/checkout/', '/orders/', '/wishlist/'],
      },
    ],
    sitemap: 'https://igo-cropcare.vercel.app/sitemap.xml',
  }
}
