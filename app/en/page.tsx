import type { Metadata } from "next";
import { AyfleksCookieBanner } from "@/components/ayfleks/AyfleksCookieBanner";
import { AyfleksFooter } from "@/components/ayfleks/AyfleksFooter";
import { AyfleksHeader } from "@/components/ayfleks/AyfleksHeader";
import { AyfleksHomeSections } from "@/components/ayfleks/AyfleksHomeSections";
import { AyfleksJsonLd } from "@/components/ayfleks/AyfleksJsonLd";
import { AyfleksStyles } from "@/components/ayfleks/AyfleksStyles";
import { ayfleksHomeGetir } from "@/lib/ayfleks-home-store";
import type { MenuItem } from "@/lib/menu-store";
import { ayarlarGetir } from "@/lib/settings-store";
import { siteUrl } from "@/lib/site";

const EN_MENU: MenuItem[] = [
  {
    label: "Corporate",
    href: "/en/p/en-about-us",
    children: [
      { label: "About Us", href: "/en/p/en-about-us" },
      { label: "Vision – Mission", href: "/en/p/en-vision-mission" },
      { label: "Our Values", href: "/en/p/en-our-values" },
      { label: "Our Policies", href: "/en/p/en-our-policies" },
      { label: "News", href: "/en/news" },
    ],
  },
  {
    label: "Products",
    href: "/en/products",
    children: [
      { label: "Food", href: "/en/product-groups/food" },
      { label: "Personal Care & Hygiene", href: "/en/product-groups/personal-care-hygiene" },
      { label: "Pet Care", href: "/en/product-groups/pet-care" },
      { label: "Industrial", href: "/en/product-groups/industrial" },
    ],
  },
  {
    label: "Sustainability",
    href: "/en/p/en-our-approach-to-sustainability",
    children: [
      { label: "Our Approach", href: "/en/p/en-our-approach-to-sustainability" },
      { label: "Goals", href: "/en/p/en-sustainability-goals" },
      { label: "Activities", href: "/en/p/en-activities" },
    ],
  },
  { label: "Contact", href: "/en/contact" },
];

const EN_FOOTER: MenuItem[] = [
  { label: "About Us", href: "/en/p/en-about-us" },
  { label: "Products", href: "/en/products" },
  { label: "Sustainability", href: "/en/p/en-our-approach-to-sustainability" },
  { label: "Contact", href: "/en/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  const en = `${base.replace(/\/$/, "")}/en`;
  return {
    title: "Ayfleks Packaging | Food, Personal Care, Pet Care, Industrial",
    description:
      "Ayfleks Packaging — sustainable flexible packaging solutions since 1974 for food, personal care, pet care and industrial markets.",
    alternates: { canonical: en, languages: { en, tr: base } },
    openGraph: { locale: "en_US", url: en },
  };
}

export default async function EnHomePage() {
  const [ayar, home] = await Promise.all([ayarlarGetir(), ayfleksHomeGetir()]);
  const enHome = {
    ...home,
    about: { ...home.about, h1: "Ayfleks", h2: "About", linkHref: "/en/p/en-about-us", paragraphs: [
      "Since 1974, Ayfleks has been delivering standard and customized packaging solutions with a customer-focused approach and a team of over 300 people.",
      "In addition to Türkiye, Ayfleks continues its international activities and is preparing to expand into the USA–Middle East–Africa markets.",
    ]},
    categories: {
      h1: "Products",
      h2: "what we offer",
      items: [
        { label: "Food", href: "/en/product-groups/food", image: home.categories.items[0]?.image || "" },
        { label: "Personal Care & Hygiene", href: "/en/product-groups/personal-care-hygiene", image: home.categories.items[1]?.image || "" },
        { label: "Pet Care", href: "/en/product-groups/pet-care", image: home.categories.items[2]?.image || "" },
        { label: "Industrial", href: "/en/product-groups/industrial", image: home.categories.items[3]?.image || "" },
      ],
    },
    sustainability: {
      ...home.sustainability,
      h2: "We know our responsibility.",
      h1: "Care for nature and the environment is part of our business.",
      text: "Our meticulous and ethical approach to nature and the environment is an integral part of what we do.",
      linkHref: "/en/p/en-our-approach-to-sustainability",
    },
    export: {
      ...home.export,
      h2: "our export route",
      h1: "With exports to nearly 60 countries, we guide packaging on its global journey.",
    },
    contactCta: {
      h2: "contact us",
      h1: "How can we help you?",
      text: "Leave your email and our team will get back to you.",
    },
    slider: home.slider.map((s) => ({
      ...s,
      href: s.href.replace("/urun-gruplarimiz/gida", "/en/product-groups/food")
        .replace("/urun-gruplarimiz/kisisel-bakim-hijyen", "/en/product-groups/personal-care-hygiene")
        .replace("/urun-gruplarimiz/evcil-hayvan-bakimi", "/en/product-groups/pet-care")
        .replace("/urun-gruplarimiz/endustriyel", "/en/product-groups/industrial")
        .replace("/p/surdurulebilirlik-yaklasimi", "/en/p/en-our-approach-to-sustainability"),
    })),
  };

  return (
    <>
      <AyfleksStyles />
      <AyfleksJsonLd ayar={ayar} />
      <AyfleksHeader menu={EN_MENU} langHref="/" langLabel="TR" />
      <main>
        <AyfleksHomeSections home={enHome} />
      </main>
      <AyfleksFooter footerMenu={EN_FOOTER} ayar={ayar} />
      <AyfleksCookieBanner />
    </>
  );
}
