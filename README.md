# Ayfleks Ambalaj Web Sitesi

Next.js 16 + Molla Yazılım panel altyapısı ile Ayfleks kurumsal site yeniden yapımı.

## Özellikler

- **Public site:** ayfleks.com ile aynı HTML/CSS (`public/css/main.css`)
- **Admin panel:** `/panel` — menüler, SEO, içerik, ürünler, medya, lead'ler
- **SEO:** JSON-LD (Organization + WebSite), sitemap.xml, canonical HTTPS-ready meta
- **CMS sayfalar:** `/p/{slug}` — panelden yönetilen kurumsal sayfalar

## Geliştirme

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Panel: http://localhost:3000/panel (şifre: `demo123` veya `.env.local` içindeki `PANEL_PASSWORD`)

## Veri

JSON dosyaları `data/ayfleks/` altında:

- `settings.json` — SEO, iletişim, sosyal medya
- `menus.json` — header/footer menüler
- `ayfleks-home.json` — ana sayfa slider ve bölümler
- `sayfalar.json` — CMS sayfalar
- `urunler.json` — ürün kataloğu

## Dokümantasyon

- `ayfleks-mevcut-site-raporu.md` — mevcut site SEO audit
- `ayfleks-tasarim-referans-notlari.md` — pixel-perfect tasarım rehberi
