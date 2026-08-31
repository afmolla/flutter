import type { Metadata } from "next";
import Link from "next/link";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { yayinHaberler } from "@/lib/haber-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "News",
    description: "Ayfleks Packaging news and announcements.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/news` },
  };
}

export default async function EnNewsPage() {
  const list = await yayinHaberler("en");
  return (
    <AyfleksShell inside locale="en">
      <AyfleksPageHero title="News" crumbs={[{ label: "Home", href: "/en" }, { label: "News" }]} />
      <div className="container content-page">
        <div className="ayf-product-grid">
          {list.map((h) => (
            <Link key={h.id} href={`/en/news/${h.slug}`} className="ayf-product-card">
              {h.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.imageSrc} alt={h.baslik} loading="lazy" width={400} height={220} />
              ) : null}
              <h3>{h.baslik}</h3>
              <p style={{ color: "#60666B", fontSize: 14 }}>{h.aciklama}</p>
            </Link>
          ))}
        </div>
      </div>
    </AyfleksShell>
  );
}
