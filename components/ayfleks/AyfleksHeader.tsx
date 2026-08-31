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
  const phoneLabel = locale === "en" ? "Telephone:" : "Telefon:";

  return (
    <>
      <header className={logoWhite ? "site-header" : "site-header-inside"}>
        <div className="container">
          <div className="row">
            <div className="header-content">
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
                    <Link href="/" className={locale === "tr" ? "ayf-lang-active" : undefined}>
                      TR
                    </Link>
                  </li>
                  <li>
                    <Link href="/en" className={locale === "en" ? "ayf-lang-active" : undefined}>
                      EN
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="hamburger-nav">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={locale === "en" ? "Menu" : "Menü"}
                  onClick={() => setOverlay(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setOverlay(true);
                  }}
                >
                  <svg className="ayf-bars-icon" width="44" height="44" viewBox="0 0 24 24" aria-hidden>
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="myNav" className={`overlay${overlay ? " ayf-nav-open" : ""}`}>
        <a
          href="#"
          className="closebtn"
          aria-label={locale === "en" ? "Close" : "Kapat"}
          onClick={(e) => {
            e.preventDefault();
            setOverlay(false);
          }}
        >
          &times;
        </a>

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
                            <div className="d-flex align-items-start">
                              <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
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

                              <div className="tab-content" id="v-pills-tabContent">
                                {menu.map((item, i) => (
                                  <div
                                    key={item.label}
                                    className={`tab-pane fade${i === tab ? " show active" : ""}`}
                                    id={`v-pills-ayf-${i}`}
                                    role="tabpanel"
                                    hidden={i !== tab}
                                  >
                                    {item.children?.length
                                      ? item.children.map((child) => (
                                          <Link
                                            key={child.href}
                                            href={child.href}
                                            title={child.label}
                                            onClick={() => setOverlay(false)}
                                          >
                                            {child.label}
                                          </Link>
                                        ))
                                      : item.href && item.href !== "#" ? (
                                          <Link href={item.href} title={item.label} onClick={() => setOverlay(false)}>
                                            {item.label}
                                          </Link>
                                        ) : null}
                                  </div>
                                ))}
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
              {ayar.iletisimTelefon ? <p>{phoneLabel}&nbsp;{ayar.iletisimTelefon}</p> : null}
              {ayar.iletisimFax ? <p>Fax:&nbsp;{ayar.iletisimFax}</p> : null}
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
    </>
  );
}
