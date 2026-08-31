# Ayfleks.com — Tasarım Referans Notları (Pixel-Perfect Yeniden Yapım)

**Tarih:** 31 Ağustos 2026  
**Amaç:** Mevcut sitenin görsel/HTML yapısını birebir koruyarak yeniden inşa etmek

---

## En Uygun Yol — Özet Karar

| Seçenek | Uygun mu? | Neden |
|---------|-----------|-------|
| Hazır tema satın al / indir | **Hayır** | Site Venus Agency tarafından özel ASP.NET WebForms olarak yazılmış; ThemeForest vb. bir tema değil |
| Mevcut CSS + görselleri mirror et, HTML'i yeniden yaz | **Evet — önerilen** | Görsel birebir kalır, SEO/modern stack'e geçiş mümkün |
| Sadece ekran görüntüsü / Figma tahmini | **Hayır** | Responsive breakpoint'ler, mega menü, slider davranışları kaçırılır |
| `main.css`'i olduğu gibi taşı + component HTML'i kopyala | **Evet — hızlı başlangıç** | İlk sprint'te en hızlı pixel-match yöntemi |

### Önerilen workflow (3 aşama)

1. **Asset mirror:** `/css/main.css` + `/images/**` + favicon → projeye kopyala  
2. **Component envanteri:** Aşağıdaki HTML iskeletlerini React/Next/Astro component'lerine böl  
3. **Design token'a geçiş (opsiyonel):** İlk iterasyonda aynı class isimleri; sonra Tailwind/CSS variables'a migrate

> İlk hedef: **görüntü aynı, altyapı yeni**. SEO (JSON-LD, sitemap, canonical) yeni stack'te sıfırdan doğru kurulur.

---

## 1. Tasarım Kimliği (Design Tokens)

### Renk paleti

| Token | Hex | Kullanım |
|-------|-----|----------|
| `--color-primary-green` | `#39B54A` / `#3ab54b` / `#3ab54c` | CTA butonlar, aktif menü, slider dot active, vurgu h2 |
| `--color-dark-green` | `#024B3D` | Footer arka plan, sürdürülebilirlik bloğu, link hover |
| `--color-accent-lime` | `#ACFF3B` | Slider alt slogan (h2) |
| `--color-blue` | `#1E5193` / `#1C3C6D` | Haber linkleri, owl nav |
| `--color-red` | `#AF2C36` / `#D3101F` | (Az kullanım — hata/uyarı tonları) |
| `--color-text-primary` | `#000000` | Başlıklar |
| `--color-text-body` | `#60666B` | Paragraflar (`p`) |
| `--color-text-muted` | `#818181` / `#575756` | Footer-alt, form label |
| `--color-text-nav` | `#656868` | İç sayfa sub-nav |
| `--color-bg-light` | `#F4F4F4` | Footer-alt section |
| `--color-white` | `#FFFFFF` | Metin / kart |

### Tipografi

| Rol | Font | Ağırlık / Boyut |
|-----|------|-----------------|
| Body | **Outfit** (Google Fonts) | 400–600, 14–18px |
| Slider h1 | Outfit | 72px desktop, `#fff`, weight 600 |
| Slider h2 (slogan) | Outfit | 58px, `#ACFF3B`, weight 200 + `banner-slogan-bottom.svg` underline |
| Dekoratif slogan | **Gloria Hallelujah** | 58px, `#3ab54b` (`.green-foot`) |
| İç sayfa breadcrumb h3 | **Montserrat** | 36px bold, beyaz |
| Section h1 | Outfit | 38–64px, `#37393B` veya `#000` |
| Section h2 (yeşil) | Outfit | 24px, `#3ab54c` |
| Footer h3 | Outfit | 16px, `#fff`, weight 600 |

```html
<!-- Font import (mevcut sitedeki gibi) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
```

### Arka plan dokuları

- `body`: `url(/images/ayfleks-lines.png)` — repeat-y, contain
- Footer: `url(/images/footer-map-back.png)` — sağ taraf
- Footer-alt: `url(/images/footer-back-ayfleks.webp)` — sağ %60
- Slider overlay: `.shadow` → linear-gradient siyah %10→%60

---

## 2. Breakpoint Sistemi

`main.css` **8 ayrı media query** ile yazılmış (mobile-first değil, desktop-first):

| Breakpoint | Aralık |
|------------|--------|
| XL+ | min 1921px |
| XL | 1601–1920px |
| LG | 1441–1600px |
| MD-L | 1281–1440px |
| MD | 1025–1280px |
| Tablet | 768–1024px |
| Mobile-L | 481–767px |
| Mobile | max 480px |

> Yeniden yapımda: aynı breakpoint'leri koru veya Tailwind `screens` config'e map et.

---

## 3. Sayfa Şablonları

### 3.1 Ana sayfa (`/`) — Section sırası

```
header.site-header (absolute, transparent)
  └── .header-content
      ├── .navbar-brand → ayfleks-logo-w.svg
      ├── .hamburger-nav (mobil)
      ├── .languages-menu → TR | EN
      └── nav.header-menu → mega-menu dropdown'lar

section.owl-manset
  └── #slider-manset.owl-carousel
      └── .item → .shadow + .owl-manset-text (h1+h2) + banner.webp

section.about-us
  └── .about-title (h1: Ayfleks, h2: Hakkında)
  └── col-md-7: YouTube fancybox thumbnail
  └── col-md-5: metin + ok ikonu

section.comp-ayfleks
  └── h1: Ürünler / h2: neler sunuyoruz?
  └── 4x .col-md-3.nh-col → kategori kartı + arrow-g ikon

section.main-fleks
  └── .main-fleks-t → sürdürülebilirlik metin bloğu
  └── .main-fleks-s1 → tam genişlik görsel
  └── .main-fleks-t2 (#024B3D bg) → ihracat rotası + 3 col metin + görsel

section#main-iletisim
  └── e-posta CTA kutusu (.main-email-box)

section.footer-alt (#F4F4F4)
  └── logo + footer-mul linkler + sosyal ikonlar + copyright

footer.footer (#024B3D)
  └── 4 kolon menü (Kurumsal, Ürünler, Üretim, Kalite...)
  └── KVKK / İş Etiği linkleri

.wrapper-tkpn → cookie consent banner
```

### 3.2 İç sayfa şablonu (kurumsal, ürün, haber vb.)

```
header.site-header-inside (sticky benzeri, logo 78px)

.header-gorsel / .header-manset
  └── tam genişlik hero görsel (.webp)
  └── .icerik-breadcrumb (absolute, bottom)
      └── ul: Anasayfa > Bölüm > Sayfa
      └── h1.banner-title

.icerik-menu (horizontal sub-nav, border-bottom)
  └── li.selected → yeşil alt çizgi (#3ab54c, 4px)

.content-page / .inside-text
  └── col-md-10 metin + col-md-5 görsel (sayfaya göre değişir)

footer (aynı)
```

### 3.3 Ürün kategori sayfası (`/urun-gruplarimiz/gida`)

- Hero: `urun-main-gida.webp` + breadcrumb
- Sub-nav: kategori sekmeleri
- Grid: ürün kartları → `/urunler/.../gida.aspx`
- Her kart: görsel + başlık + `.arrow-g`

---

## 4. Bileşen Kataloğu

### Header / Mega Menu

- `.site-header` — `position: absolute`, `padding-top: 18px`, full width
- `.brand-line` — dekoratif çizgi, width 80%
- `.mega-menu` hover → `.mega-menu-content` açılır
- Mega menu içinde Bootstrap `#v-pills-tab` + tab-pane yapısı (Kurumsal / Ürünler / Sürdürülebilirlik / Üretim / Kalite / İK)
- Dil seçici: `.top-lang`, `.languages-menu` → `/en`

### Hero Slider (Owl Carousel)

- Kütüphane: **Owl Carousel 2** (`owl.carousel.min.css/js`)
- Container: `.owl-manset` → `.owl-manset-images.owl-carousel`
- Dot'lar: 38×6px pill, active `#3ab54b`
- Metin overlay: `.owl-manset-text` — left 15%, top 50%
- Görsel üstü: `.shadow` gradient overlay

### Butonlar

```css
.btn-green {
  background: #39B54A;
  border-radius: 28px;
  width: 168px;
  padding: 14px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
}
/* ::before pseudo → button-arrow-up-white.svg */
```

### Kategori kartı (`.nh-col`)

- 4 kolon (`col-md-3`)
- Görsel + `h3` + yeşil ok SVG (`.arrow-g`)
- Hover: link rengi `#024B3D`

### Footer

- **Üst blok** (`.footer-alt`, `#F4F4F4`): logo + yatay menü (`.footer-mul`) + sosyal
- **Alt blok** (`.footer`, `#024B3D`): 4 kolon link listesi + harita arka plan
- Sosyal ikonlar: Font Awesome Brands (`fa-facebook`, `fa-instagram`, `fa-linkedin`, `fa-youtube`)
- KVKK satırı: `.footer-menu-kvkk`

### Cookie banner (`.wrapper-tkpn`)

- Metin + Kabul Et / Reddet
- Google Analytics onayı (script lazy load edilebilir)

### Form elemanları

- `.form-control` — border `#e6e6e6`, radius 5px
- `.form-floating` — Bootstrap floating label
- `.contact-page` — merkez h1/h2/h3 layout
- Telefon mask: Inputmask `(+99)-999-999-9999`

---

## 5. JS Bağımlılıkları (Davranış için gerekli)

| Kütüphane | Dosya | Ne için |
|-----------|-------|---------|
| jQuery | `/js/jquery.min.js` | DOM, carousel, fancybox |
| Bootstrap 5 JS | `/js/bootstrap.min.js` | Mega menu tab, collapse, grid |
| Owl Carousel | `/js/owl.carousel.min.js` | Ana slider, haber slider |
| AOS | `/js/aos.js` | Scroll animasyonları |
| Fancybox | `/js/jquery.fancybox.min.js` | YouTube video lightbox |
| Inputmask | `/js/jquery.inputmask.bundle.min.js` | Form telefon/email |
| Font Awesome Kit | `kit.fontawesome.com/c384e56078.js` | İkonlar |
| main.js | `/js/main.js` | Timeline, preloader, cookie, custom |

> Modern rebuild'de: Owl → Swiper/Embla, jQuery → vanilla/React, AOS → Framer Motion veya CSS — ama **ilk sprint'te aynı kütüphanelerle** gitmek pixel-match'i hızlandırır.

---

## 6. CSS Dosyaları

| Dosya | Boyut | Not |
|-------|-------|-----|
| `/css/main.css` | ~260 KB | **Ana stil — Venus Agency custom**, 8 breakpoint tekrarı var |
| `/css/bootstrap.min.css` | — | Grid + utilities |
| `/css/owl.carousel.min.css` | — | Slider |
| `/css/owl.theme.default.min.css` | — | Slider theme |
| `/css/aos.css` | — | Animasyon |
| `/css/jquery.fancybox.min.css` | — | Lightbox |

---

## 7. Kritik Görsel Varlıklar (Mirror Listesi)

### Logo & ikonlar
- `/images/ayfleks-logo.svg` (footer)
- `/images/ayfleks-logo-w.svg` (header — beyaz versiyon)
- `/images/ayfleks-amblem.svg`
- `/images/icon-arrow-up-green.svg`
- `/images/button-arrow-up-white.svg`
- `/images/icon-phone-green.svg`, `icon-mail-green.svg`, `icon-location-green.svg` (+ white varyantları)

### Arka plan & dekor
- `/images/ayfleks-lines.png` (body texture)
- `/images/banner-slogan-bottom.svg` (slider h2 alt çizgi)
- `/images/slogan-foot.svg` (green-foot dekor)
- `/images/footer-map-back.png`
- `/images/footer-back-ayfleks.webp`

### Banner slider (desktop)
- `/images/banner/ayfleks-manset-banner_6f10c.webp` (sürdürülebilirlik)
- `/images/banner/interpack-banner_f8ebd.webp`
- `/images/banner/ayfleks-manset-banner-02_48220.webp` (gıda)
- `/images/banner/ayfleks-manset-banner-03_1ffa4.webp` (kişisel bakım)
- `/images/banner/ayfleks-manset-banner-04_a3bb2.webp` (evcil hayvan)
- `/images/banner/ayfleks-manset-banner-05_1782d.webp` (endüstriyel)
- `/images/banner/ayfleks-mobile-banner_*.webp` (mobil varyantlar — ayrı set)

### Kategori & içerik
- `/images/kategoriler/gida_8dd8e.webp.720p.webp`
- `/images/kategoriler/kategori-kisisel-bakim_193da.webp.720p.webp`
- `/images/kategoriler/kategori-evcil-hayvan_15dfd.webp.720p.webp`
- `/images/kategoriler/kategori-endustriyel_06739.webp.720p.webp`
- `/images/kutular/ayfleks-main-surdurulebilirlik_b8322.webp`
- `/images/kutular/main-ihracat-rota_af25b.webp`
- `/images/hakkimizda/ayfleks-tanitim-filmi-cover_c3469.webp`
- `/images/sayfalar/ayfleks-kurumsal_345d0.webp` (iç sayfa hero örneği)

### Toplu indirme komutu (referans)

```bash
# Proje kökünde çalıştır — css + images mirror
mkdir -p public/css public/js public/images
curl -sL "https://ayfleks.com/css/main.css" -o public/css/main.css
curl -sL "https://ayfleks.com/css/bootstrap.min.css" -o public/css/bootstrap.min.css
# ... diğer css/js dosyaları
wget -r -np -nH --cut-dirs=1 -P public/images "https://ayfleks.com/images/"
```

---

## 8. HTML İskelet Örnekleri (Kopyala-Yapıştır Referans)

### Slider item

```html
<section class="owl-manset">
  <div class="owl-container">
    <div id="slider-manset" class="owl-manset-images owl-carousel owl-theme">
      <a href="/surdurulebilirlik-yaklasimi">
        <div class="item">
          <div class="shadow"></div>
          <div class="owl-manset-text">
            <h1>Doğada çözünebilir ürünlerle</h1>
            <h2>sürdürülebilir bir dünya.</h2>
          </div>
          <img src="/images/banner/ayfleks-manset-banner_6f10c.webp" alt="Sürdürülebilir ambalaj">
        </div>
      </a>
    </div>
  </div>
</section>
```

### Kategori kartı

```html
<div class="col-md-3 nh-col">
  <a href="/urun-gruplarimiz/gida">
    <img src="/images/kategoriler/gida_8dd8e.webp.720p.webp" alt="Gıda ambalajları">
    <h3>Gıda</h3>
    <img src="/images/icon-arrow-up-green.svg" class="arrow-g" alt="">
  </a>
</div>
```

### İç sayfa breadcrumb hero

```html
<div class="icerik-breadcrumb">
  <ul>
    <li><a href="/">Anasayfa</a></li>
    <li><a href="#">Kurumsal</a></li>
    <li><a href="/hakkimizda">Hakkımızda</a></li>
  </ul>
</div>
<h1 class="banner-title">Hakkımızda</h1>
```

---

## 9. Yeniden Yapım Sprint Planı (Tasarım)

| Sprint | İş | Çıktı |
|--------|-----|-------|
| 1 | Asset mirror + Layout shell (Header/Footer) | Header/footer pixel-match |
| 2 | Ana sayfa 5 section | `/` birebir görünüm |
| 3 | İç sayfa template + breadcrumb hero | Kurumsal sayfalar |
| 4 | Ürün kategori + detay grid | Ürün sayfaları |
| 5 | Haber listesi + detay | `/haberler` |
| 6 | Form sayfaları + cookie banner | İletişim, İK formları |
| 7 | EN locale (/en) | Aynı layout, İngilizce içerik |
| 8 | Responsive QA — 8 breakpoint | Mobil/tablet fix |

---

## 10. Dikkat Edilecekler

1. **Header logo:** Ana sayfada `ayfleks-logo-w.svg` (beyaz), footer'da `ayfleks-logo.svg` (renkli)
2. **H1 kullanımı:** Mevcut sitede çok H1 var — görsel aynı kalacaksa HTML'de de koru; SEO için yeni sitede CSS görünümünü `h2`/`p` ile de eşleştirebilirsin (visually same, semantically fixed)
3. **Bootstrap gutter:** `.row` ve `.container-fluid` → `--bs-gutter-x: 0px` override edilmiş
4. **Mobil banner:** Desktop ve mobile için ayrı banner setleri var — slider'da responsive switch kontrol et
5. **Fancybox YouTube:** `data-fancybox data-type="iframe"` + grayscale filter breadcrumb video'da
6. **Preloader:** `.preloader-position` — main.js'de 800ms fadeOut

---

## 11. Sonuç

**Tema indirmek yerine asset mirror + component rebuild** en doğru yol. Mevcut `main.css` (~260KB) ve `/images/**` klasörü projenin `public/` dizinine alınır; HTML section'ları component'lere bölünür. İlk iterasyonda aynı class isimleri korunarak pixel-perfect sonuç alınır; SEO düzeltmeleri (JSON-LD, canonical, tek H1) ikinci iterasyonda yapılır.

İlgili rapor: `ayfleks-mevcut-site-raporu.md`
