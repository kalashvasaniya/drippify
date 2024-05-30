"use client"
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Drippfy",
  description: "Drippfy converts any image/PDF file into a shareable public link.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={inter.className}>
        {children}
        <div className="bg-black">
        </div>
      </body>
    </html>
  );
}

