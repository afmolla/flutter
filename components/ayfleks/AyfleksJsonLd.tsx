import type { SiteAyarlar } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

export async function AyfleksJsonLd({ ayar }: { ayar: SiteAyarlar }) {
  const base = (await siteUrl()).replace(/\/$/, "");
  const logoUrl = `${base}/images/ayfleks-logo.svg`;
  const sameAs = [ayar.instagram, ayar.linkedin, ayar.facebook, ayar.youtube].filter(Boolean);

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: ayar.salonAd || "Ayfleks Ambalaj",
        url: base,
        logo: { "@type": "ImageObject", url: logoUrl },
        foundingDate: "1974",
        description: ayar.seoDescription?.trim(),
        ...(sameAs.length ? { sameAs } : {}),
        ...(ayar.iletisimEposta ? { email: ayar.iletisimEposta.trim() } : {}),
        ...(ayar.iletisimTelefon ? { telephone: ayar.iletisimTelefon.trim() } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: ayar.salonAd || "Ayfleks Ambalaj",
        inLanguage: ["tr-TR", "en"],
        publisher: { "@id": `${base}/#organization` },
        description: ayar.seoDescription?.trim(),
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}
