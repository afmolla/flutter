import type { Metadata } from "next";
import { AyfleksContactForm } from "@/components/ayfleks/AyfleksContactForm";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Contact",
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/contact` },
  };
}

export default async function EnContactPage() {
  const ayar = await ayarlarGetir();
  return (
    <AyfleksShell inside langHref="/" langLabel="TR">
      <AyfleksPageHero title="Contact" crumbs={[{ label: "Home", href: "/en" }, { label: "Contact" }]} />
      <div className="container content-page contact-page">
        <h1>Contact</h1>
        <h2>How can we help you?</h2>
        <div className="row contact-info">
          <div className="col-md-4 text-center">
            <p>{ayar.iletisimEposta || "info@ayfleks.com"}</p>
          </div>
          <div className="col-md-4 text-center">
            <p>{ayar.iletisimTelefon || "—"}</p>
          </div>
          <div className="col-md-4 text-center">
            <p>{ayar.adresDetay || "Istanbul"}</p>
          </div>
        </div>
        <AyfleksContactForm />
      </div>
    </AyfleksShell>
  );
}
