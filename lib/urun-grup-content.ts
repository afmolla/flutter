import { sayfaBySlug } from "@/lib/pages-store";

const EN_ROUTE_TO_SAYFA: Record<string, string> = {
  food: "en-food",
  "personal-care-hygiene": "en-personal-care-hygiene",
  "pet-care": "en-pet-care",
  industrial: "en-industrial",
};

function decodeHtmlText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** İlk giriş paragrafını ayfleks.com ürün grubu HTML'inden çıkarır. */
export function urunGrupIntroFromHtml(icerikHtml: string): string {
  if (!icerikHtml) return "";
  const sectionMatch = icerikHtml.match(/<section class="products-alt">[\s\S]*?<\/section>/i);
  const scope = sectionMatch?.[0] ?? icerikHtml;
  const pMatch = scope.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch?.[1]) return decodeHtmlText(pMatch[1]);
  return "";
}

export function urunGrupSayfaSlug(routeSlug: string, locale: "tr" | "en"): string {
  if (locale === "en") return EN_ROUTE_TO_SAYFA[routeSlug] ?? routeSlug;
  return routeSlug;
}

export async function urunGrupIntro(routeSlug: string, locale: "tr" | "en" = "tr"): Promise<string> {
  const sayfaSlug = urunGrupSayfaSlug(routeSlug, locale);
  const sayfa = await sayfaBySlug(sayfaSlug, locale);
  if (!sayfa) return "";

  const fromHtml = urunGrupIntroFromHtml(sayfa.icerikHtml);
  if (fromHtml.length > 80) return fromHtml;

  const aciklama = sayfa.aciklama?.trim();
  if (aciklama && aciklama.length > 80) return aciklama;

  return fromHtml || aciklama || "";
}
