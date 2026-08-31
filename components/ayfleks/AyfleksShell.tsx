import Link from "next/link";
import type { ReactNode } from "react";
import { AyfleksClientScripts } from "@/components/ayfleks/AyfleksClientScripts";
import { AyfleksCookieBanner } from "@/components/ayfleks/AyfleksCookieBanner";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { menuGetir } from "@/lib/menu-store";
import { ayarlarGetir } from "@/lib/settings-store";

type Props = {
  children: ReactNode;
  inside?: boolean;
  locale?: "tr" | "en";
};

export async function AyfleksShell({ children, inside = false, locale = "tr" }: Props) {
  const [ayar, menus] = await Promise.all([ayarlarGetir(), menuGetir()]);
  return (
    <>
      <AyfleksStyles />
      <AyfleksClientScripts />
      {inside ? (
        <div className="site-header-inside">
          <AyfleksHeader menu={menus.header} ayar={ayar} locale={locale} logoWhite={false} />
        </div>
      ) : (
        <AyfleksHeader menu={menus.header} ayar={ayar} locale={locale} logoWhite />
      )}
      <main>{children}</main>
      <AyfleksFooter footerMenu={menus.footer} ayar={ayar} locale={locale} />
      <AyfleksCookieBanner />
    </>
  );
}

export function AyfleksPageHero({
  title,
  crumbs,
  heroImage = "/images/sayfalar/ayfleks-kurumsal_345d0.webp",
  subnav,
}: {
  title: string;
  crumbs: { label: string; href?: string }[];
  heroImage?: string;
  subnav?: ReactNode;
}) {
  return (
    <>
      <div className="manset-gorsel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt={title} className="img-fluid w-100" width={1920} height={480} />
        <div className="container">
          <div className="icerik-breadcrumb">
            <ul>
              {crumbs.map((c) => (
                <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}</li>
              ))}
            </ul>
          </div>
          <h1 className="banner-title">{title}</h1>
        </div>
      </div>
      {subnav}
    </>
  );
}
