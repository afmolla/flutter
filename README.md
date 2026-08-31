# Ayfleks Ambalaj

Next.js 16 kurumsal site + yönetim paneli. Görünüm ayfleks.com ile uyumlu; içerik `data/ayfleks/` JSON dosyalarından panel ile yönetilir.

## Çalıştırma (local)

```bash
npm install
npm run build
npm run start
# veya geliştirme:
npm run dev
```

- Site: http://localhost:3000
- Panel: http://localhost:3000/panel — şifre `.env.local` → `PANEL_PASSWORD` (varsayılan `demo123`)
- İngilizce: http://localhost:3000/en

## Panelden yönetilenler

| Sekme | Veri |
|-------|------|
| Ana sayfa | `ayfleks-home.json` (slider, hakkında, CTA) |
| Ürünler | `urunler.json` |
| Haberler | `haberler.json` |
| Sayfalar | `sayfalar.json` → `/p/{slug}` |
| Menüler | `menus.json` |
| SEO / Ayarlar | `settings.json` |
| Medya / Lead / Yedek | ilgili store’lar |

## SEO

- JSON-LD Organization + WebSite (+ Product / NewsArticle sayfa bazlı)
- `sitemap.xml`, `robots.txt`
- Sayfa title / description / canonical / Open Graph

## Notlar

- Canlıya henüz geçilmeyecek; git’te tutulur, local test için `npm run start` kullanın (dev’den çok daha hızlı).
- Next.js sol alt “N” göstergesi `devIndicators: false` ile kapalı.
