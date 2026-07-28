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
  title: "Graph Extractor AI — Extract Charts & Figures from PDFs",
  description:
    "Open-source tool to extract embedded charts, graphs, and figures from research paper PDFs. No AI hallucination, no cloud lock-in. Built with FastAPI + Next.js. MIT Licensed.",
  keywords: [
    "graph extractor",
    "PDF figure extraction",
    "chart extractor",
    "open source PDF tool",
    "research paper figures",
    "PyMuPDF",
  ],
  openGraph: {
    title: "Graph Extractor AI",
    description:
      "Extract high-quality charts and figures from research PDFs. Open source & free to use.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
