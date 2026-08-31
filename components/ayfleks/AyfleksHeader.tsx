import Link from "next/link";
import type { MenuItem } from "@/lib/menu-store";

type Props = {
  menu: MenuItem[];
  langHref?: string;
};

export function AyfleksHeader({ menu, langHref = "/en" }: Props) {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="container main-menu-address">
          <div className="row align-items-center">
            <div className="col-md-3">
              <Link href="/" className="navbar-brand">
                <img src="/images/ayfleks-logo-w.svg" alt="Ayfleks" className="ayfleks-logo img-fluid" />
              </Link>
            </div>
            <div className="col-md-9">
              <nav className="header-menu d-none d-lg-block">
                <ul className="d-flex justify-content-end align-items-center gap-3 list-unstyled mb-0">
                  {menu.map((item) => (
                    <li key={item.label} className={item.children?.length ? "mega-menu" : ""}>
                      {item.children?.length ? (
                        <>
                          <span className="nav-link">{item.label}</span>
                          <div className="mega-menu-content">
                            <div className="container">
                              <ul className="list-unstyled">
                                {item.children.map((child) => (
                                  <li key={child.href}>
                                    <Link href={child.href}>{child.label}</Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link href={item.href || "#"} className="nav-link">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li className="languages-menu">
                    <Link href={langHref} className="top-lang">
                      EN
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="hamburger-nav d-lg-none">
                <span className="fa fa-bars" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="brand-line" />
        </div>
      </div>
    </header>
  );
}
