import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "PulseDesk — AI-first платформа поддержки",
    template: "%s — PulseDesk",
  },
  description:
    "PulseDesk — современная AI-first платформа поддержки для SaaS и digital-команд: тикеты, realtime-работа, AI summary, подсказки ответов и аналитика.",
  keywords: [
    "AI поддержка",
    "helpdesk",
    "support desk",
    "тикеты",
    "SaaS поддержка",
    "AI для поддержки",
    "служба поддержки",
    "PulseDesk",
  ],
  authors: [{ name: "PulseDesk" }],
  creator: "PulseDesk",
  publisher: "PulseDesk",
  metadataBase: new URL("https://pulsedesk.ru"),
  openGraph: {
    title: "PulseDesk — AI-first платформа поддержки",
    description:
      "Современная платформа поддержки с AI summary, подсказками ответов, realtime-тикетами и аналитикой.",
    url: "https://pulsedesk.ru",
    siteName: "PulseDesk",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseDesk — AI-first платформа поддержки",
    description:
      "AI-first helpdesk для SaaS и digital-команд: быстрее ответы, меньше хаоса, больше контроля.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f5f7] text-black">
        {children}
      </body>
    </html>
  );
}