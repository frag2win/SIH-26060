import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MoES Antarctic Digital Twin | SIH PS 26060',
  description: 'National Polar Network Operations Center (NOC) Digital Twin for Indian Antarctic Research Stations (Bharati & Maitri). Real-time telemetry, predictive AI, and resource management.',
  keywords: ['MoES', 'NCPOR', 'Antarctica', 'Bharati', 'Maitri', 'Digital Twin', 'SIH 2026', 'Smart India Hackathon', 'Telemetry'],
  authors: [{ name: 'MoES Polar Research Platform' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-black text-white antialiased selection:bg-[#f97316] selection:text-black">
        {children}
      </body>
    </html>
  );
}
