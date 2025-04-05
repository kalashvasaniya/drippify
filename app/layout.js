import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Optimize font loading with proper configuration [^3]
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Enhanced metadata with comprehensive SEO
export const metadata = {
  title: "Drippify | Image to URL",
  description: "Drippify converts any image file into a shareable public link (For Free)",
  metadataBase: new URL("https://drippify.vercel.app"),
  keywords: ["image sharing", "file sharing", "image to URL", "free image hosting"],
  authors: [{ name: "Drippify Team" }],
  creator: "Drippify",
  publisher: "Drippify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drippify.vercel.app",
    title: "Drippify | Image to URL",
    description: "Drippify converts any image file into a shareable public link (For Free)",
    siteName: "Drippify",
    images: [
      {
        url: "https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg",
        width: 1200,
        height: 630,
        alt: "Drippify - Image to URL Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drippify | Image to URL",
    description: "Drippify converts any image file into a shareable public link (For Free)",
    images: ["https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg"],
    creator: "@drippify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
}

// Viewport configuration for better mobile experience
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

