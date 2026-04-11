import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/api/draft-mode/',
        '/api/revalidate',
        '/api/upload-font',
      ],
    },
    sitemap: 'https://www.allegade10.dk/sitemap.xml',
  }
}
