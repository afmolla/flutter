import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { URUN_KATEGORILER, type UrunKategoriId } from "@/lib/urun-types";
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
  const base = await siteUrl();
  return {
    title: kat.baslik,
    description: kat.aciklama,
    alternates: { canonical: `${base.replace(/\/$/, "")}/urun-gruplarimiz/${slug}` },
  };
}

export default async function UrunGrupPage({ params }: Props) {
  const { slug } = await params;
  const id = SLUG_TO_ID[slug];
  const kat = URUN_KATEGORILER.find((k) => k.id === id);
  if (!kat) notFound();
  const list = urunYayinda(await urunlerGetir()).filter((u) => u.kategoriId === id && (u.locale || "tr") === "tr");

  return (
    <AyfleksShell inside>
      <AyfleksPageHero
        title={kat.baslik}
        crumbs={[{ label: "Anasayfa", href: "/" }, { label: "Ürünler", href: "/urunler" }, { label: kat.baslik }]}
      />
      <div className="container content-page">
        <p style={{ marginTop: 32, color: "#60666B" }}>{kat.aciklama}</p>
        <div className="ayf-product-grid">
          {list.map((u) => (
            <Link key={u.id} href={`/urun/${u.slug}`} className="ayf-product-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.imageSrc} alt={u.imageAlt || u.baslik} loading="lazy" width={400} height={220} />
              <h3>{u.baslik}</h3>
              <p style={{ color: "#60666B", fontSize: 14 }}>{u.ozet}</p>
            </Link>
          ))}
        </div>
      </div>
    </AyfleksShell>
  );
}
