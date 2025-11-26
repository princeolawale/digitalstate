import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Interactive 3D Earth Globe with WebGL and Three.js - FUI HUD Sci-Fi Interface',
  description: 'Interactive 3D Earth planet visualization built with WebGL, Three.js, and React Three Fiber. A futuristic FUI (Futuristic User Interface) and HUD (Heads-Up Display) style 3D globe sandbox demonstrating sci-fi interface design patterns. Features point cloud visualization, holographic projection, volumetric rendering, and computational aesthetics.',
  keywords: [
    '3D Earth Globe',
    'WebGL',
    'Three.js',
    'FUI',
    'HUD',
    'Sci-Fi Interface',
    'Point Cloud Visualization',
    'Holographic Projection',
    'Futuristic UI',
    'Cyberpunk Interface',
    'Data Visualization',
    'Interactive Globe',
    'React Three Fiber',
    'Computational Design',
    'Volumetric Rendering',
    'Tech Noir',
    'Digital Chiaroscuro',
    'Geospatial Visualization',
    'Astrovisualization',
    'Procedural WebGL Graphics',
    'Shader-Based Rendering',
    'Digital Cartography',
    'Generative 3D UI',
    'Cinematic UI Motion',
    'Tech Minimalist Aesthetic',
    'Fictional Interface Design'
  ],
  authors: [{ name: 'e-Nicko' }],
  creator: 'e-Nicko',
  publisher: 'e-Nicko',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://webgl-digital-globe.vercel.app',
    siteName: 'Interactive 3D Earth Globe - WebGL Three.js',
    title: 'Interactive 3D Earth Globe with WebGL and Three.js - FUI HUD Sci-Fi Interface',
    description: 'Futuristic 3D Earth planet visualization with point cloud rendering, holographic projection style, FUI HUD interface design. Built with WebGL, Three.js, React Three Fiber.',
    images: [
      {
        url: 'https://webgl-digital-globe.vercel.app/docs/vids/preview.png',
        width: 1200,
        height: 675,
        alt: 'Interactive 3D Earth Globe - WebGL Three.js FUI HUD Visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive 3D Earth Globe with WebGL and Three.js - FUI HUD Sci-Fi Interface',
    description: 'Futuristic 3D Earth planet visualization with point cloud rendering, holographic projection style, FUI HUD interface design.',
    images: ['https://webgl-digital-globe.vercel.app/docs/vids/preview.png'],
  },
  alternates: {
    canonical: 'https://webgl-digital-globe.vercel.app',
  },
  category: 'technology',
  classification: '3D Visualization, WebGL, Interactive Design',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  verification: {
    // Add verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Interactive 3D Earth Globe - WebGL Three.js',
    description: 'Interactive 3D Earth planet visualization built with WebGL, Three.js, and React Three Fiber. A futuristic FUI and HUD style 3D globe sandbox.',
    url: 'https://webgl-digital-globe.vercel.app',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'e-Nicko',
    },
    creator: {
      '@type': 'Person',
      name: 'e-Nicko',
    },
    keywords: '3D Earth Globe, WebGL, Three.js, FUI, HUD, Sci-Fi Interface, Point Cloud Visualization, Holographic Projection, Futuristic UI, Cyberpunk Interface, Data Visualization, Interactive Globe, React Three Fiber',
    screenshot: 'https://webgl-digital-globe.vercel.app/docs/vids/preview.png',
    softwareVersion: '1.0',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    featureList: [
      'Interactive 3D Globe',
      'Point Cloud Visualization',
      'Holographic Projection',
      'Real-time Rotation',
      'Layer Visibility Controls',
      'WebGL Rendering',
    ],
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
