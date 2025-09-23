import type { Metadata } from "next";
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
  title: "Spin Wheel",
  description: "Interactive Spin Wheel Application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Spin Wheel",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Left banner */}
        <a
          href="https://pmioham9d3.sens.kr"
          className="side-banner side-banner--left"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DBSense Left Banner"
        >
          <img src="/dbsense-banner-left.png" alt="Left Promotion" width={160} />
        </a>
        {/* Right banner */}
        <a
          href="https://ig8rt9xz3i.sens.kr"
          className="side-banner side-banner--right"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="DBSense Right Banner"
        >
          <img src="/dbsense-banner-right.png" alt="Right Promotion" width={160} />
        </a>
      </body>
    </html>
  );
}
