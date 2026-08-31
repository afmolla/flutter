import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { runWithSiteContext } from "@/lib/site-context";
import { yayinSayfalar } from "@/lib/pages-store";
import { yayinHaberler } from "@/lib/haber-store";
import { urunlerGetir, urunYayinda } from "@/lib/urun-store";
import { AYFLEKS_SUBDIR } from "@/lib/site-config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];
  await runWithSiteContext({ prefix: "", subdir: AYFLEKS_SUBDIR }, async () => {
    const base = (await siteUrl()).replace(/\/$/, "");
    const staticPaths = [
      "/",
      "/en",
      "/urunler",
      "/en/products",
      "/haberler",
      "/iletisim",
      "/en/contact",
      "/cerez-politikasi",
      "/urun-gruplarimiz/gida",
      "/urun-gruplarimiz/kisisel-bakim-hijyen",
      "/urun-gruplarimiz/evcil-hayvan-bakimi",
      "/urun-gruplarimiz/endustriyel",
      "/en/product-groups/food",
      "/en/product-groups/personal-care-hygiene",
      "/en/product-groups/pet-care",
      "/en/product-groups/industrial",
    ];
    for (const p of staticPaths) {
      out.push({ url: `${base}${p === "/" ? "/" : p}`, lastModified: new Date(), changeFrequency: "weekly", priority: p === "/" || p === "/en" ? 1 : 0.8 });
    }
    for (const s of (await yayinSayfalar()).filter((x) => x.seoIndex !== false)) {
      const path = (s.locale === "en" || s.slug.startsWith("en-") ? `/en/p/${s.slug}` : `/p/${s.slug}`);
      out.push({ url: `${base}${path}`, lastModified: new Date(s.guncellenme), changeFrequency: "monthly", priority: 0.7 });
    }
    for (const h of await yayinHaberler("tr")) {
      out.push({ url: `${base}/haberler/${h.slug}`, lastModified: new Date(h.guncellenme), changeFrequency: "monthly", priority: 0.65 });
    }
    for (const u of urunYayinda(await urunlerGetir()).filter((x) => (x.locale || "tr") === "tr")) {
      out.push({ url: `${base}/urun/${u.slug}`, lastModified: new Date(u.guncellenme), changeFrequency: "monthly", priority: 0.6 });
    }
  });
  return out;
}
