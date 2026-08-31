# Ayfleks.com — Mevcut Site Durum Raporu

**Tarih:** 31 Ağustos 2026  
**İncelenen adresler:** https://ayfleks.com · https://www.ayfleks.com  
**Amaç:** Yeniden yapım öncesi mevcut durumun envanteri ve SEO eksiklerinin tespiti

---

## 1. Genel Özet

Ayfleks Ambalaj kurumsal web sitesi; gıda, kişisel bakım & hijyen, evcil hayvan bakımı ve endüstriyel ambalaj alanlarında faaliyet gösteren bir B2B ambalaj firmasının tanıtım sitesidir. Site Türkçe (ana) ve İngilizce (`/en/`) olmak üzere iki dilde sunulmaktadır.

**Kritik SEO bulgusu (rapor referansı):** Sitede **hiçbir sayfada schema.org / JSON-LD yapısal veri bulunmamaktadır.** Microdata (itemscope/itemtype) de yoktur. Bu, yeniden yapımda öncelikli olarak giderilmesi gereken maddelerden biridir.

---

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Sunucu / reverse proxy | OpenResty (nginx tabanlı) |
| Backend | **ASP.NET WebForms** (`.aspx`, `__VIEWSTATE`, `ASP.NET_SessionId` cookie) |
| CMS / yönetim | Özel panel (`/vnspanel`, `/vnseditor`, `/yonetim` — robots.txt ile engelli) |
| CSS framework | Bootstrap (yerel `/css/bootstrap.min.css`) |
| JavaScript | jQuery, Owl Carousel, AOS (animasyon), Fancybox, Inputmask |
| İkonlar | Font Awesome Kit (`kit.fontawesome.com`) |
| Görsel format | Ağırlıklı **WebP** (+ SVG ikonlar, favicon PNG/ICO) |
| Harici entegrasyonlar | Google reCAPTCHA, YouTube embed, Google Maps iframe, OneSignal (CSP'de izinli), Facebook / Instagram / LinkedIn / YouTube sosyal linkleri |
| Çerez onayı | Özel banner (Google Analytics için metin var; sayfa kaynağında aktif GA/gtag scripti tespit edilmedi) |
| Güvenlik başlıkları | HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy |

---

## 3. Site Haritası ve Sayfa Envanteri

### 3.1 Ana navigasyon (TR)

| Bölüm | Sayfalar |
|-------|----------|
| **Kurumsal** | `/hakkimizda.aspx`, `/vizyon-misyon.aspx`, `/degerlerimiz.aspx`, `/politikalarimiz.aspx`, `/haberler.aspx` |
| **Ürünler** | `/urunler.aspx`, `/urun-gruplarimiz/gida`, `/urun-gruplarimiz/kisisel-bakim-hijyen`, `/urun-gruplarimiz/evcil-hayvan-bakimi`, `/urun-gruplarimiz/endustriyel` |
| **Sürdürülebilirlik** | `/surdurulebilirlik-yaklasimi.aspx`, `/surdurulebilirlik-hedefleri.aspx` |
| **Faaliyetler** | `/faaliyetler.aspx`, `/teknoloji.aspx`, `/uretim-surecleri.aspx`, `/paketleme.aspx`, `/kalite-kontrol.aspx`, `/test-laboratuvari.aspx`, `/sertifikalar.aspx` |
| **Kalite / İK** | `/insan-kaynaklari-politikasi.aspx`, `/acik-pozisyonlar.aspx`, `/is-basvuru-formu.aspx` |
| **İletişim / yasal** | `/iletisim.aspx`, `/is-etigi-formu.aspx`, `/kvkk.aspx` |
| **Ana sayfa** | `/` ve `/default.aspx` (aynı içerik, iki URL) |

**Toplam statik TR sayfa:** ~26 URL

### 3.2 İngilizce bölüm (`/en/`)

Paralel yapı: `/en/about-us.aspx`, `/en/product-groups/food`, `/en/news.aspx`, `/en/contact-us.aspx`, `/en/gdpr.aspx` vb.

**Toplam statik EN sayfa:** ~24 URL

### 3.3 Ürün detay sayfaları

URL kalıbı (TR):  
`/urunler/{kategoriId}/{slug}/{urunId}/gida.aspx`

Örnek: `/urunler/1001/baharat-ambalajlari/1020/gida.aspx`

Gıda kategorisinde 13 alt ürün; tüm kategorilerde keşfedilen toplam **~52 ürün detay URL'si** (TR + EN).

**Sorun:** Ürün detay sayfalarının `<title>` değeri hepsinde aynı: *"Ürünler | Ayfleks Ambalaj..."* — ürün adı title'da yok.

### 3.4 Haber / blog detay sayfaları

URL kalıbı:  
`/haberler/1/haberler/{id}/{slug}.aspx`

Mevcut haberler (4 adet):
- `/haberler/1/haberler/1002/tema-vakfina-bagis-yaptik.aspx`
- `/haberler/1/haberler/1004/fachpack-2025te-yerimizi-aldik.aspx`
- `/haberler/1/haberler/1005/packaging-innovations-empack-fuarindayiz.aspx`
- `/haberler/1/haberler/1006/interpack-2026-fuarindayiz.aspx`

**Sorun:** Haber detayında `<h1>` haber başlığı değil, genel *"Haberler"* etiketi. Article schema için uygun değil.

### 3.5 Tahmini toplam indexlenebilir URL

| Tür | Adet |
|-----|------|
| TR statik | ~26 |
| EN statik | ~24 |
| Ürün detay (TR+EN) | ~52 |
| Haber detay | 4+ |
| **Toplam (yaklaşık)** | **~106 URL** |

---

## 4. Sitemap ve robots.txt

### robots.txt
- Var: `https://ayfleks.com/robots.txt`
- Admin/yönetim yolları `Disallow` edilmiş (doğru)
- **`Sitemap:` satırı yok**

### sitemap.xml
- URL: `https://ayfleks.com/sitemap.xml`
- HTTP 200 dönüyor ancak **içerik boş** (3 byte — geçersiz/boş XML)
- Arama motorları için fiilen **sitemap yok**

---

## 5. SEO Denetimi — Mevcut Sorunlar

### 5.1 Yapısal veri (schema.org / JSON-LD) — KRİTİK

| Kontrol | Durum |
|---------|-------|
| JSON-LD (`application/ld+json`) | **YOK** (tüm sayfalarda 0) |
| Microdata (itemscope/itemtype) | **YOK** |
| Önerilen schema tipleri (yeni sitede) | `Organization`, `WebSite`, `BreadcrumbList`, `Product`, `Article`, `LocalBusiness` / `ContactPage`, `FAQPage` (varsa) |

### 5.2 Canonical ve URL tutarlılığı — KRİTİK

| Sorun | Detay |
|-------|-------|
| HTTP canonical | Tüm sayfalarda `http://ayfleks.com/...` (HTTPS değil) |
| www / non-www | `ayfleks.com` ve `www.ayfleks.com` **ikisi de 200 OK** — yönlendirme yok, duplicate content |
| `/` vs `/default.aspx` | Aynı içerik, iki URL, canonical sadece `default.aspx`'e işaret ediyor |
| `/en` | HTTPS yerine **`http://ayfleks.com/en/`** adresine düşüyor |
| Haber/ürün URL yapısı | SEO-dostu değil; gereksiz segmentler (`/haberler/1/haberler/`) |

### 5.3 Meta etiketler — YÜKSEK

| Sorun | Detay |
|-------|-------|
| Title şablonu | Tüm sayfalara aynı uzun suffix ekleniyor: *"...Ayfleks Ambalaj. Kişisel bakım ve hijyen ambalajları..."* (~100+ karakter) |
| Meta description | İç sayfalarda çoğunlukla sadece sayfa adı (7–27 karakter); yetersiz |
| Meta keywords | Ana sayfada var; Google tarafından yok sayılıyor, kaldırılabilir |
| Duplicate meta | Ana sayfada title = description = keywords (aynı metin) |
| robots meta | Hiçbir sayfada yok |
| hreflang | **YOK** — TR/EN dil eşlemesi tanımlı değil |
| Open Graph | Ana sayfada **0** OG tag; iç sayfalarda 5 tag var ama URL'ler `http://` |
| Twitter Card | **YOK** |

### 5.4 Başlık hiyerarşisi (H1) — YÜKSEK

| Sayfa | H1 sayısı | Sorun |
|-------|-----------|-------|
| Ana sayfa | **10** | Tek sayfada çoklu H1 (slider + bölümler) |
| Ürün kategori (gıda) | **15** | Her alt ürün H1 olarak işaretlenmiş |
| Haber detay | 2 | Makale başlığı H1 değil; "Haberler" H1 |
| Kurumsal sayfalar | 2 | Genelde kabul edilebilir (sayfa + footer CTA) |

### 5.5 Görseller — ORTA

| Metrik | Ana sayfa | İç sayfa (örnek) |
|--------|-----------|------------------|
| Toplam `<img>` | 29 | 10–36 |
| Alt metni eksik | 24 (%83) | %85–95 |

Görsel klasör yapısı:
- `/images/banner/` — slider görselleri (desktop + mobile varyantları)
- `/images/kategoriler/` — ürün kategori kartları
- `/images/kutular/` — sürdürülebilirlik / ihracat blokları
- `/images/hakkimizda/`, `/images/haberler/`, `/images/sayfalar/`, `/images/icon-*`

Format: WebP (iyi); bazı dosya adları `.webp.720p.webp` gibi çift uzantılı.

### 5.6 Performans ve teknik SEO — ORTA

| Sorun | Detay |
|-------|-------|
| Cache-Control | `no-cache, no-store, must-revalidate` — her istekte yeniden oluşturuluyor |
| ASP.NET ViewState | Ana sayfa HTML ~41 KB; ViewState payload büyük |
| Duplicate viewport meta | `<meta name="viewport">` iki kez tanımlı |
| Referrer-Policy çelişkisi | HTTP header: `no-referrer` · HTML meta: `strict-origin-when-cross-origin` |
| `.aspx` uzantıları | Modern SEO URL'lerinden uzak |

### 5.7 Olumlu bulgular

- `lang="tr"` HTML attribute mevcut
- HSTS aktif (31536000)
- Güçlü CSP ve güvenlik başlıkları
- WebP görsel kullanımı
- Canonical tag var (değerler düzeltilmeli)
- İç sayfalarda temel OG tag seti var (http → https düzeltmesi gerekir)
- robots.txt admin yollarını doğru engelliyor

---

## 6. İçerik Özeti (Ana Sayfa)

Ana mesajlar:
1. **Sürdürülebilirlik** — doğada çözünebilir ürünler
2. **4 ürün segmenti** — Gıda, Kişisel Bakım & Hijyen, Evcil Hayvan, Endüstriyel
3. **Kurumsal** — 1974'ten beri, 300+ çalışan, ABD-Ortadoğu-Afrika pazarı hedefi
4. **İhracat** — ~60 ülkeye ihracat
5. **CTA** — e-posta ile iletişim formu, tanıtım videosu (YouTube embed)

Footer: İş Etiği Formu, KVKK Aydınlatma Metni, sosyal medya linkleri.

---

## 7. Yeniden Yapım İçin Öncelik Matrisi

| Öncelik | Konu | Mevcut | Hedef (yeni site) |
|---------|------|--------|-------------------|
| P0 | JSON-LD / schema.org | Yok | Organization + WebSite (global); sayfa tipine göre Product, Article, BreadcrumbList |
| P0 | HTTPS canonical | http:// | https://www.ayfleks.com veya https://ayfleks.com (tek tercih) |
| P0 | www/non-www birleştirme | Duplicate 200 | 301 redirect tek canonical host'a |
| P0 | Sitemap | Boş dosya | Geçerli XML sitemap + robots.txt Sitemap satırı |
| P1 | hreflang TR/EN | Yok | `<link rel="alternate" hreflang="tr|en|x-default">` |
| P1 | Title / description | Şablon/tekrar | Sayfa bazlı benzersiz, 50–60 / 150–160 karakter |
| P1 | H1 yapısı | Çoklu H1 | Sayfa başına 1 ana H1 |
| P1 | URL yapısı | `.aspx`, ID'li path | Temiz slug URL'ler (/urunler/baharat-ambalajlari) |
| P2 | Alt text | %80+ eksik | Tüm anlamlı görsellere açıklayıcı alt |
| P2 | OG / Twitter Card | Kısmi / http | Tam set, https URL, og:image boyut standardı |
| P2 | Cache / performans | no-store | Statik asset cache + SSR/SSG stratejisi |
| P3 | Meta keywords | Var | Kaldır |
| P3 | Article/Product schema | Yok | Haber ve ürün sayfalarında zengin snippet |

---

## 8. Yeni Sitede Uygulanacak JSON-LD Şablonları (Öneri)

```json
// Global — tüm sayfalarda
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Ayfleks Packaging",
      "url": "https://www.ayfleks.com",
      "logo": "https://www.ayfleks.com/images/ayfleks-logo.svg",
      "foundingDate": "1974",
      "sameAs": [
        "https://www.linkedin.com/company/ayflekspackaging/",
        "https://www.instagram.com/ayfleks/",
        "https://www.youtube.com/@AyfleksPackaging"
      ]
    },
    {
      "@type": "WebSite",
      "url": "https://www.ayfleks.com",
      "name": "Ayfleks Ambalaj",
      "inLanguage": ["tr-TR", "en"]
    }
  ]
}
```

Ürün sayfaları: `@type: Product` · Haberler: `@type: NewsArticle` · İletişim: `@type: ContactPage` · Breadcrumb: `@type: BreadcrumbList`

---

## 9. Sonuç

Mevcut site fonksiyonel bir ASP.NET WebForms kurumsal sitesidir; görsel kalitesi ve güvenlik başlıkları iyidir. Ancak **SEO açısından yapısal veri tamamen eksik**, URL/canonical tutarsızlıkları ciddi, sitemap fiilen yok ve meta/başlık yapısı arama motorları için optimize edilmemiştir.

Yeniden yapımda bu rapordaki P0 maddeleri (özellikle **schema.org/JSON-LD**, **canonical/redirect**, **sitemap**) ilk sprint kapsamına alınmalıdır.

---

*Rapor otomatik teknik tarama ile 31.08.2026 tarihinde oluşturulmuştur.*
