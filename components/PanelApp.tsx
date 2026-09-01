"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { PanelLeads } from "@/components/PanelLeads";
import { PanelVisitors } from "@/components/PanelVisitors";
import { PanelSeo } from "@/components/PanelSeo";
import { PanelMedia } from "@/components/PanelMedia";
import { PanelMenus } from "@/components/PanelMenus";
import { PanelSettings } from "@/components/PanelSettings";
import { PanelUnifiedIcerik } from "@/components/PanelUnifiedIcerik";
import { PanelBackup } from "@/components/PanelBackup";
import { PanelSiteVisualEdit } from "@/components/PanelSiteVisualEdit";
import { PanelUrunler } from "@/components/PanelUrunler";
import { PanelHaberler } from "@/components/PanelHaberler";
import { PanelAyfleksHome } from "@/components/PanelAyfleksHome";
import { useSitePrefix, usePanelFetch, useWithBase } from "@/components/SitePrefixProvider";
import { isPanelContentTab, type VfIcerikSnapshot } from "@/lib/panel-deeplink";

type TabId =
  | "anasayfa"
  | "randevular"
  | "urunler"
  | "haberler"
  | "leads"
  | "ziyaretciler"
  | "seo"
  | "icerik"
  | "site_duzenle"
  | "medya"
  | "menuler"
  | "ayarlar"
  | "yedek";

const NAV: { id: TabId; label: string; short: string }[] = [
  { id: "anasayfa", label: "Ana sayfa", short: "An" },
  { id: "urunler", label: "Ürünler", short: "Ür" },
  { id: "haberler", label: "Haberler", short: "Hb" },
  { id: "randevular", label: "Teklif talepleri", short: "Te" },
  { id: "leads", label: "Lead’ler", short: "Le" },
  { id: "ziyaretciler", label: "Ziyaretçiler", short: "Zi" },
  { id: "seo", label: "SEO", short: "Seo" },
  { id: "icerik", label: "Sayfalar", short: "Sy" },
  { id: "site_duzenle", label: "Site düzenle", short: "Sd" },
  { id: "medya", label: "Medya", short: "Me" },
  { id: "menuler", label: "Menüler", short: "Mn" },
  { id: "ayarlar", label: "Ayarlar", short: "Ay" },
  { id: "yedek", label: "Yedek", short: "Ye" },
];

function tabFromSearchParams(sp: ReadonlyURLSearchParams): TabId {
  const vfTab = sp.get("vf_tab");
  const allowed = new Set(NAV.map((x) => x.id));
  if (vfTab && allowed.has(vfTab as TabId)) return vfTab as TabId;
  const sablon = sp.get("vf_sablon");
  const slug = sp.get("vf_slug")?.trim();
  if (Boolean(slug) || (Boolean(sablon) && isPanelContentTab(sablon ?? ""))) return "icerik";
  return "anasayfa";
}

type PanelAppProps = {
  panelSolMenuSabitle?: boolean;
  panelSolMenuBaslangic?: "acik" | "dar";
  dataSubdir?: string;
};

export function PanelApp(props: PanelAppProps) {
  const wb = useWithBase();
  const panelFetch = usePanelFetch();
  const sitePrefix = useSitePrefix();
  const sabitle = props.panelSolMenuSabitle ?? true;
  const baslangic = props.panelSolMenuBaslangic ?? "acik";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabId>(() => tabFromSearchParams(searchParams));
  const [collapsed, setCollapsed] = useState(baslangic === "dar");

  const vfSablonRaw = searchParams.get("vf_sablon");
  const vfSlugRaw = searchParams.get("vf_slug")?.trim() ?? "";
  const vfIcerikSnapshot: VfIcerikSnapshot | null = useMemo(() => {
    const out: VfIcerikSnapshot = {};
    if (vfSablonRaw && isPanelContentTab(vfSablonRaw)) out.sablon = vfSablonRaw;
    if (vfSlugRaw) out.slug = vfSlugRaw;
    return Object.keys(out).length ? out : null;
  }, [vfSablonRaw, vfSlugRaw]);

  useEffect(() => {
    setTab(tabFromSearchParams(searchParams));
  }, [searchParams]);

  function go(id: TabId) {
    setTab(id);
    const q = new URLSearchParams(searchParams.toString());
    q.set("vf_tab", id);
    router.replace(`${wb("/panel")}?${q.toString()}`, { scroll: false });
  }

  async function logout() {
    await panelFetch("/api/auth/logout", { method: "POST" });
    window.location.href = wb("/panel");
  }

  return (
    <div className="flex min-h-0 flex-1">
      <aside
        className={`shrink-0 border-r border-[var(--border)] bg-[var(--surface)] transition-all ${
          collapsed ? "w-[64px]" : "w-[220px]"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-3">
          {!collapsed ? <span className="text-sm font-semibold">Ayfleks Panel</span> : null}
          {sabitle ? (
            <button
              type="button"
              className="rounded border border-[var(--border)] px-2 py-1 text-xs"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? "»" : "«"}
            </button>
          ) : null}
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm ${
                tab === item.id
                  ? "bg-[var(--brand)] font-semibold text-[var(--on-brand)]"
                  : "text-[var(--text)] hover:bg-[var(--surface-2)]"
              }`}
              title={item.label}
            >
              {collapsed ? item.short : item.label}
            </button>
          ))}
          <button type="button" onClick={logout} className="mt-4 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            {collapsed ? "Çk" : "Çıkış"}
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6">
        {tab === "anasayfa" ? <PanelAyfleksHome /> : null}
        {tab === "urunler" ? <PanelUrunler /> : null}
        {tab === "haberler" ? <PanelHaberler /> : null}
        {tab === "randevular" ? <PanelLeads /> : null}
        {tab === "leads" ? <PanelLeads /> : null}
        {tab === "ziyaretciler" ? <PanelVisitors /> : null}
        {tab === "seo" ? <PanelSeo /> : null}
        {tab === "icerik" ? <PanelUnifiedIcerik snapshot={vfIcerikSnapshot} /> : null}
        {tab === "site_duzenle" ? <PanelSiteVisualEdit /> : null}
        {tab === "medya" ? <PanelMedia /> : null}
        {tab === "menuler" ? <PanelMenus /> : null}
        {tab === "ayarlar" ? <PanelSettings /> : null}
        {tab === "yedek" ? <PanelBackup /> : null}
      </main>
      <span className="sr-only">{sitePrefix}</span>
    </div>
  );
}
