import { promises as fs } from "fs";
import path from "path";
import { getDataDir } from "@/lib/data-dir";

export type AyfleksSlide = {
  id: string;
  href: string;
  h1: string;
  h2: string;
  image: string;
  imageAlt: string;
};

export type AyfleksCategoryItem = {
  label: string;
  href: string;
  image: string;
};

export type AyfleksHome = {
  slider: AyfleksSlide[];
  about: {
    h1: string;
    h2: string;
    videoUrl: string;
    videoCover: string;
    paragraphs: string[];
    linkHref: string;
  };
  categories: {
    h1: string;
    h2: string;
    items: AyfleksCategoryItem[];
  };
  sustainability: {
    h2: string;
    h1: string;
    text: string;
    linkHref: string;
    image: string;
  };
  export: {
    h2: string;
    h1: string;
    text: string;
    image: string;
  };
  contactCta: {
    h2: string;
    h1: string;
    text: string;
  };
};

const FILE = "ayfleks-home.json";
const FILE_EN = "ayfleks-home-en.json";

async function readHomeFile(name: string): Promise<AyfleksHome> {
  const dir = await getDataDir();
  const fp = path.join(dir, name);
  try {
    const raw = await fs.readFile(fp, "utf8");
    return JSON.parse(raw) as AyfleksHome;
  } catch {
    const fallback = path.join(process.cwd(), "data", "ayfleks", name);
    const raw = await fs.readFile(fallback, "utf8");
    return JSON.parse(raw) as AyfleksHome;
  }
}

export async function ayfleksHomeGetir(locale: "tr" | "en" = "tr"): Promise<AyfleksHome> {
  return readHomeFile(locale === "en" ? FILE_EN : FILE);
}

export async function ayfleksHomeKaydet(data: AyfleksHome): Promise<void> {
  const dir = await getDataDir();
  const fp = path.join(dir, FILE);
  await fs.writeFile(fp, JSON.stringify(data, null, 2), "utf8");
}
