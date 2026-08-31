"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "ayfleks_cookie_ok";

export function AyfleksCookieBanner() {
  const [show, setShow] = useState(false);

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
    <div className="ayf-cookie show" role="dialog" aria-label="Çerez kullanımı">
      <h2>Cookie Kullanım Onayı</h2>
      <p>
        Ayfleks web sitesi, sizlere daha iyi bir deneyim sunabilmek için, Google Analytics verilerini izlemek amacıyla
        temel cookie öğelerini kullanır.{" "}
        <Link href="/p/kvkk">KVKK Aydınlatma Metni</Link> ve{" "}
        <Link href="/cerez-politikasi">Çerez Politikası</Link>.
      </p>
      <div className="btns">
        <button type="button" className="accept" onClick={accept}>
          Kabul Et
        </button>
        <button type="button" className="reject" onClick={reject}>
          Reddet
        </button>
      </div>
    </div>
  );
}
