import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksScripts } from "@/components/ayfleks/AyfleksScripts";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { CmsSayfaBody } from "@/components/CmsSayfaBody";
import { CmsPageInteractive } from "@/components/vf-inline/CmsPageInteractive";
import { menuGetir } from "@/lib/menu-store";
import { sayfaBySlug } from "@/lib/pages-store";
import { ayarlarGetir } from "@/lib/settings-store";
import { getRequestSite } from "@/lib/site-request";
import { siteUrl } from "@/lib/site";
import { isAyfleksSubdir } from "@/lib/site-config";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await sayfaBySlug(slug);
  if (!s || !s.yayin) return {};
  const { subdir } = await getRequestSite();
  const ayar = await ayarlarGetir();
  const base = await siteUrl();
  const index = s.seoIndex !== false && ayar.seoIndex !== false;
  const canonical = `${base.replace(/\/$/, "")}/p/${slug}`;

  return {
    title: s.baslik,
    description: s.aciklama?.trim() || ayar.seoDescription?.trim(),
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: s.baslik,
      description: s.aciklama?.trim(),
      url: canonical,
      type: "article",
    },
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const s = await sayfaBySlug(slug);
  if (!s || !s.yayin) return notFound();

  const { subdir } = await getRequestSite();
  if (!isAyfleksSubdir(subdir)) {
    return <CmsPageInteractive slug={slug} initial={s} />;
  }

  const [ayar, menus] = await Promise.all([ayarlarGetir(), menuGetir()]);

  return (
    <>
      <AyfleksStyles />
      <Script src="https://kit.fontawesome.com/c384e56078.js" crossOrigin="anonymous" strategy="afterInteractive" />
      <header className="site-header-inside">
        <AyfleksHeader menu={menus.header} />
      </header>
      <div className="header-manset">
        <div className="header-gorsel">
          <img src="/images/sayfalar/ayfleks-kurumsal_345d0.webp" alt={s.baslik} className="img-fluid" />
          <div className="icerik-breadcrumb">
            <ul>
              <li>
                <Link href="/">Anasayfa</Link>
              </li>
              <li>
                <Link href="#">{s.baslik}</Link>
              </li>
            </ul>
            <h1 className="banner-title">{s.baslik}</h1>
          </div>
        </div>
      </div>
      <div className="container content-page inside-text corporate-about">
        <div className="row">
          <div className="col-md-10">
            <CmsSayfaBody sayfa={s} />
          </div>
        </div>
      </div>
      <AyfleksFooter footerMenu={menus.footer} ayar={ayar} />
      <AyfleksScripts />
    </>
  );
}
