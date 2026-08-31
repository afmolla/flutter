import type { Metadata } from "next";
import Script from "next/script";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksHomeSections } from "@/components/ayfleks/AyfleksHomeSections";
import { AyfleksJsonLd } from "@/components/ayfleks/AyfleksJsonLd";
import { AyfleksScripts } from "@/components/ayfleks/AyfleksScripts";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { ayfleksHomeGetir } from "@/lib/ayfleks-home-store";
import { menuGetir } from "@/lib/menu-store";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const ayar = await ayarlarGetir();
  const base = await siteUrl();
  const title = ayar.seoTitle?.trim() || "Ayfleks Ambalaj";
  const description = ayar.seoDescription?.trim() || "Ayfleks Ambalaj — sürdürülebilir ambalaj çözümleri";
  const ogImage = ayar.seoOgImage?.trim() || "/images/banner/ayfleks-manset-banner_6f10c.webp";
  const ogAbs = ogImage.startsWith("http") ? ogImage : `${base.replace(/\/$/, "")}${ogImage}`;

  return {
    title,
    description,
    keywords: ayar.seoKeywords?.split(",").map((x) => x.trim()).filter(Boolean),
    alternates: { canonical: base },
    robots: ayar.seoIndex === false ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: base,
      siteName: ayar.salonAd || "Ayfleks Ambalaj",
      locale: "tr_TR",
      type: "website",
      images: [{ url: ogAbs }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogAbs],
    },
  };
}

export default async function HomePage() {
  const [ayar, menus, home] = await Promise.all([ayarlarGetir(), menuGetir(), ayfleksHomeGetir()]);

  return (
    <>
      <AyfleksStyles />
      <AyfleksJsonLd ayar={ayar} />
      <Script src="https://kit.fontawesome.com/c384e56078.js" crossOrigin="anonymous" strategy="afterInteractive" />
      <AyfleksHeader menu={menus.header} />
      <main>
        <AyfleksHomeSections home={home} />
      </main>
      <AyfleksFooter footerMenu={menus.footer} ayar={ayar} />
      <AyfleksScripts />
    </>
  );
}
