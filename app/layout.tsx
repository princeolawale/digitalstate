import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

/* =========================
   SEO METADATA
========================= */
export const metadata: Metadata = {
  title: 'Digital State — Interactive 3D Globe',
  description:
    'Interactive 3D Earth visualization built with WebGL, Three.js, and React Three Fiber.',
  keywords: [
    '3D Globe',
    'WebGL',
    'Three.js',
    'React Three Fiber',
    'FUI',
    'HUD',
    'Sci-Fi Interface',
  ],
  authors: [{ name: 'Digital State' }],
  creator: 'Digital State',
  publisher: 'Digital State',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Digital State — Interactive 3D Globe',
    description:
      'Futuristic 3D Earth visualization with HUD interface.',
    siteName: 'Digital State',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital State — Interactive 3D Globe',
    description:
      'Futuristic 3D Earth visualization with HUD interface.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

/* =========================
   VIEWPORT (REQUIRED SEPARATE EXPORT)
========================= */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

/* =========================
   ROOT LAYOUT
========================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Digital State',
    description:
      'Interactive 3D Earth visualization with futuristic HUD interface.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}