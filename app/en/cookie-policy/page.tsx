import type { Metadata } from "next";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Cookie Policy",
    description: "Ayfleks Packaging website cookie policy.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/cookie-policy` },
    robots: { index: true, follow: true },
  };
}

export default function EnCookiePolicyPage() {
  return (
    <AyfleksShell inside locale="en">
      <AyfleksPageHero title="Cookie Policy" crumbs={[{ label: "Home", href: "/en" }, { label: "Cookie Policy" }]} />
      <div className="container content-page corporate-about">
        <div className="row">
          <div className="col-md-10">
            <p>
              The Ayfleks website may use essential cookies to provide you with a better experience. Required cookies are
              necessary for the site to function. Analytical cookies (e.g. Google Analytics) are enabled only after your
              consent.
            </p>
            <p>
              You can delete or block cookies through your browser settings. You may change your consent at any time.
            </p>
            <p>
              For detailed information on the processing of personal data, please see our{" "}
              <a href="/en/p/en-gdpr">GDPR Privacy Notice</a>.
            </p>
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
