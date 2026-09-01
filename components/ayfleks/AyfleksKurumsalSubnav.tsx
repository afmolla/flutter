"use client";

import Link from "next/link";
import { kurumsalSubnavItems } from "@/lib/kurumsal-nav";

export function AyfleksKurumsalSubnav({ activeSlug, locale = "tr" }: { activeSlug: string; locale?: "tr" | "en" }) {
  const items = kurumsalSubnavItems(locale);
  return (
    <div className="container">
      <div className="icerik-menu">
        <ul>
          {items.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className={item.key === activeSlug ? "selected" : ""}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
