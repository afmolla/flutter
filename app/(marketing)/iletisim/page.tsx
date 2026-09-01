import type { Metadata } from "next";
import { AyfleksContactForm } from "@/components/ayfleks/AyfleksContactForm";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "İletişim",
    description: "Ayfleks Ambalaj ile iletişime geçin.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/iletisim` },
  };
}

export default async function IletisimPage() {
  const ayar = await ayarlarGetir();
  return (
    <AyfleksShell inside>
      <AyfleksPageHero title="İletişim" crumbs={[{ label: "Anasayfa", href: "/" }, { label: "İletişim" }]} />
      <div className="container content-page contact-page">
        <h1>İletişim</h1>
        <h2>Size nasıl yardımcı olabiliriz?</h2>
        <div className="row contact-info">
          <div className="col-md-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon-mail-green.svg" alt="" width={48} height={48} />
            <h3>E-posta</h3>
            <p>{ayar.iletisimEposta || "info@ayfleks.com"}</p>
          </div>
          <div className="col-md-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon-phone-green.svg" alt="" width={48} height={48} />
            <h3>Telefon</h3>
            <p>{ayar.iletisimTelefon || "—"}</p>
          </div>
          <div className="col-md-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon-location-green.svg" alt="" width={48} height={48} />
            <h3>Adres</h3>
            <p>{ayar.adresDetay || ayar.adresKisa || "İstanbul"}</p>
          </div>
        </div>
        <AyfleksContactForm />
      </div>
    </AyfleksShell>
  );
}
