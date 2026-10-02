import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://routemind.example.com"),
  title: {
    default: "Route Mind — AI-Powered Public Transport Intelligence",
    template: "%s · Route Mind",
  },
  description:
    "Route Mind analyzes public transport demand in Hyderabad — forecasting crowds, weather impact, festivals and events to help operators make smarter bus allocation decisions.",
  keywords: [
    "public transport",
    "Hyderabad",
    "demand forecasting",
    "bus allocation",
    "crowd prediction",
    "transit analytics",
  ],
  openGraph: {
    title: "Route Mind — AI-Powered Public Transport Intelligence",
    description:
      "Demand forecasting, crowd prediction and bus allocation intelligence for Hyderabad's public transport network.",
    siteName: "Route Mind",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Route Mind — AI-Powered Public Transport Intelligence",
    description:
      "Demand forecasting, crowd prediction and bus allocation intelligence for Hyderabad's public transport network.",
  },
};

export const viewport: Viewport = {
  themeColor: "#3d4ee4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 font-sans text-slate-800">{children}</body>
    </html>
  );
}
