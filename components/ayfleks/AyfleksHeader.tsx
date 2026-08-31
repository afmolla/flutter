"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/menu-store";

type Props = {
  menu: MenuItem[];
  langHref?: string;
  langLabel?: string;
  logoWhite?: boolean;
};

export function AyfleksHeader({ menu, langHref = "/en", langLabel = "EN", logoWhite = true }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const homeHref = langLabel === "TR" ? "/en" : "/";

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="container main-menu-address">
          <div className="row align-items-center">
            <div className="col-6 col-md-3">
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
            <div className="col-6 col-md-9 d-flex justify-content-end align-items-center gap-3">
              <nav className="header-menu d-none d-lg-block">
                <ul className="d-flex justify-content-end align-items-center list-unstyled mb-0 ayf-nav">
                  {menu.map((item) => (
                    <li key={item.label} className={item.children?.length ? "mega-menu" : ""}>
                      {item.children?.length ? (
                        <>
                          <span className="nav-link ayf-nav-link">{item.label}</span>
                          <div className="mega-menu-content ayf-mega">
                            <ul className="list-unstyled mb-0">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link href={child.href}>{child.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <Link href={item.href || "#"} className="nav-link ayf-nav-link">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li className="languages-menu">
                    <Link href={langHref} className="top-lang ayf-nav-link">
                      {langLabel}
                    </Link>
                  </li>
                </ul>
              </nav>
              <button type="button" className="hamburger-nav d-lg-none ayf-burger" aria-label="Menü" onClick={() => setOpen((v) => !v)}>
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
          <div className="brand-line" />
        </div>
      </div>

      {open ? (
        <div className="ayf-mobile-nav">
          <button type="button" className="ayf-mobile-close" onClick={() => setOpen(false)} aria-label="Kapat">
            ×
          </button>
          <ul className="list-unstyled">
            {menu.map((item) => (
              <li key={item.label}>
                {item.children?.length ? (
                  <>
                    <strong>{item.label}</strong>
                    <ul className="list-unstyled ps-3">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={() => setOpen(false)}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href || "#"} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href={langHref} onClick={() => setOpen(false)}>
                {langLabel}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
