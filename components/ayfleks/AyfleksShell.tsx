import Link from "next/link";
import type { ReactNode } from "react";
import { AyfleksCookieBanner } from "@/components/ayfleks/AyfleksCookieBanner";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { menuGetir } from "@/lib/menu-store";
import { ayarlarGetir } from "@/lib/settings-store";

type Props = {
  children: ReactNode;
  inside?: boolean;
  langHref?: string;
  langLabel?: string;
};

export async function AyfleksShell({ children, inside = false, langHref = "/en", langLabel = "EN" }: Props) {
  const [ayar, menus] = await Promise.all([ayarlarGetir(), menuGetir()]);
  return (
    <>
      <AyfleksStyles />
      {inside ? (
        <header className="site-header-inside" style={{ position: "relative", background: "#fff" }}>
          <AyfleksHeader menu={menus.header} langHref={langHref} langLabel={langLabel} logoWhite={false} />
        </header>
      ) : (
        <AyfleksHeader menu={menus.header} langHref={langHref} langLabel={langLabel} logoWhite />
      )}
      <main>{children}</main>
      <AyfleksFooter footerMenu={menus.footer} ayar={ayar} />
      <AyfleksCookieBanner />
    </>
  );
}

export function AyfleksPageHero({ title, crumbs }: { title: string; crumbs: { label: string; href?: string }[] }) {
  return (
    <div className="header-manset">
      <div className="header-gorsel" style={{ position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sayfalar/ayfleks-kurumsal_345d0.webp" alt={title} className="img-fluid w-100" width={1920} height={480} />
        <div className="icerik-breadcrumb">
          <ul>
            {crumbs.map((c) => (
              <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}</li>
            ))}
          </ul>
          <h1 className="banner-title">{title}</h1>
        </div>
      </div>
    </div>
  );
}
