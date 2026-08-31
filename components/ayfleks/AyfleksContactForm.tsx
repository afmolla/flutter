"use client";

import { useState } from "react";

const COPY = {
  tr: {
    name: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    message: "Mesajınız",
    send: "Gönder",
    sending: "Gönderiliyor…",
    ok: "Mesajınız alındı. Teşekkürler.",
  },
  en: {
    name: "Full Name",
    email: "Email",
    phone: "Phone",
    message: "Your message",
    send: "Send",
    sending: "Sending…",
    ok: "Your message has been received. Thank you.",
  },
};

export function AyfleksContactForm({ locale = "tr" }: { locale?: "tr" | "en" }) {
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = COPY[locale];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: fd.get("ad"),
          email: fd.get("email"),
          telefon: fd.get("telefon"),
          mesaj: fd.get("mesaj"),
          kaynak: locale === "en" ? "en-contact" : "iletisim",
        }),
      });
      setOk(true);
      e.currentTarget.reset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contanct-us-form" onSubmit={onSubmit} style={{ maxWidth: 640, margin: "0 auto 80px" }}>
      <input className="form-control" name="ad" placeholder={t.name} required />
      <input className="form-control" type="email" name="email" placeholder={t.email} required />
      <input className="form-control" name="telefon" placeholder={t.phone} />
      <textarea className="form-control" name="mesaj" placeholder={t.message} rows={5} required />
      <button type="submit" className="btn-green" disabled={busy}>
        {busy ? t.sending : t.send}
      </button>
      {ok ? <p style={{ marginTop: 16, color: "#39B54A" }}>{t.ok}</p> : null}
    </form>
  );
}
