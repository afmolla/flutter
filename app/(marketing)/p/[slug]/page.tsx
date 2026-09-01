import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsSayfaBody } from "@/components/CmsSayfaBody";
import { AyfleksKurumsalSubnav } from "@/components/ayfleks/AyfleksKurumsalSubnav";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { isKurumsalSubnavPage } from "@/lib/kurumsal-nav";
import { AyfleksJsonLd } from "@/components/ayfleks/AyfleksJsonLd";
import { sayfaBySlug } from "@/lib/pages-store";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await sayfaBySlug(slug);
  if (!s || !s.yayin) return {};
  const ayar = await ayarlarGetir();
  const base = await siteUrl();
  const canonical = `${base.replace(/\/$/, "")}/p/${slug}`;
  return {
    title: s.baslik,
    description: s.aciklama?.trim() || ayar.seoDescription,
    alternates: { canonical },
    robots: s.seoIndex === false ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: s.baslik, description: s.aciklama, url: canonical, type: "article" },
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const s = await sayfaBySlug(slug);
  if (!s || !s.yayin) notFound();
  const ayar = await ayarlarGetir();

  return (
    <AyfleksShell inside>
      <AyfleksJsonLd ayar={ayar} />
      <AyfleksPageHero
        title={s.baslik}
        crumbs={[{ label: "Anasayfa", href: "/" }, { label: s.baslik }]}
        subnav={isKurumsalSubnavPage(slug, "tr") ? <AyfleksKurumsalSubnav activeSlug={slug} /> : undefined}
      />
      <div className="container content-page inside-text corporate-about">
        <div className="row">
          <div className="col-md-10">
            <CmsSayfaBody sayfa={s} />
            {slug === "haberler" ? (
              <p className="mt-4">
                <Link href="/haberler">Tüm haberler →</Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
