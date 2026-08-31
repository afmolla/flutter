"use client";

import { useState } from "react";

export function AyfleksContactForm() {
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

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
          kaynak: "iletisim",
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
      <input className="form-control" name="ad" placeholder="Ad Soyad" required />
      <input className="form-control" type="email" name="email" placeholder="E-posta" required />
      <input className="form-control" name="telefon" placeholder="Telefon" />
      <textarea className="form-control" name="mesaj" placeholder="Mesajınız" rows={5} required />
      <button type="submit" className="btn-green" disabled={busy}>
        {busy ? "Gönderiliyor…" : "Gönder"}
      </button>
      {ok ? <p style={{ marginTop: 16, color: "#39B54A" }}>Mesajınız alındı. Teşekkürler.</p> : null}
    </form>
  );
}
