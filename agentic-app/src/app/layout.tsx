import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShortFuse – Automated YouTube Shorts Agent",
  description:
    "Autonomous agent that generates, produces, and publishes YouTube Shorts with AI-driven workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 min-h-screen`}
      >
        <div className="flex min-h-screen">
          <aside className="hidden border-r border-slate-800 bg-slate-900/60 p-6 lg:flex lg:w-72 lg:flex-col lg:gap-8">
            <div className="text-xl font-semibold tracking-tight">
              ShortFuse Agent
            </div>
            <nav className="space-y-4">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                href="/tasks"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Tasks
              </Link>
              <Link
                href="/videos"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Library
              </Link>
            </nav>
            <div className="mt-auto text-xs text-slate-500">
              Powered by autonomous AI production.
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
