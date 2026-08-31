"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/menu-store";
import type { SiteAyarlar } from "@/lib/settings-store";

type Props = {
  menu: MenuItem[];
  ayar: SiteAyarlar;
  locale?: "tr" | "en";
  logoWhite?: boolean;
};

export function AyfleksHeader({ menu, ayar, locale = "tr", logoWhite = true }: Props) {
  const [overlay, setOverlay] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay]);

  const homeHref = locale === "en" ? "/en" : "/";
  const trHref = locale === "en" ? "/" : "/";
  const enHref = locale === "en" ? "/en" : "/en";

  return (
    <>
      <header className={logoWhite ? "site-header" : "site-header site-header-inside-plain"}>
        <div className="container">
          <div className="row">
            <div className="header-content ayf-header-bar">
              <div className="brand-line">
                <Link href={homeHref} className="navbar-brand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoWhite ? "/images/ayfleks-logo-w.svg" : "/images/ayfleks-logo.svg"}
                    alt="Ayfleks"
                    className="ayfleks-logo img-fluid"
                    width={140}
                    height={48}
                    decoding="async"
                  />
                </Link>
              </div>
              <div className="top-lang">
                <ul className="languages-menu">
                  <li>
                    <Link href={trHref} className={locale === "tr" ? "ayf-lang-active" : undefined} aria-current={locale === "tr" ? "page" : undefined}>
                      TR
                    </Link>
                  </li>
                  <li>
                    <Link href={enHref} className={locale === "en" ? "ayf-lang-active" : undefined} aria-current={locale === "en" ? "page" : undefined}>
                      EN
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="hamburger-nav">
                <button type="button" className="ayf-burger-btn" aria-label="Menü" onClick={() => setOverlay(true)}>
                  <i className="fa fa-bars" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="myNav" className="overlay ayf-overlay" style={{ width: overlay ? "100%" : undefined }}>
        <button type="button" className="closebtn" aria-label="Kapat" onClick={() => setOverlay(false)}>
          ×
        </button>
        <div className="overlay-content">
          <div className="navbar">
            <div className="header-content">
              <nav className="header-menu">
                <ul>
                  <li className="mega-menu">
                    <div className="container">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="d-flex align-items-start ayf-mega-wrap">
                              <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist">
                                {menu.map((item, i) => (
                                  <button
                                    key={item.label}
                                    type="button"
                                    className={`nav-link${i === tab ? " active" : ""}`}
                                    role="tab"
                                    aria-selected={i === tab}
                                    onClick={() => setTab(i)}
                                  >
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                              <div className="tab-content flex-grow-1" id="v-pills-tabContent">
                                {menu.map((item, i) => (
                                  <div
                                    key={item.label}
                                    className={`tab-pane fade${i === tab ? " show active" : ""}`}
                                    role="tabpanel"
                                    hidden={i !== tab}
                                  >
                                    {item.children?.length ? (
                                      item.children.map((child) => (
                                        <Link key={child.href} href={child.href} onClick={() => setOverlay(false)}>
                                          {child.label}
                                        </Link>
                                      ))
                                    ) : (
                                      <Link href={item.href || "#"} onClick={() => setOverlay(false)}>
                                        {item.label}
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="container main-menu-address">
                            <div className="row menu-adds">
                              <div className="col-md-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/icon-location-white.svg" alt="" />
                                <p>{ayar.adresDetay || ayar.adresKisa}</p>
                              </div>
                              <div className="col-md-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/icon-phone-white.svg" alt="" />
                                {ayar.iletisimTelefon ? <p>Telefon: {ayar.iletisimTelefon}</p> : null}
                                {ayar.iletisimFax ? <p>Fax: {ayar.iletisimFax}</p> : null}
                              </div>
                              <div className="col-md-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/icon-mail-white.svg" alt="" />
                                {ayar.iletisimEposta ? <p>{ayar.iletisimEposta}</p> : null}
                                {ayar.iletisimEpostaExport ? <p>{ayar.iletisimEpostaExport}</p> : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
