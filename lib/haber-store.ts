import { promises as fs } from "fs";
import path from "path";
import { getDataDir } from "@/lib/data-dir";

export type Haber = {
  id: string;
  slug: string;
  baslik: string;
  aciklama?: string;
  icerikHtml: string;
  imageSrc?: string;
  yayin: boolean;
  seoIndex?: boolean;
  tarih?: string;
  guncellenme: string;
  locale?: "tr" | "en";
};

type HaberDb = { haberler: Haber[] };

async function dosya(): Promise<string> {
  return path.join(await getDataDir(), "haberler.json");
}

async function oku(): Promise<HaberDb> {
  try {
    return JSON.parse(await fs.readFile(await dosya(), "utf8")) as HaberDb;
  } catch {
    return { haberler: [] };
  }
}

async function yaz(db: HaberDb): Promise<void> {
  const fp = await dosya();
  await fs.mkdir(path.dirname(fp), { recursive: true });
  await fs.writeFile(fp, JSON.stringify(db, null, 2), "utf8");
}

export async function tumHaberler(locale?: "tr" | "en"): Promise<Haber[]> {
  const db = await oku();
  const list = db.haberler.sort((a, b) => (b.tarih || "").localeCompare(a.tarih || ""));
  if (!locale) return list;
  return list.filter((h) => (h.locale || "tr") === locale);
}

export async function yayinHaberler(locale: "tr" | "en" = "tr"): Promise<Haber[]> {
  return (await tumHaberler(locale)).filter((h) => h.yayin);
}

export async function haberBySlug(slug: string, locale?: "tr" | "en"): Promise<Haber | undefined> {
  const matches = (await oku()).haberler.filter((h) => h.slug === slug);
  if (!matches.length) return undefined;
  if (locale) {
    const locMatch = matches.find((h) => (h.locale || "tr") === locale);
    if (locMatch) return locMatch;
  }
  return matches.find((h) => (h.locale || "tr") === "tr") ?? matches[0];
}

export async function haberKaydet(input: Partial<Haber> & { slug: string; baslik: string }): Promise<Haber> {
  const db = await oku();
  const idx = db.haberler.findIndex((h) => h.slug === input.slug);
  const next: Haber = {
    id: input.id || `h${Date.now()}`,
    slug: input.slug,
    baslik: input.baslik,
    aciklama: input.aciklama || "",
    icerikHtml: input.icerikHtml || "",
    imageSrc: input.imageSrc || "",
    yayin: input.yayin ?? true,
    seoIndex: input.seoIndex ?? true,
    tarih: input.tarih || new Date().toISOString().slice(0, 10),
    guncellenme: new Date().toISOString(),
    locale: input.locale || "tr",
  };
  if (idx >= 0) db.haberler[idx] = { ...db.haberler[idx], ...next, id: db.haberler[idx].id };
  else db.haberler.push(next);
  await yaz(db);
  return next;
}

export async function haberSil(slug: string): Promise<boolean> {
  const db = await oku();
  const before = db.haberler.length;
  db.haberler = db.haberler.filter((h) => h.slug !== slug);
  await yaz(db);
  return db.haberler.length < before;
}
