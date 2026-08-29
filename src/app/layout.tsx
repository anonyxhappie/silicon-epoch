import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Silicon Epoch — The Explorable 3D Knowledge Graph of AI Evolution",
  description:
    "An interactive 3D spatial knowledge graph exploring eighty years of artificial intelligence breakthroughs across ideas, papers, architectures, models, and hardware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#030609] text-slate-100 min-h-screen w-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
