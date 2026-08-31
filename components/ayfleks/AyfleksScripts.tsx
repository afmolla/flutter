"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    jQuery?: JQueryStatic;
  }
}

type JQueryStatic = {
  (selector: string | Element): JQueryInstance;
  fn: Record<string, unknown>;
};

type JQueryInstance = {
  owlCarousel?: (opts: Record<string, unknown>) => JQueryInstance;
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
}

export function AyfleksScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadScript("/js/jquery.min.js");
      await loadScript("/js/bootstrap.min.js");
      await loadScript("/js/owl.carousel.min.js");
      await loadScript("/js/aos.js");
      await loadScript("/js/jquery.fancybox.min.js");
      await loadScript("/js/main.js");
      if (cancelled) return;
      const $ = window.jQuery;
      if ($ && typeof ($.fn as { owlCarousel?: unknown }).owlCarousel === "function") {
        const el = document.querySelector("#slider-manset");
        if (el && !el.classList.contains("owl-loaded")) {
          ($ as (sel: Element) => { owlCarousel: (opts: Record<string, unknown>) => void })(el).owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 6000,
            dots: true,
            nav: false,
          });
        }
      }
      const aos = (window as Window & { AOS?: { init: (o: Record<string, unknown>) => void } }).AOS;
      aos?.init({ duration: 800, once: true });
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
