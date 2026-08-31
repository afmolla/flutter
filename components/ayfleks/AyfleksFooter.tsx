import Link from "next/link";
import type { MenuItem } from "@/lib/menu-store";
import type { SiteAyarlar } from "@/lib/settings-store";

type Props = {
  footerMenu: MenuItem[];
  ayar: SiteAyarlar;
};

export function AyfleksFooter({ footerMenu, ayar }: Props) {
  const year = new Date().getFullYear();
  return (
    <>
      <section className="footer-alt">
        <div className="container">
          <div className="row f-line1">
            <div className="col-md-3">
              <img src="/images/ayfleks-logo.svg" className="img-fluid footer-logo" alt="Ayfleks Logo" />
            </div>
            <div className="col-md-9">
              <div className="row">
                <ul className="footer-mul">
                  {footerMenu.slice(0, 6).map((m) => (
                    <li key={m.href}>
                      <Link href={m.href}>{m.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="row f-social">
                <div className="col-md-4 d-flex">
                  {ayar.facebook ? (
                    <div className="col">
                      <a href={ayar.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-facebook icon-properties-t" />
                      </a>
                    </div>
                  ) : null}
                  {ayar.instagram ? (
                    <div className="col">
                      <a href={ayar.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram icon-properties-t" />
                      </a>
                    </div>
                  ) : null}
                  {ayar.linkedin ? (
                    <div className="col">
                      <a href={ayar.linkedin} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-linkedin icon-properties-t" />
                      </a>
                    </div>
                  ) : null}
                  {ayar.youtube ? (
                    <div className="col">
                      <a href={ayar.youtube} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-youtube icon-properties-t" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="row f-line2">
            <div className="col-md-3">
              <p className="copyright-text">© Copyright {year} Ayfleks Packaging. All Rights Reserved.</p>
            </div>
            <div className="col-md-9">
              <ul className="footer-menu-kvkk">
                <li>
                  <Link href="/p/is-etigi-formu">İş Etiği Formu</Link>
                </li>
                <li>
                  <Link href="/p/kvkk">KVKK Aydınlatma Metni</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="row footer-menu-line">
            <div className="col-md-3">
              <h3>Kurumsal</h3>
              <ul className="footer-menu">
                <li>
                  <Link href="/p/hakkimizda">Hakkımızda</Link>
                </li>
                <li>
                  <Link href="/p/vizyon-misyon">Vizyon – Misyon</Link>
                </li>
                <li>
                  <Link href="/p/haberler">Haberler</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h3>Ürünler</h3>
              <ul className="footer-menu">
                <li>
                  <Link href="/urunler?kategori=gida">Gıda</Link>
                </li>
                <li>
                  <Link href="/urunler?kategori=kisisel-bakim">Kişisel Bakım</Link>
                </li>
                <li>
                  <Link href="/urunler?kategori=evcil-hayvan">Evcil Hayvan</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h3>Üretim</h3>
              <ul className="footer-menu">
                <li>
                  <Link href="/p/teknoloji">Teknoloji</Link>
                </li>
                <li>
                  <Link href="/p/uretim-surecleri">Üretim Süreçleri</Link>
                </li>
                <li>
                  <Link href="/p/sertifikalar">Sertifikalar</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3">
              <h3>İletişim</h3>
              <ul className="footer-menu">
                {ayar.iletisimEposta ? (
                  <li>
                    <a href={`mailto:${ayar.iletisimEposta}`}>{ayar.iletisimEposta}</a>
                  </li>
                ) : null}
                {ayar.iletisimTelefon ? <li>{ayar.iletisimTelefon}</li> : null}
                <li>
                  <Link href="/iletisim">İletişim Formu</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
