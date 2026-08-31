"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "ayfleks_cookie_ok";

const COPY = {
  tr: {
    title: "Cookie Kullanım Onayı",
    body: "Ayfleks web sitesi, sizlere daha iyi bir deneyim sunabilmek için, Google Analytics verilerini izlemek amacıyla temel cookie öğelerini kullanır.",
    privacy: "KVKK Aydınlatma Metni",
    policy: "Çerez Politikası",
    privacyHref: "/p/kvkk",
    policyHref: "/cerez-politikasi",
    accept: "Kabul Et",
    reject: "Reddet",
    aria: "Çerez kullanımı",
  },
  en: {
    title: "Cookie Consent",
    body: "The Ayfleks website uses essential cookies to improve your experience and to track Google Analytics data.",
    privacy: "GDPR Privacy Notice",
    policy: "Cookie Policy",
    privacyHref: "/en/p/en-gdpr",
    policyHref: "/en/cookie-policy",
    accept: "Accept",
    reject: "Reject",
    aria: "Cookie consent",
  },
};

export function AyfleksCookieBanner({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const [show, setShow] = useState(false);
  const t = COPY[locale];

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY) && !document.cookie.includes("ayfleks_cookie=")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
      document.cookie = "ayfleks_cookie=1; max-age=" + 60 * 60 * 24 * 365 + "; path=/";
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

  if (!show) return null;

  return (
    <div className="ayf-cookie show" role="dialog" aria-label={t.aria}>
      <h2>{t.title}</h2>
      <p>
        {t.body}{" "}
        <Link href={t.privacyHref}>{t.privacy}</Link> and <Link href={t.policyHref}>{t.policy}</Link>.
      </p>
      <div className="btns">
        <button type="button" className="accept" onClick={accept}>
          {t.accept}
        </button>
        <button type="button" className="reject" onClick={reject}>
          {t.reject}
        </button>
      </div>
    </div>
  );
}
