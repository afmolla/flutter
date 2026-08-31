import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { haberBySlug } from "@/lib/haber-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const h = await haberBySlug(slug, "en");
  if (!h || !h.yayin) return {};
  const base = await siteUrl();
  return {
    title: h.baslik,
    description: h.aciklama,
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/news/${slug}` },
    openGraph: { title: h.baslik, description: h.aciklama, type: "article", images: h.imageSrc ? [{ url: h.imageSrc }] : undefined },
  };
}

export default async function EnNewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const h = await haberBySlug(slug, "en");
  if (!h || !h.yayin) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: h.baslik,
    description: h.aciklama,
    image: h.imageSrc,
    datePublished: h.tarih,
    dateModified: h.guncellenme,
    publisher: { "@type": "Organization", name: "Ayfleks Packaging" },
  };

  return (
    <AyfleksShell inside locale="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AyfleksPageHero title={h.baslik} crumbs={[{ label: "Home", href: "/en" }, { label: "News", href: "/en/news" }, { label: h.baslik }]} />
      <div className="container content-page corporate-about">
        <div className="row">
          <div className="col-md-10">
            {h.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={h.imageSrc} alt={h.baslik} className="img-fluid mb-4" style={{ borderRadius: 12, marginBottom: 24 }} />
            ) : null}
            <article dangerouslySetInnerHTML={{ __html: h.icerikHtml }} />
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
