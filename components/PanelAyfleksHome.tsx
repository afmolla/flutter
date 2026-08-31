"use client";

import { usePanelFetch, useWithBase } from "@/components/SitePrefixProvider";
import type { AyfleksHome } from "@/lib/ayfleks-home-store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function PanelAyfleksHome() {
  const wb = useWithBase();
  const panelFetch = usePanelFetch();
  const router = useRouter();
  const [home, setHome] = useState<AyfleksHome | null>(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await panelFetch(wb("/api/panel/ayfleks-home"), { cache: "no-store", credentials: "same-origin" });
    if (res.status === 401) {
      router.refresh();
      return;
    }
    if (!res.ok) {
      setErr("Ana sayfa içeriği yüklenemedi");
      return;
    }
    const j = (await res.json()) as { home: AyfleksHome };
    setHome(j.home);
  }, [panelFetch, router, wb]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  async function save() {
    if (!home) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await panelFetch(wb("/api/panel/ayfleks-home"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(home),
      });
      if (res.ok) setMsg("Kaydedildi");
      else setErr("Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  if (!home) return <p className="text-center text-[var(--muted)]">{err || "Yükleniyor…"}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Ana sayfa</h1>
          <p className="text-sm text-[var(--muted)]">Slider, hakkında, kategoriler, sürdürülebilirlik ve CTA metinleri.</p>
        </div>
        <button type="button" disabled={saving} onClick={save} className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--on-brand)]">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
      {msg ? <p className="text-sm text-green-700">{msg}</p> : null}
      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <h2 className="font-medium">Hakkında</h2>
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.about.h1} onChange={(e) => setHome({ ...home, about: { ...home.about, h1: e.target.value } })} />
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.about.h2} onChange={(e) => setHome({ ...home, about: { ...home.about, h2: e.target.value } })} />
        <textarea className="min-h-[100px] w-full rounded border px-3 py-2 text-sm" value={home.about.paragraphs.join("\n\n")} onChange={(e) => setHome({ ...home, about: { ...home.about, paragraphs: e.target.value.split(/\n\n+/).filter(Boolean) } })} />
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <h2 className="font-medium">Sürdürülebilirlik bloğu</h2>
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.sustainability.h2} onChange={(e) => setHome({ ...home, sustainability: { ...home.sustainability, h2: e.target.value } })} />
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.sustainability.h1} onChange={(e) => setHome({ ...home, sustainability: { ...home.sustainability, h1: e.target.value } })} />
        <textarea className="min-h-[80px] w-full rounded border px-3 py-2 text-sm" value={home.sustainability.text} onChange={(e) => setHome({ ...home, sustainability: { ...home.sustainability, text: e.target.value } })} />
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <h2 className="font-medium">İhracat bloğu</h2>
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.export.h2} onChange={(e) => setHome({ ...home, export: { ...home.export, h2: e.target.value } })} />
        <input className="w-full rounded border px-3 py-2 text-sm" value={home.export.h1} onChange={(e) => setHome({ ...home, export: { ...home.export, h1: e.target.value } })} />
        <textarea className="min-h-[80px] w-full rounded border px-3 py-2 text-sm" value={home.export.text} onChange={(e) => setHome({ ...home, export: { ...home.export, text: e.target.value } })} />
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <h2 className="font-medium">Slider ({home.slider.length} slayt)</h2>
        {home.slider.map((s, i) => (
          <div key={s.id} className="grid gap-2 rounded border border-[var(--border)] p-3 sm:grid-cols-2">
            <input className="rounded border px-2 py-1 text-sm" value={s.h1} placeholder="H1" onChange={(e) => {
              const slider = [...home.slider];
              slider[i] = { ...s, h1: e.target.value };
              setHome({ ...home, slider });
            }} />
            <input className="rounded border px-2 py-1 text-sm" value={s.h2} placeholder="H2" onChange={(e) => {
              const slider = [...home.slider];
              slider[i] = { ...s, h2: e.target.value };
              setHome({ ...home, slider });
            }} />
            <input className="rounded border px-2 py-1 text-sm sm:col-span-2" value={s.image} placeholder="Görsel" onChange={(e) => {
              const slider = [...home.slider];
              slider[i] = { ...s, image: e.target.value };
              setHome({ ...home, slider });
            }} />
          </div>
        ))}
      </section>
    </div>
  );
}
