import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsSayfaBody } from "@/components/CmsSayfaBody";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { sayfaBySlug } from "@/lib/pages-store";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await sayfaBySlug(slug, "en");
  if (!s || !s.yayin) return {};
  const base = await siteUrl();
  return {
    title: s.baslik,
    description: s.aciklama,
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/p/${slug}` },
  };
}

export default async function EnCmsPage({ params }: Props) {
  const { slug } = await params;
  const s = await sayfaBySlug(slug, "en");
  if (!s || !s.yayin) notFound();
  return (
    <AyfleksShell inside locale="en">
      <AyfleksPageHero title={s.baslik} crumbs={[{ label: "Home", href: "/en" }, { label: s.baslik }]} />
      <div className="container content-page corporate-about">
        <div className="row">
          <div className="col-md-10">
            <CmsSayfaBody sayfa={s} />
            <p style={{ marginTop: 24 }}>
              <Link href="/en">← Home</Link>
            </p>
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
