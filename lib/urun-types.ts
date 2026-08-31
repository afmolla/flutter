export type UrunBirim = "adet" | "kg";

export type UrunVaryant = {
  id: string;
  etiket: string;
  miktar: number;
  birim: UrunBirim;
  fiyat: number;
  indirimliFiyat?: number;
};

export type UrunKategoriId = "gida" | "kisisel-bakim" | "evcil-hayvan" | "endustriyel";

export type UrunKayit = {
  id: string;
  slug: string;
  baslik: string;
  ozet: string;
  aciklama?: string;
  kategoriId: UrunKategoriId;
  imageSrc: string;
  imageAlt?: string;
  etiket?: string;
  minSiparis?: string;
  varyantlar: UrunVaryant[];
  yayinda: boolean;
  stokta: boolean;
  sira: number;
  guncellenme: string;
  locale?: "tr" | "en";
};

export const URUN_KATEGORILER: {
  id: UrunKategoriId;
  baslik: string;
  baslikEn: string;
  aciklama: string;
  aciklamaEn: string;
  href: string;
}[] = [
  {
    id: "gida",
    baslik: "Gıda",
    baslikEn: "Food",
    aciklama: "Güvenilir ambalaj çözümleri",
    aciklamaEn: "Reliable packaging solutions",
    href: "/urun-gruplarimiz/gida",
  },
  {
    id: "kisisel-bakim",
    baslik: "Kişisel Bakım & Hijyen",
    baslikEn: "Personal Care & Hygiene",
    aciklama: "Hijyenik & estetik ambalaj",
    aciklamaEn: "Hygienic & aesthetic packaging",
    href: "/urun-gruplarimiz/kisisel-bakim-hijyen",
  },
  {
    id: "evcil-hayvan",
    baslik: "Evcil Hayvan Bakımı",
    baslikEn: "Pet Care",
    aciklama: "Kaliteli & güvenilir ambalaj",
    aciklamaEn: "Quality & reliable packaging",
    href: "/urun-gruplarimiz/evcil-hayvan-bakimi",
  },
  {
    id: "endustriyel",
    baslik: "Endüstriyel",
    baslikEn: "Industrial",
    aciklama: "Dayanıklı & fonksiyonel tasarımlar",
    aciklamaEn: "Durable & functional designs",
    href: "/urun-gruplarimiz/endustriyel",
  },
];

export function kategoriLabel(kat: (typeof URUN_KATEGORILER)[number], locale: "tr" | "en" = "tr"): string {
  return locale === "en" ? kat.baslikEn : kat.baslik;
}

export function kategoriAciklama(kat: (typeof URUN_KATEGORILER)[number], locale: "tr" | "en" = "tr"): string {
  return locale === "en" ? kat.aciklamaEn : kat.aciklama;
}

export function urunVaryantFiyat(v: UrunVaryant): number {
  return typeof v.indirimliFiyat === "number" && v.indirimliFiyat > 0 ? v.indirimliFiyat : v.fiyat;
}

export function formatTry(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(n);
}
