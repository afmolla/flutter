"use client";

import { usePanelFetch, useWithBase } from "@/components/SitePrefixProvider";
import type { UrunKayit } from "@/lib/urun-types";
import { URUN_KATEGORILER } from "@/lib/urun-types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function PanelUrunler() {
  const wb = useWithBase();
  const panelFetch = usePanelFetch();
  const router = useRouter();
  const [list, setList] = useState<UrunKayit[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [form, setForm] = useState({
    baslik: "",
    ozet: "",
    kategoriId: "gida" as UrunKayit["kategoriId"],
    imageSrc: "",
    locale: "tr" as "tr" | "en",
  });

  const fetchList = useCallback(async () => {
    try {
      const res = await panelFetch(wb("/api/panel/urunler"), { cache: "no-store", credentials: "same-origin" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) {
        setErr("Ürünler yüklenemedi");
        return;
      }
      const j = (await res.json()) as { urunler?: UrunKayit[] };
      setList(Array.isArray(j.urunler) ? j.urunler : []);
      setErr("");
    } catch {
      setErr("Ürünler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [panelFetch, router, wb]);

  useEffect(() => {
    queueMicrotask(() => void fetchList());
  }, [fetchList]);

  async function toggleYayin(urun: UrunKayit) {
    setSaving(urun.id);
    try {
      const res = await panelFetch(wb(`/api/panel/urunler/${urun.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ yayinda: !urun.yayinda }),
      });
      if (res.ok) await fetchList();
    } finally {
      setSaving(null);
    }
  }

  async function add() {
    if (!form.baslik || !form.ozet || !form.imageSrc) return;
    setSaving("new");
    try {
      const res = await panelFetch(wb("/api/panel/urunler"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...form, varyantlar: [], yayinda: true, stokta: true, sira: list.length + 1 }),
      });
      if (res.ok) {
        setForm({ baslik: "", ozet: "", kategoriId: "gida", imageSrc: "", locale: "tr" });
        await fetchList();
      } else setErr("Ürün eklenemedi");
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <p className="text-center text-[var(--muted)]">Yükleniyor…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Ürünler</h1>
        <p className="text-sm text-[var(--muted)]">Kategoriler: gida, kisisel-bakim, evcil-hayvan, endustriyel</p>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
        <h2 className="font-medium">Yeni ürün</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded border px-3 py-2 text-sm" placeholder="Başlık" value={form.baslik} onChange={(e) => setForm({ ...form, baslik: e.target.value })} />
          <input className="rounded border px-3 py-2 text-sm" placeholder="Özet" value={form.ozet} onChange={(e) => setForm({ ...form, ozet: e.target.value })} />
          <select className="rounded border px-3 py-2 text-sm" value={form.kategoriId} onChange={(e) => setForm({ ...form, kategoriId: e.target.value as UrunKayit["kategoriId"] })}>
            {URUN_KATEGORILER.map((k) => (
              <option key={k.id} value={k.id}>{k.baslik}</option>
            ))}
          </select>
          <select className="rounded border px-3 py-2 text-sm" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value as "tr" | "en" })}>
            <option value="tr">TR</option>
            <option value="en">EN</option>
          </select>
          <input className="rounded border px-3 py-2 text-sm sm:col-span-2" placeholder="Görsel URL (/images/urunler/...)" value={form.imageSrc} onChange={(e) => setForm({ ...form, imageSrc: e.target.value })} />
        </div>
        <button type="button" className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--on-brand)]" disabled={saving === "new"} onClick={add}>
          Ekle
        </button>
      </div>

      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        {list.map((u) => {
          const kat = URUN_KATEGORILER.find((k) => k.id === u.kategoriId)?.baslik ?? u.kategoriId;
          return (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="font-medium">{u.baslik}</p>
                <p className="text-xs text-[var(--muted)]">{kat} · {u.locale || "tr"} · /urun/{u.slug}</p>
              </div>
              <button type="button" className="rounded border px-2 py-1 text-xs" disabled={saving === u.id} onClick={() => toggleYayin(u)}>
                {u.yayinda ? "Yayında" : "Taslak"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
