"use client";

import Link from "next/link";
import { URUN_KATEGORILER, type UrunKategoriId } from "@/lib/urun-types";
import type { UrunKayit } from "@/lib/urun-types";

const SLUG_TO_ID: Record<string, UrunKategoriId> = {
  gida: "gida",
  "kisisel-bakim-hijyen": "kisisel-bakim",
  "evcil-hayvan-bakimi": "evcil-hayvan",
  endustriyel: "endustriyel",
};

export const URUN_GRUP_HERO: Record<string, string> = {
  gida: "/images/kategoriler/ayfleks-gida_42b4f.webp",
  "kisisel-bakim-hijyen": "/images/kategoriler/ayfleks-kisisel-bakim-hijyen_16799.webp",
  "evcil-hayvan-bakimi": "/images/kategoriler/ayfleks-evcil-hayvan-bakimi_49267.webp",
  endustriyel: "/images/kategoriler/ayfleks-endustriyel_ff683.webp",
};

export function AyfleksUrunSubnav({ activeSlug, locale = "tr" }: { activeSlug: string; locale?: "tr" | "en" }) {
  const prefix = locale === "en" ? "/en/product-groups" : "/urun-gruplarimiz";
  const slugs = locale === "en"
    ? [
        { slug: "food", id: "gida" as UrunKategoriId },
        { slug: "personal-care-hygiene", id: "kisisel-bakim" as UrunKategoriId },
        { slug: "pet-care", id: "evcil-hayvan" as UrunKategoriId },
        { slug: "industrial", id: "endustriyel" as UrunKategoriId },
      ]
    : Object.keys(SLUG_TO_ID).map((slug) => ({ slug, id: SLUG_TO_ID[slug] }));

  return (
    <div className="container">
      <div className="icerik-menu">
        <ul>
          {slugs.map(({ slug, id }) => {
            const kat = URUN_KATEGORILER.find((k) => k.id === id);
            if (!kat) return null;
            const label = locale === "en" ? kat.baslikEn : kat.baslik;
            const isActive = slug === activeSlug;
            return (
              <li key={slug}>
                <Link href={`${prefix}/${slug}`} className={isActive ? "selected" : ""}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function ProductCard({ u, locale = "tr" }: { u: UrunKayit; locale?: "tr" | "en" }) {
  const href = locale === "en" ? `/en/product/${u.slug}` : `/urun/${u.slug}`;
  return (
    <div className="col-md-3">
      <Link href={href}>
        <div className="ayfleks-product">
          <div
            className="row ayf-prod-row"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundImage = `url(${u.imageSrc})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundImage = "";
            }}
          >
            <div className="col-md-5 m-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/ayfleks-amblem.svg" alt="" className="img-fluid p-amblem" />
              <h1>{u.baslik}</h1>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icon-arrow-up-green.svg" alt="" className="img-fluid hover-arrow" />
            </div>
            <div className="col-md-7 prods-back" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function AyfleksProductGrupGrid({
  intro,
  products,
  locale = "tr",
}: {
  intro: string;
  products: UrunKayit[];
  locale?: "tr" | "en";
}) {
  return (
    <section className="products-alt">
      <div className="container">
        <div className="row">
          <p>{intro}</p>
        </div>
      </div>
      <div className="row products-alt-page">
        <div className="container">
          <div className="row products-page">
            {products.map((u) => (
              <ProductCard key={u.id} u={u} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
