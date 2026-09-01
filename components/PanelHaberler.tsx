"use client";

import { usePanelFetch, useWithBase } from "@/components/SitePrefixProvider";
import type { Haber } from "@/lib/haber-store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function PanelHaberler() {
  const wb = useWithBase();
  const panelFetch = usePanelFetch();
  const router = useRouter();
  const [list, setList] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ slug: "", baslik: "", aciklama: "", icerikHtml: "", imageSrc: "", locale: "tr" as "tr" | "en" });
  const [saving, setSaving] = useState(false);

  const fetchList = useCallback(async () => {
    try {
      const res = await panelFetch(wb("/api/panel/haberler"), { cache: "no-store", credentials: "same-origin" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) {
        setErr("Haberler yüklenemedi");
        return;
      }
      const j = (await res.json()) as { haberler?: Haber[] };
      setList(Array.isArray(j.haberler) ? j.haberler : []);
      setErr("");
    } catch {
      setErr("Haberler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [panelFetch, router, wb]);

  useEffect(() => {
    queueMicrotask(() => void fetchList());
  }, [fetchList]);

  async function save() {
    if (!form.slug.trim() || !form.baslik.trim()) return;
    setSaving(true);
    try {
      const res = await panelFetch(wb("/api/panel/haberler"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...form, yayin: true }),
      });
      if (res.ok) {
        setForm({ slug: "", baslik: "", aciklama: "", icerikHtml: "", imageSrc: "", locale: "tr" });
        await fetchList();
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggle(h: Haber) {
    await panelFetch(wb("/api/panel/haberler"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ ...h, yayin: !h.yayin }),
    });
    await fetchList();
  }

  async function remove(slug: string) {
    if (!confirm("Haberi sil?")) return;
    await panelFetch(wb(`/api/panel/haberler?slug=${encodeURIComponent(slug)}`), {
      method: "DELETE",
      credentials: "same-origin",
    });
    await fetchList();
  }

  if (loading) return <p className="text-center text-[var(--muted)]">Yükleniyor…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Haberler</h1>
        <p className="text-sm text-[var(--muted)]">Panelden haber ekleyin; sitede /haberler altında yayınlanır.</p>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
        <h2 className="font-medium">Yeni / güncelle</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded border px-3 py-2 text-sm" placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Başlık" value={form.baslik} onChange={(e) => setForm({ ...form, baslik: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm sm:col-span-2" placeholder="Kısa açıklama (SEO)" value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm sm:col-span-2" placeholder="Görsel URL (/images/...)" value={form.imageSrc} onChange={(e) => setForm({ ...form, imageSrc: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value as "tr" | "en" })}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <textarea className="min-h-[120px] w-full rounded border px-3 py-2 text-sm" placeholder="HTML içerik" value={form.icerikHtml} onChange={(e) => setForm({ ...form, icerikHtml: e.target.value })} />
        <button type="button" disabled={saving} onClick={save} className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--on-brand)]">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {list.map((h) => (
          <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="font-medium">{h.baslik}</p>
              <p className="text-xs text-[var(--muted)]">/{h.locale || "tr"}/haberler/{h.slug} · {h.yayin ? "yayında" : "taslak"}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => toggle(h)}>{h.yayin ? "Gizle" : "Yayınla"}</button>
              <button type="button" className="rounded border px-2 py-1 text-xs text-red-600" onClick={() => remove(h.slug)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
