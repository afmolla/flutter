"use client";

export type PanelContentTab = "home" | "hizmetler" | "galeri" | "iletisim" | "qr_menu" | "randevu";

/** Eski vitrin şablon editörü — Ayfleks’te kullanılmıyor */
export function PanelContent(_props: { tab?: PanelContentTab }) {
  return (
    <p className="text-sm text-[var(--muted)]">
      Bu şablon editörü Ayfleks için kapalı. Ana sayfa ve Sayfalar sekmelerini kullanın.
    </p>
  );
}
