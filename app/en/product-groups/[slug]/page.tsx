import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { URUN_KATEGORILER, type UrunKategoriId } from "@/lib/urun-types";
import { urunlerGetir, urunYayinda } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

const MAP: Record<string, UrunKategoriId> = {
  food: "gida",
  "personal-care-hygiene": "kisisel-bakim",
  "pet-care": "evcil-hayvan",
  industrial: "endustriyel",
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
  const base = await siteUrl();
  return {
    title: kat.baslikEn,
    description: kat.aciklama,
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

  return (
    <AyfleksShell inside langHref="/" langLabel="TR">
      <AyfleksPageHero title={kat.baslikEn} crumbs={[{ label: "Home", href: "/en" }, { label: "Products", href: "/en/products" }, { label: kat.baslikEn }]} />
      <div className="container content-page">
        <div className="ayf-product-grid">
          {fallback.map((u) => (
            <Link key={u.id} href={`/en/product/${u.slug}`} className="ayf-product-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.imageSrc} alt={u.baslik} loading="lazy" />
              <h3>{u.baslik}</h3>
              <p style={{ color: "#60666B", fontSize: 14 }}>{u.ozet}</p>
            </Link>
          ))}
        </div>
      </div>
    </AyfleksShell>
  );
}
