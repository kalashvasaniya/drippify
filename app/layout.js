import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Optimize font loading with proper configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Enhanced metadata with comprehensive SEO
export const metadata = {
  title: "Drippify | Image to URL",
  description: "Drippify converts any image file into a shareable public link (For Free)",
  metadataBase: new URL("https://drippify.vercel.app"),
  keywords: ["image sharing", "file sharing", "image to URL", "free image hosting", "drippify", "image link generator"],
  authors: [{ name: "Kalash Vasaniya", url: "https://github.com/kalashvasaniya" }],
  creator: "Kalash Vasaniya",
  publisher: "Drippify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drippify.vercel.app",
    title: "Drippify | Free Image to URL Converter",
    description: "Easily upload any image and get a free, shareable public URL instantly with Drippify.",
    siteName: "Drippify",
    images: [
      {
        url: "https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg",
        width: 1200,
        height: 630,
        alt: "Drippify - Free Image to URL Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drippify | Image to URL",
    description: "Drippify converts any image file into a shareable public link (For Free)",
    images: ["https://res.cloudinary.com/dwb211sw5/image/upload/v1717163877/linko/q9wl7sdhpqrng3t7gkcs.jpg"],
    creator: "@YourTwitterHandle", // Replace with actual handle if available
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
  icons: {
    icon: '/favicon.ico', // Make sure you have a favicon.ico in public folder
    apple: '/apple-touch-icon.png', // Make sure you have this in public folder
  }
};

// Viewport configuration for better mobile experience
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) { // Removed type annotation for children
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-black`}> {/* Added bg-black fallback */}
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}