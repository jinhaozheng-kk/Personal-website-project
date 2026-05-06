import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: `${profile.name},${profile.title},${profile.city}。AI Agent 与全栈开发,开放合作。`,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.heroSubtitle,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
