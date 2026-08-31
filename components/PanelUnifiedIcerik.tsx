"use client";

import { PanelPages } from "@/components/PanelPages";
import type { VfIcerikSnapshot } from "@/lib/panel-deeplink";

/** Ayfleks: şablon vitrin içerikleri yerine CMS sayfa yönetimi */
export function PanelUnifiedIcerik(_props: { snapshot?: VfIcerikSnapshot | null }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Sayfalar</h1>
        <p className="text-sm text-[var(--muted)]">
          Kurumsal sayfalar (`/p/slug`) — panelden ekleyin, düzenleyin, yayınlayın. Ana sayfa için &quot;Ana sayfa&quot; sekmesini kullanın.
        </p>
      </div>
      <PanelPages />
    </div>
  );
}
