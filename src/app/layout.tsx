import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import prisma from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Wiki",
  description: "A fantasy worldbuilding encyclopedia",
};

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Top banner bar */}
        <header className="bg-white border-b border-border">
          <div className="flex items-center justify-between px-4 py-1.5">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted">Personal Wiki</span>
            </div>
            <SearchBar />
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-40px)]">
          {/* Sidebar */}
          <Sidebar categories={categories} />

          {/* Content area */}
          <div className="flex-1 min-w-0 bg-white border-l border-border">
            <main className="max-w-5xl px-6 py-4">
              {children}
            </main>
            <footer className="border-t border-border px-6 py-3 text-center text-[11px] text-muted">
              World Wiki &mdash; A personal encyclopedia of the realm.
              Content is available under Creative Commons Attribution.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
