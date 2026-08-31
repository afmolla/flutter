import type { Metadata } from "next";
import Link from "next/link";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { URUN_KATEGORILER } from "@/lib/urun-types";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Products",
    alternates: { canonical: `${base.replace(/\/$/, "")}/en/products` },
  };
}

const HREF: Record<string, string> = {
  gida: "/en/product-groups/food",
  "kisisel-bakim": "/en/product-groups/personal-care-hygiene",
  "evcil-hayvan": "/en/product-groups/pet-care",
  endustriyel: "/en/product-groups/industrial",
};

export default function EnProductsPage() {
  return (
    <AyfleksShell inside langHref="/" langLabel="TR">
      <AyfleksPageHero title="Products" crumbs={[{ label: "Home", href: "/en" }, { label: "Products" }]} />
      <div className="container content-page">
        <div className="row d-flex justify-content-between" style={{ marginTop: 48, marginBottom: 48 }}>
          {URUN_KATEGORILER.map((k) => (
            <div key={k.id} className="col-md-3 nh-col">
              <Link href={HREF[k.id]}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    k.id === "gida"
                      ? "/images/kategoriler/gida_8dd8e.webp.720p.webp"
                      : k.id === "kisisel-bakim"
                        ? "/images/kategoriler/kategori-kisisel-bakim_193da.webp.720p.webp"
                        : k.id === "evcil-hayvan"
                          ? "/images/kategoriler/kategori-evcil-hayvan_15dfd.webp.720p.webp"
                          : "/images/kategoriler/kategori-endustriyel_06739.webp.720p.webp"
                  }
                  alt={k.baslikEn}
                />
                <h3>{k.baslikEn}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AyfleksShell>
  );
}
