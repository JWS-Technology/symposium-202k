import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpiderCursor from "@/components/SpiderCursor";

export const metadata: Metadata = {
  title: "Symposium 2k25",
  description: "Symposium 2025 - Department of Information Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        {/* <SpiderCursor /> */}
        {/* <Navbar /> */}
        <div className="min-h-screen">
          {children}
        </div>
        {/* <Footer /> */}
      </body>

    </html>
  );
}
