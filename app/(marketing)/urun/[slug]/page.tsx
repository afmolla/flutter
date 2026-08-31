import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { URUN_KATEGORILER } from "@/lib/urun-types";
import { urunBySlug } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const u = await urunBySlug(slug);
  if (!u || !u.yayinda) return {};
  const base = await siteUrl();
  return {
    title: u.baslik,
    description: u.ozet,
    alternates: { canonical: `${base.replace(/\/$/, "")}/urun/${slug}` },
    openGraph: { title: u.baslik, description: u.ozet, images: u.imageSrc ? [{ url: u.imageSrc }] : undefined },
  };
}

export default async function UrunDetayPage({ params }: Props) {
  const { slug } = await params;
  const u = await urunBySlug(slug);
  if (!u || !u.yayinda) notFound();
  const kat = URUN_KATEGORILER.find((k) => k.id === u.kategoriId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: u.baslik,
    description: u.ozet,
    image: u.imageSrc,
    brand: { "@type": "Brand", name: "Ayfleks" },
    category: kat?.baslik,
  };

  return (
    <AyfleksShell inside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AyfleksPageHero
        title={u.baslik}
        crumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          ...(kat ? [{ label: kat.baslik, href: kat.href }] : []),
          { label: u.baslik },
        ]}
      />
      <div className="container content-page corporate-about">
        <div className="row" style={{ marginTop: 48, marginBottom: 80 }}>
          <div className="col-md-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u.imageSrc} alt={u.imageAlt || u.baslik} className="img-fluid" style={{ borderRadius: 12 }} />
          </div>
          <div className="col-md-6">
            <h1 style={{ fontSize: 36, fontWeight: 500 }}>{u.baslik}</h1>
            <p style={{ color: "#60666B" }}>{u.ozet}</p>
            {u.aciklama ? <div dangerouslySetInnerHTML={{ __html: u.aciklama.includes("<") ? u.aciklama : `<p>${u.aciklama}</p>` }} /> : null}
            <p style={{ marginTop: 24 }}>
              <Link href="/iletisim" className="btn-green" style={{ display: "inline-block", textAlign: "center" }}>
                Teklif Al
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
