import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { AyfleksProductGrupGrid, AyfleksUrunSubnav, URUN_GRUP_HERO } from "@/components/ayfleks/AyfleksProductGrup";
import { kategoriAciklama, URUN_KATEGORILER, type UrunKategoriId } from "@/lib/urun-types";
import { urunGrupIntro } from "@/lib/urun-grup-content";
import { urunlerGetir, urunYayinda } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;

const MAP: Record<string, UrunKategoriId> = {
  food: "gida",
  "personal-care-hygiene": "kisisel-bakim",
  "pet-care": "evcil-hayvan",
  industrial: "endustriyel",
};

const EN_HERO: Record<string, string> = {
  food: URUN_GRUP_HERO.gida,
  "personal-care-hygiene": URUN_GRUP_HERO["kisisel-bakim-hijyen"],
  "pet-care": URUN_GRUP_HERO["evcil-hayvan-bakimi"],
  industrial: URUN_GRUP_HERO.endustriyel,
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = MAP[slug];
  const kat = URUN_KATEGORILER.find((k) => k.id === id);
  if (!kat) return {};
  const intro = await urunGrupIntro(slug, "en");
  const base = await siteUrl();
  return {
    title: kat.baslikEn,
    description: intro || kategoriAciklama(kat, "en"),
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/product-groups/${slug}` },
  };
}

export default async function EnProductGroupPage({ params }: Props) {
  const { slug } = await params;
  const id = MAP[slug];
  const kat = URUN_KATEGORILER.find((k) => k.id === id);
  if (!kat) notFound();
  const list = urunYayinda(await urunlerGetir()).filter((u) => u.kategoriId === id && u.locale === "en");
  const fallback = list.length
    ? list
    : urunYayinda(await urunlerGetir()).filter((u) => u.kategoriId === id && (u.locale || "tr") === "tr");
  const intro = await urunGrupIntro(slug, "en");

  return (
    <AyfleksShell inside locale="en">
      <AyfleksPageHero
        title={kat.baslikEn}
        heroImage={EN_HERO[slug]}
        crumbs={[{ label: "Home", href: "/en" }, { label: "Products", href: "/en/products" }, { label: kat.baslikEn }]}
        subnav={<AyfleksUrunSubnav activeSlug={slug} locale="en" />}
      />
      <AyfleksProductGrupGrid intro={intro || kategoriAciklama(kat, "en")} products={fallback} locale="en" />
    </AyfleksShell>
  );
}
