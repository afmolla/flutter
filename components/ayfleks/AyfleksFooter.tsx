import Link from "next/link";
import type { MenuItem } from "@/lib/menu-store";
import type { SiteAyarlar } from "@/lib/settings-store";

type Props = {
  footerMenu: MenuItem[];
  ayar: SiteAyarlar;
  locale?: "tr" | "en";
};

export function AyfleksFooter({ footerMenu, ayar, locale = "tr" }: Props) {
  const year = new Date().getFullYear();
  const showSocial = ayar.footerSosyalGoster !== false;
  const socials = [
    { href: ayar.facebook, icon: "fa-facebook", label: "Facebook" },
    { href: ayar.instagram, icon: "fa-instagram", label: "Instagram" },
    { href: ayar.linkedin, icon: "fa-linkedin", label: "LinkedIn" },
    { href: ayar.youtube, icon: "fa-youtube", label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <>
      <section className="footer-alt">
        <div className="container">
          <div className="row f-line1">
            <div className="col-md-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ayfleks-logo.svg" className="img-fluid footer-logo" alt="Ayfleks Logo" />
            </div>
            <div className="col-md-9">
              <div className="row">
                <ul className="footer-mul">
                  {footerMenu.map((m) => (
                    <li key={m.href}>
                      <Link href={m.href}>{m.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              {showSocial && socials.length ? (
                <div className="row f-social">
                  <div className="col-md-4 d-flex">
                    {socials.map((s) => (
                      <div className="col" key={s.icon}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                          <i className={`fa-brands ${s.icon} icon-properties-t`} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="row f-line2">
            <div className="col-md-3">
              <p className="copyright-text">
                © Copyright {year} Ayfleks Packaging.
                <br />
                All Rights Reserved.
              </p>
            </div>
            <div className="col-md-9 ayf-kvkk-line">
              {locale === "en" ? (
                <>
                  <Link href="/en/p/en-business-ethics-form">Business Ethics Form</Link>
                  {" | "}
                  <Link href="/en/p/en-gdpr">GDPR Privacy Notice</Link>
                </>
              ) : (
                <>
                  <Link href="/p/is-etigi-formu">İş Etiği Formu</Link>
                  {" | "}
                  <Link href="/p/kvkk">KVKK Aydınlatma Metni</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-menu-line">
          <div className="row">
            <div className="col-md-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon-location-green.svg" alt="" />
              <p>{ayar.adresDetay || ayar.adresKisa}</p>
            </div>
            <div className="col-md-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon-phone-green.svg" alt="" />
              {ayar.iletisimTelefon ? <p>{locale === "en" ? "Phone" : "Telefon"}: {ayar.iletisimTelefon}</p> : null}
              {ayar.iletisimFax ? <p>{locale === "en" ? "Fax" : "Fax"}: {ayar.iletisimFax}</p> : null}
            </div>
            <div className="col-md-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon-mail-green.svg" alt="" />
              {ayar.iletisimEposta ? <p>{ayar.iletisimEposta}</p> : null}
              {ayar.iletisimEpostaExport ? <p>{ayar.iletisimEpostaExport}</p> : null}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
