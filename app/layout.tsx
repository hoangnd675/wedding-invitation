import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Allura,
  Bodoni_Moda,
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Great_Vibes,
  Lora,
  Marcellus,
  Playfair_Display,
  Quicksand,
} from 'next/font/google'
import './globals.css'


const cormorant = Cormorant_Garamond({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-cormorant' })
const greatVibes = Great_Vibes({ subsets: ['latin', 'vietnamese'], weight: '400', display: 'swap', variable: '--font-great-vibes' })
const quicksand = Quicksand({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-quicksand' })
const dancing = Dancing_Script({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-dancing' })
const playfair = Playfair_Display({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-playfair' })
const cinzel = Cinzel({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-cinzel' })
const bodoni = Bodoni_Moda({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-bodoni' })
const allura = Allura({ subsets: ['latin', 'vietnamese'], weight: '400', display: 'swap', variable: '--font-allura' })
const lora = Lora({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-lora' })
const marcellus = Marcellus({ subsets: ['latin', 'vietnamese'], weight: '400', display: 'swap', variable: '--font-marcellus' })

export const metadata: Metadata = {
  title: 'Thiệp cưới online',
  description: 'Thiệp mời cưới trực tuyến.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`antialiased ${cormorant.variable} ${greatVibes.variable} ${quicksand.variable} ${dancing.variable} ${playfair.variable} ${cinzel.variable} ${bodoni.variable} ${allura.variable} ${lora.variable} ${marcellus.variable}`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
