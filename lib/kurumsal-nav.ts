const TR_ITEMS = [
  { key: "hakkimizda", label: "Hakkımızda", href: "/p/hakkimizda" },
  { key: "vizyon-misyon", label: "Vizyon – Misyon", href: "/p/vizyon-misyon" },
  { key: "degerlerimiz", label: "Değerlerimiz", href: "/p/degerlerimiz" },
  { key: "politikalarimiz", label: "Politikalarımız", href: "/p/politikalarimiz" },
  { key: "haberler", label: "Haberler", href: "/haberler" },
  { key: "is-etigi-formu", label: "İş Etiği Formu", href: "/p/is-etigi-formu" },
] as const;

const EN_ITEMS = [
  { key: "en-about-us", label: "About Us", href: "/en/p/en-about-us" },
  { key: "en-vision-mission", label: "Vision – Mission", href: "/en/p/en-vision-mission" },
  { key: "en-our-values", label: "Our Values", href: "/en/p/en-our-values" },
  { key: "en-our-policies", label: "Our Policies", href: "/en/p/en-our-policies" },
  { key: "en-news", label: "News", href: "/en/news" },
  { key: "en-business-ethics-form", label: "Business Ethics Form", href: "/en/p/en-business-ethics-form" },
] as const;

export function kurumsalSubnavItems(locale: "tr" | "en") {
  return locale === "en" ? EN_ITEMS : TR_ITEMS;
}

export function isKurumsalSubnavPage(slug: string, locale: "tr" | "en"): boolean {
  return kurumsalSubnavItems(locale).some((x) => x.key === slug);
}
