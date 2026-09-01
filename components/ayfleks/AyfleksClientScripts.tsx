import Script from "next/script";

/** Font Awesome — footer sosyal ikonları (hamburger SVG kullanılıyor) */
export function AyfleksClientScripts() {
  return <Script src="https://kit.fontawesome.com/c384e56078.js" strategy="lazyOnload" crossOrigin="anonymous" />;
}
