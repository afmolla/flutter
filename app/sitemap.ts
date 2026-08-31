import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { runWithSiteContext } from "@/lib/site-context";
import { yayinSayfalar } from "@/lib/pages-store";
import { AYFLEKS_SUBDIR } from "@/lib/site-config";

export const revalidate = 3600;

const STATIC_PATHS = ["/", "/urunler", "/iletisim", "/panel"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];

  await runWithSiteContext({ prefix: "", subdir: AYFLEKS_SUBDIR }, async () => {
    const base = (await siteUrl()).replace(/\/$/, "");

    for (const p of STATIC_PATHS) {
      if (p === "/panel") continue;
      out.push({
        url: `${base}${p === "/" ? "/" : p}`,
        lastModified: new Date(),
        changeFrequency: p === "/" ? "weekly" : "monthly",
        priority: p === "/" ? 1 : 0.8,
      });
    }

    const cms = await yayinSayfalar();
    for (const s of cms.filter((x) => x.seoIndex !== false)) {
      out.push({
        url: `${base}/p/${s.slug}`,
        lastModified: new Date(s.guncellenme),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  });

  return out;
}
