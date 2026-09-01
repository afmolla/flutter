import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { AyfleksProductGrupGrid, AyfleksUrunSubnav, URUN_GRUP_HERO } from "@/components/ayfleks/AyfleksProductGrup";
import { URUN_KATEGORILER, type UrunKategoriId } from "@/lib/urun-types";
import { urunGrupIntro } from "@/lib/urun-grup-content";
import { urunlerGetir, urunYayinda } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;

const SLUG_TO_ID: Record<string, UrunKategoriId> = {
  gida: "gida",
  "kisisel-bakim-hijyen": "kisisel-bakim",
  "evcil-hayvan-bakimi": "evcil-hayvan",
  endustriyel: "endustriyel",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SLUG_TO_ID).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = SLUG_TO_ID[slug];
  const kat = URUN_KATEGORILER.find((k) => k.id === id);
  if (!kat) return {};
  const intro = await urunGrupIntro(slug, "tr");
  const base = await siteUrl();
  return {
    title: kat.baslik,
    description: intro || kat.aciklama,
    alternates: { canonical: `${base.replace(/\/$/, "")}/urun-gruplarimiz/${slug}` },
  };
}

export default async function UrunGrupPage({ params }: Props) {
  const { slug } = await params;
  const id = SLUG_TO_ID[slug];
  const kat = URUN_KATEGORILER.find((k) => k.id === id);
  if (!kat) notFound();
  const list = urunYayinda(await urunlerGetir()).filter((u) => u.kategoriId === id && (u.locale || "tr") === "tr");
  const intro = await urunGrupIntro(slug, "tr");

  return (
    <AyfleksShell inside locale="tr">
      <AyfleksPageHero
        title={kat.baslik}
        heroImage={URUN_GRUP_HERO[slug]}
        crumbs={[{ label: "Anasayfa", href: "/" }, { label: "Ürünler", href: "/urunler" }, { label: kat.baslik }]}
        subnav={<AyfleksUrunSubnav activeSlug={slug} />}
      />
      <AyfleksProductGrupGrid intro={intro || kat.aciklama} products={list} />
    </AyfleksShell>
  );
}
