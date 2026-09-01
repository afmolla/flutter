import type { Metadata } from "next";
import Link from "next/link";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { URUN_KATEGORILER } from "@/lib/urun-types";
import { urunlerGetir, urunYayinda } from "@/lib/urun-store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Ürünler",
    description: "Ayfleks ürün grupları — gıda, kişisel bakım, evcil hayvan ve endüstriyel ambalaj.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/urunler` },
  };
}

export default async function UrunlerPage() {
  const list = urunYayinda(await urunlerGetir()).filter((u) => (u.locale || "tr") === "tr");
  return (
    <AyfleksShell inside>
      <AyfleksPageHero title="Ürünler" crumbs={[{ label: "Anasayfa", href: "/" }, { label: "Ürünler" }]} />
      <div className="container content-page">
        <div className="row d-flex justify-content-between" style={{ marginTop: 48, marginBottom: 48 }}>
          {URUN_KATEGORILER.map((k) => (
            <div key={k.id} className="col-md-3 nh-col">
              <Link href={k.href}>
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
                  alt={k.baslik}
                />
                <h3>{k.baslik}</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="" />
              </Link>
            </div>
          ))}
        </div>
        <p className="text-muted">{list.length} ürün paneldan yönetiliyor.</p>
      </div>
    </AyfleksShell>
  );
}
