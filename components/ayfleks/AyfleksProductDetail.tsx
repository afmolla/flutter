"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { UrunKayit } from "@/lib/urun-types";

type Props = {
  urun: UrunKayit;
  locale?: "tr" | "en";
  teklifHref: string;
  teklifLabel: string;
  galeriBaslik: string;
};

function tabId(base: string, index: number): string {
  return `${base}-tab-${index}`;
}

export function AyfleksProductDetail({ urun, locale = "tr", teklifHref, teklifLabel, galeriBaslik }: Props) {
  const uid = useId().replace(/:/g, "");
  const sekmeler = urun.sekmeler?.filter((s) => s.baslik && s.icerikHtml) ?? [];
  const ozellikler = urun.ozellikler?.filter(Boolean) ?? [];
  const galeri = urun.galeri?.filter(Boolean) ?? [];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="product-details">
      <div className="container">
        <div className="row">
          <h1 style={{ marginBottom: 28 }}>{urun.baslik}</h1>
          {urun.ozet ? <p>{urun.ozet}</p> : null}
        </div>

        <div className="row prod-certs">
          <div className="col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brc-logo.png" alt="" className="img-fluid" />
          </div>
          <div className="col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-iso22000.webp" alt="" className="img-fluid" />
          </div>
        </div>

        <div className="row pdt-prod">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urun.imageSrc} alt={urun.imageAlt || urun.baslik} className="img-fluid pdt-main-img" />
        </div>

        {ozellikler.length > 0 ? (
          <>
            <div className="row dots">
              {ozellikler.map((_, i) => (
                <div key={i} className={`prd-dt-dot${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/product-dot.svg" alt="" className="img-fluid" />
                </div>
              ))}
            </div>
            <div className="row aciklamalar">
              {ozellikler.map((text, i) => (
                <div key={i} className={`prd-dt-aciklama${i + 1}`}>
                  {text}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {sekmeler.length > 0 ? (
          <div className="row tabsis">
            <nav>
              <div className="nav nav-tabs" id={`nav-tab-${uid}`} role="tablist">
                {sekmeler.map((sekme, i) => (
                  <button
                    key={sekme.baslik}
                    type="button"
                    role="tab"
                    id={tabId(uid, i)}
                    aria-controls={tabId(uid, i).replace("-tab-", "-pane-")}
                    aria-selected={activeTab === i}
                    className={`nav-link${activeTab === i ? " active" : ""}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {sekme.baslik}
                  </button>
                ))}
              </div>
            </nav>
            <div className="tab-content" id={`nav-tabContent-${uid}`}>
              {sekmeler.map((sekme, i) => (
                <div
                  key={sekme.baslik}
                  role="tabpanel"
                  id={tabId(uid, i).replace("-tab-", "-pane-")}
                  aria-labelledby={tabId(uid, i)}
                  className={`tab-pane fade${activeTab === i ? " show active" : ""}`}
                  hidden={activeTab !== i}
                >
                  <div className="row tabrow" dangerouslySetInnerHTML={{ __html: sekme.icerikHtml }} />
                </div>
              ))}
            </div>
          </div>
        ) : urun.aciklama ? (
          <div className="row tabsis">
            <div
              className="tab-content"
              dangerouslySetInnerHTML={{
                __html: urun.aciklama.includes("<") ? urun.aciklama : `<p>${urun.aciklama.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`,
              }}
            />
          </div>
        ) : null}

        {galeri.length > 0 ? (
          <div className="row urun-gallery-f">
            <h2>{galeriBaslik}</h2>
            <div className="row">
              {galeri.map((src) => (
                <div key={src} className="col-md-4 col-6 mb-4">
                  <a href={src} data-fancybox="gallery" target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="img-fluid img-thumbnail" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="row" style={{ marginBottom: 48 }}>
          <div className="col-12">
            <Link href={teklifHref} className="btn-green" style={{ display: "inline-block", textAlign: "center" }}>
              {teklifLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
