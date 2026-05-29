import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IGO CropCare - Professional Agri-Tech Commerce Platform",
  description: "Verified seeds, crop protection, precision nutrition, AI-assisted crop diagnosis, and B2B procurement support for modern Indian agriculture.",
  openGraph: {
    title: "IGO CropCare - Professional Agri-Tech Commerce Platform",
    description: "Verified seeds, crop protection, precision nutrition, AI-assisted crop diagnosis, and B2B procurement support for modern Indian agriculture.",
    type: 'website',
    url: 'https://www.igo-cropcare.com',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464226184081-280282069fda?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'IGO CropCare modern agriculture platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGO CropCare - Professional Agri-Tech Commerce Platform',
    description: 'Verified crop inputs, AI-assisted crop diagnosis, and procurement support for modern Indian agriculture.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f766e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
