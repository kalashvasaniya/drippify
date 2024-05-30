"use client"
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Drippfy",
  description: "Drippfy converts any image/PDF file into a shareable public link.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={inter.className}>
        {children}
        <div className="bg-black">
        </div>
      </body>
    </html>
  );
}

