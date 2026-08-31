"use client";

export function PanelSiteVisualEdit() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-xl font-semibold">Site düzenle</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Ayfleks sitesinde görsel düzenleme yerine paneli kullanın:
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
        <li>
          <strong>Ana sayfa</strong> — slider ve bölüm metinleri
        </li>
        <li>
          <strong>Sayfalar</strong> — kurumsal CMS sayfalar
        </li>
        <li>
          <strong>Ürünler / Haberler</strong> — katalog ve duyurular
        </li>
        <li>
          <strong>Menüler / SEO / Medya</strong>
        </li>
      </ul>
    </div>
  );
}
