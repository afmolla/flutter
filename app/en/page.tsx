import type { Metadata } from "next";
import { AyfleksClientScripts } from "@/components/ayfleks/AyfleksClientScripts";
import { AyfleksCookieBanner } from "@/components/ayfleks/AyfleksCookieBanner";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksHomeSections } from "@/components/ayfleks/AyfleksHomeSections";
import { AyfleksJsonLd } from "@/components/ayfleks/AyfleksJsonLd";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { ayfleksHomeGetir } from "@/lib/ayfleks-home-store";
import { menuGetir } from "@/lib/menu-store";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  const en = `${base.replace(/\/$/, "")}/en`;
  return {
    title: "Ayfleks Packaging | Food, Personal Care, Pet Care, Industrial",
    description:
      "Ayfleks Packaging — sustainable flexible packaging solutions since 1974 for food, personal care, pet care and industrial markets.",
    alternates: { canonical: en, languages: { en, tr: base } },
    openGraph: { locale: "en_US", url: en },
  };
}

export default async function EnHomePage() {
  const [ayar, menus, home] = await Promise.all([ayarlarGetir(), menuGetir("en"), ayfleksHomeGetir("en")]);

  return (
    <>
      <AyfleksStyles />
      <AyfleksClientScripts />
      <AyfleksJsonLd ayar={ayar} />
      <AyfleksHeader menu={menus.header} ayar={ayar} locale="en" />
      <main>
        <AyfleksHomeSections home={home} locale="en" />
      </main>
      <AyfleksFooter footerMenu={menus.footer} ayar={ayar} locale="en" />
      <AyfleksCookieBanner locale="en" />
    </>
  );
}
