import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { normalizePublicSiteUrl, isUsablePublicHost } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

function metadataSiteUrl(): string {
  const raw = normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (raw) {
    try {
      if (isUsablePublicHost(new URL(raw).host)) return raw;
    } catch {
      /* ignore */
    }
  }
  return "https://ayfleks.com";
}

const SITE_URL = metadataSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ayfleks Ambalaj | Gıda, Kişisel Bakım, Evcil Hayvan ve Endüstriyel Ambalaj",
    template: "%s | Ayfleks Ambalaj",
  },
  description:
    "Ayfleks Ambalaj — 1974'ten beri gıda, kişisel bakım & hijyen, evcil hayvan bakımı ve endüstriyel ambalaj çözümleri.",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon.ico" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#024B3D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${outfit.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
