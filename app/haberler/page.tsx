import type { Metadata } from "next";
import Link from "next/link";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { yayinHaberler } from "@/lib/haber-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Haberler",
    description: "Ayfleks haberleri ve duyurular.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/haberler` },
  };
}

export default async function HaberlerPage() {
  const list = await yayinHaberler("tr");
  return (
    <AyfleksShell inside>
      <AyfleksPageHero title="Haberler" crumbs={[{ label: "Anasayfa", href: "/" }, { label: "Haberler" }]} />
      <div className="container content-page">
        <div className="ayf-product-grid">
          {list.map((h) => (
            <Link key={h.id} href={`/haberler/${h.slug}`} className="ayf-product-card">
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
