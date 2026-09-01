import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { AyfleksProductDetail } from "@/components/ayfleks/AyfleksProductDetail";
import { kategoriLabel, URUN_KATEGORILER } from "@/lib/urun-types";
import { urunBySlug } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

function enGrupHref(kategoriId: string): string {
  if (kategoriId === "gida") return "/en/product-groups/food";
  if (kategoriId === "kisisel-bakim") return "/en/product-groups/personal-care-hygiene";
  if (kategoriId === "evcil-hayvan") return "/en/product-groups/pet-care";
  return "/en/product-groups/industrial";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = await urunBySlug(slug, "en");
  if (!u || !u.yayinda) return {};
  const base = await siteUrl();
  return {
    title: u.baslik,
    description: u.ozet,
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/product/${slug}` },
    openGraph: { title: u.baslik, description: u.ozet, images: u.imageSrc ? [{ url: u.imageSrc }] : undefined },
  };
}

export default async function EnUrunDetayPage({ params }: Props) {
  const { slug } = await params;
  const u = await urunBySlug(slug, "en");
  if (!u || !u.yayinda) notFound();
  const kat = URUN_KATEGORILER.find((k) => k.id === u.kategoriId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: u.baslik,
    description: u.ozet,
    image: u.imageSrc,
    brand: { "@type": "Brand", name: "Ayfleks" },
    category: kat ? kategoriLabel(kat, "en") : undefined,
  };

  return (
    <AyfleksShell inside locale="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AyfleksPageHero
        title={u.baslik}
        crumbs={[
          { label: "Home", href: "/en" },
          { label: "Products", href: "/en/products" },
          ...(kat ? [{ label: kategoriLabel(kat, "en"), href: enGrupHref(kat.id) }] : []),
          { label: u.baslik },
        ]}
      />
      <AyfleksProductDetail
        urun={u}
        locale="en"
        teklifHref="/en/contact"
        teklifLabel="Request a Quote"
        galeriBaslik="Product Photos"
      />
    </AyfleksShell>
  );
}
