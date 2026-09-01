"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "ayfleks_cookie_ok";

const COPY = {
  tr: {
    title: "Cookie Kullanım Onayı",
    body: "Ayfleks web sitesi, sizlere daha iyi bir deneyim sunabilmek için, Google Analytics verilerini izlemek amacıyla temel cookie öğelerini kullanır.",
    accept: "Kabul Et",
    reject: "Reddet",
    aria: "Çerez kullanımı",
  },
  en: {
    title: "Cookie Consent",
    body: "The Ayfleks website uses essential cookies to improve your experience and to track Google Analytics data.",
    accept: "Accept",
    reject: "Reject",
    aria: "Cookie consent",
  },
};

export function AyfleksCookieBanner({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const [show, setShow] = useState(false);
  const t = COPY[locale];
  const privacyHref = locale === "en" ? "/en/p/en-gdpr" : "/p/kvkk";
  const policyHref = locale === "en" ? "/en/cookie-policy" : "/cerez-politikasi";

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) || document.cookie.includes("cookieBy=")) return;
      requestAnimationFrame(() => setShow(true));
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
      document.cookie = "cookieBy=codinglab; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  function reject() {
    try {
      localStorage.setItem(KEY, "0");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className={`wrapper-tkpn${show ? " show" : ""}`} role="dialog" aria-label={t.aria}>
      <header>
        <svg className="ayf-cookie-icon" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" fill="none" stroke="#39B54A" strokeWidth="1.5" />
          <circle cx="8" cy="10" r="1.2" fill="#39B54A" />
          <circle cx="14" cy="8" r="1" fill="#39B54A" />
          <circle cx="15" cy="14" r="1.3" fill="#39B54A" />
          <circle cx="9" cy="15" r="0.9" fill="#39B54A" />
        </svg>
        <h2>{t.title}</h2>
      </header>
      <div className="data">
        <p>
          {t.body}{" "}
          <Link href={privacyHref}>{locale === "en" ? "GDPR Privacy Notice" : "KVKK Aydınlatma Metni"}</Link>{" "}
          {locale === "en" ? "and" : "ve"}{" "}
          <Link href={policyHref}>{locale === "en" ? "Cookie Policy" : "Çerez Politikası"}</Link>.
        </p>
      </div>
      <div className="buttons">
        <button type="button" className="button" id="acceptBtn" onClick={accept}>
          {t.accept}
        </button>
        <button type="button" className="button" id="declineBtn" onClick={reject}>
          {t.reject}
        </button>
      </div>
    </div>
  );
}
