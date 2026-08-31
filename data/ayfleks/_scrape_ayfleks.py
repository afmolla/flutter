#!/usr/bin/env python3
"""Scrape ayfleks.com TR/EN content into seed JSON."""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from html import unescape
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

BASE = "https://ayfleks.com"
UA = "Mozilla/5.0 (compatible; AyfleksSeedBot/1.0; +https://ayfleks.com)"
OUT = Path("/workspace/data/ayfleks/_seed-scraped.json")

TR_PAGES = [
    "/hakkimizda.aspx",
    "/vizyon-misyon.aspx",
    "/degerlerimiz.aspx",
    "/politikalarimiz.aspx",
    "/haberler.aspx",
    "/urunler.aspx",
    "/urun-gruplarimiz/gida",
    "/urun-gruplarimiz/kisisel-bakim-hijyen",
    "/urun-gruplarimiz/evcil-hayvan-bakimi",
    "/urun-gruplarimiz/endustriyel",
    "/surdurulebilirlik-yaklasimi.aspx",
    "/surdurulebilirlik-hedefleri.aspx",
    "/faaliyetler.aspx",
    "/teknoloji.aspx",
    "/uretim-surecleri.aspx",
    "/paketleme.aspx",
    "/kalite-kontrol.aspx",
    "/test-laboratuvari.aspx",
    "/sertifikalar.aspx",
    "/insan-kaynaklari-politikasi.aspx",
    "/acik-pozisyonlar.aspx",
    "/is-basvuru-formu.aspx",
    "/is-etigi-formu.aspx",
    "/iletisim.aspx",
    "/kvkk.aspx",
]

EN_PAGES = [
    "/en/about-us.aspx",
    "/en/vision-mission.aspx",
    "/en/our-values.aspx",
    "/en/our-policies.aspx",
    "/en/news.aspx",
    "/en/product-groups/food",
    "/en/product-groups/personal-care-hygiene",
    "/en/product-groups/pet-care",
    "/en/product-groups/industrial",
    "/en/our-approach-to-sustainability.aspx",
    "/en/sustainability-goals.aspx",
    "/en/activities.aspx",
    "/en/technology.aspx",
    "/en/production-processes.aspx",
    "/en/packaging.aspx",
    "/en/quality-control.aspx",
    "/en/test-laboratory.aspx",
    "/en/certificates.aspx",
    "/en/human-resources-policy.aspx",
    "/en/open-positions.aspx",
    "/en/job-application-form.aspx",
    "/en/contact-us.aspx",
    "/en/gdpr.aspx",
]

# Category listing path -> kategoriId
TR_CATEGORIES = {
    "/urun-gruplarimiz/gida": "gida",
    "/urun-gruplarimiz/kisisel-bakim-hijyen": "kisisel-bakim",
    "/urun-gruplarimiz/evcil-hayvan-bakimi": "evcil-hayvan",
    "/urun-gruplarimiz/endustriyel": "endustriyel",
}

EN_CATEGORIES = {
    "/en/product-groups/food": "gida",
    "/en/product-groups/personal-care-hygiene": "kisisel-bakim",
    "/en/product-groups/pet-care": "evcil-hayvan",
    "/en/product-groups/industrial": "endustriyel",
}


def fetch(path: str, retries: int = 3) -> str:
    url = urljoin(BASE, path)
    last_err: Exception | None = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
            with urllib.request.urlopen(req, timeout=45) as resp:
                raw = resp.read()
                charset = resp.headers.get_content_charset() or "utf-8"
                return raw.decode(charset, errors="replace")
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"Failed to fetch {url}: {last_err}")


def slug_from_path(path: str) -> str:
    p = path.split("?")[0].rstrip("/")
    name = p.split("/")[-1]
    if name.endswith(".aspx"):
        name = name[: -len(".aspx")]
    # EN product groups keep last segment; TR same
    if not name:
        name = p.strip("/").replace("/", "-")
    return name


def clean_text(s: str | None) -> str:
    if not s:
        return ""
    s = unescape(s)
    s = s.replace("\xa0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def abs_img(src: str | None) -> str:
    if not src:
        return ""
    src = src.strip()
    if src.startswith("//"):
        return "https:" + src
    if src.startswith("http"):
        return src
    if not src.startswith("/"):
        src = "/" + src
    return BASE + src


def remove_noise(root: Tag) -> None:
    for tag in root.find_all(["script", "style", "noscript"]):
        tag.decompose()
    for c in root.find_all(string=lambda t: isinstance(t, Comment)):
        c.extract()
    # Remove contact CTA / footer-like blocks if nested
    for sel in ["#main-iletisim", "section.footer-alt", "footer", ".footer-alt"]:
        for el in root.select(sel):
            el.decompose()


def serialize_content(el: Tag | None) -> str:
    if el is None:
        return ""
    clone = BeautifulSoup(str(el), "html.parser")
    root = clone.body.contents[0] if clone.body and clone.body.contents else clone
    if isinstance(root, NavigableString):
        return clean_text(str(root))
    remove_noise(root)  # type: ignore[arg-type]
    # Unwrap outer section/container wrappers for cleaner HTML — keep children
    html = "".join(str(c) for c in root.children) if root.name in {"section", "div"} else str(root)
    # Normalize whitespace between tags lightly
    html = re.sub(r"\n\s*\n+", "\n", html)
    return html.strip()


def meta_desc(soup: BeautifulSoup) -> str:
    m = soup.find("meta", attrs={"name": "description"})
    if m and m.get("content"):
        return clean_text(m["content"])
    og = soup.find("meta", attrs={"property": "og:description"})
    if og and og.get("content"):
        return clean_text(og["content"])
    return ""


def page_title_tag(soup: BeautifulSoup) -> str:
    if soup.title:
        t = clean_text(soup.title.get_text())
        # Strip site suffix
        t = re.split(r"\s*\|\s*Ayfleks", t, maxsplit=1)[0].strip()
        return t
    return ""


def banner_h1(soup: BeautifulSoup) -> str:
    h = soup.select_one("h1.banner-title")
    if h:
        return clean_text(h.get_text())
    return ""


def extract_page_content(soup: BeautifulSoup) -> str:
    # Prefer inside-text sections (may be nested — take outermost unique text)
    insides = soup.select("section.inside-text")
    if insides:
        # Use outermost: first that isn't nested inside another inside-text for content
        # Collect unique HTML from deepest meaningful containers
        parts: list[str] = []
        seen = set()
        for sec in insides:
            # Skip if parent is also inside-text (avoid duplicate nesting)
            parent = sec.find_parent("section", class_="inside-text")
            if parent:
                continue
            html = serialize_content(sec)
            key = clean_text(BeautifulSoup(html, "html.parser").get_text())[:200]
            if key and key not in seen:
                seen.add(key)
                parts.append(html)
        if parts:
            return "\n".join(parts)

    # Product listing cards area
    prod_list = soup.select_one("section.products") or soup.select_one(".product-list")
    if prod_list:
        return serialize_content(prod_list)

    # News listing
    news = soup.select_one(".news-page") or soup.select_one("section.news")
    if news:
        return serialize_content(news)

    # Form pages
    form = soup.select_one("section.form-section") or soup.select_one(".basvuru-form") or soup.select_one("#aspnetForm .container form")
    # Fall back: content between header and #main-iletisim / footer
    header = soup.select_one("header.site-header-inside") or soup.find("header")
    contact = soup.select_one("#main-iletisim")
    footer = soup.find("footer") or soup.select_one("section.footer-alt")
    start = header
    end = contact or footer
    if start and end:
        chunks = []
        for sib in start.next_siblings:
            if sib is end or (isinstance(sib, Tag) and (sib is end or end in sib.descendants)):
                break
            if isinstance(sib, Tag):
                if sib.name in {"script"}:
                    continue
                if sib.get("id") == "main-iletisim":
                    break
                if "footer" in " ".join(sib.get("class") or []):
                    break
                chunks.append(sib)
        if chunks:
            wrapper = BeautifulSoup("<div></div>", "html.parser").div
            for c in chunks:
                wrapper.append(BeautifulSoup(str(c), "html.parser"))
            html = serialize_content(wrapper)
            text = clean_text(BeautifulSoup(html, "html.parser").get_text())
            if len(text) > 40:
                return html

    # Last resort: all paragraphs in main containers after breadcrumb/menu
    containers = soup.select(".container")
    best = ""
    best_len = 0
    for c in containers:
        if c.find_parent("header") or c.find_parent("footer") or c.find_parent("#main-iletisim"):
            continue
        if c.select_one(".icerik-menu") and len(clean_text(c.get_text())) < 200:
            continue
        html = serialize_content(c)
        n = len(clean_text(BeautifulSoup(html, "html.parser").get_text()))
        if n > best_len:
            best_len = n
            best = html
    return best


def parse_page(path: str, html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    baslik = banner_h1(soup) or page_title_tag(soup)
    aciklama = meta_desc(soup)
    # Prefer richer description from first meaningful paragraph if meta is too short/generic
    icerik = extract_page_content(soup)
    return {
        "slug": slug_from_path(path),
        "baslik": baslik,
        "aciklama": aciklama,
        "icerikHtml": icerik,
        "_sourcePath": path,
    }


def product_links_from_category(html: str, lang: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    links: list[str] = []
    seen = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if lang == "tr":
            if re.search(r"/urunler/\d+/[^/]+/\d+/[^/]+\.aspx", href):
                pass
            else:
                continue
        else:
            if re.search(r"/en/products/\d+/[^/]+/\d+/[^/]+\.aspx", href):
                pass
            else:
                continue
        # normalize
        if href.startswith("http"):
            href = urlparse(href).path
        if not href.startswith("/"):
            href = "/" + href
        if href not in seen:
            seen.add(href)
            links.append(href)
    return links


def parse_product(path: str, html: str, kategori_id: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    section = soup.select_one("section.product-details")
    baslik = ""
    ozet = ""
    aciklama = ""
    image_src = ""

    if section:
        h1 = section.find("h1")
        baslik = clean_text(h1.get_text()) if h1 else ""
        paras = section.find_all("p")
        texts = [clean_text(p.get_text()) for p in paras if clean_text(p.get_text())]
        if texts:
            ozet = texts[0]
            aciklama = "\n\n".join(texts)
        img = section.select_one("img.pdt-main-img") or section.select_one(".pdt-prod img") or section.select_one("img.img-fluid")
        # Prefer urunler images
        for im in section.find_all("img"):
            src = im.get("src") or ""
            if "/images/urunler/" in src or "/images/products/" in src:
                if "main" in src or not image_src:
                    image_src = abs_img(src)
        if not image_src and img:
            image_src = abs_img(img.get("src"))
    if not baslik:
        baslik = banner_h1(soup) or page_title_tag(soup)

    # slug from product URL segment before id
    # e.g. /urunler/1001/sekerleme-urunleri-ambalajlari/1003/gida.aspx
    parts = path.strip("/").split("/")
    slug = ""
    for i, part in enumerate(parts):
        if part in {"urunler", "products"} and i + 2 < len(parts):
            slug = parts[i + 2]
            break
    if not slug:
        slug = slug_from_path(path)

    return {
        "slug": slug,
        "kategoriId": kategori_id,
        "baslik": baslik,
        "ozet": ozet,
        "aciklama": aciklama,
        "imageSrc": image_src,
        "_sourcePath": path,
    }


def news_links_from_listing(html: str, lang: str) -> list[tuple[str, str]]:
    """Return list of (href, image hint)."""
    soup = BeautifulSoup(html, "html.parser")
    results: list[tuple[str, str]] = []
    seen = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if lang == "tr":
            ok = bool(re.search(r"/haberler/\d+/haberler/\d+/[^/]+\.aspx", href))
        else:
            ok = bool(re.search(r"/en/news/\d+/news/\d+/[^/]+\.aspx", href))
        if not ok:
            continue
        if href.startswith("http"):
            href = urlparse(href).path
        if not href.startswith("/"):
            href = "/" + href
        if href in seen:
            continue
        seen.add(href)
        # try sibling/parent image
        img_src = ""
        parent = a.find_parent(["div", "article", "li", "section"])
        if parent:
            im = parent.find("img")
            if im and im.get("src") and ("haber" in im["src"] or "news" in im["src"]):
                img_src = abs_img(im["src"])
        results.append((href, img_src))
    return results


def parse_news(path: str, html: str, listing_image: str = "") -> dict:
    soup = BeautifulSoup(html, "html.parser")
    news = soup.select_one(".news-page") or soup.select_one("div.container.news-page")
    baslik = ""
    aciklama = meta_desc(soup)
    image_src = listing_image
    icerik_html = ""

    if news:
        h3 = news.find("h3")
        baslik = clean_text(h3.get_text()) if h3 else ""
        for im in news.find_all("img"):
            src = im.get("src") or ""
            if "/images/haberler/" in src or "/images/news/" in src or src.endswith((".webp", ".jpg", ".png")):
                if "icon" not in src and "logo" not in src:
                    image_src = abs_img(src)
                    break
        # content: paragraphs under col-md-6 that has h3
        content_col = h3.find_parent("div") if h3 else None
        if content_col:
            # Build HTML from paragraphs excluding date-only first meta line if desired — keep all
            parts = []
            for child in content_col.children:
                if isinstance(child, Tag) and child.name == "h3":
                    continue
                if isinstance(child, Tag):
                    parts.append(str(child))
            icerik_html = "\n".join(parts).strip()
        else:
            icerik_html = serialize_content(news)
    if not baslik:
        baslik = page_title_tag(soup) or banner_h1(soup)

    # slug from last path segment
    slug = slug_from_path(path)

    # If aciklama is generic ("Haberler"/"News"), use first paragraph
    if aciklama.lower() in {"haberler", "news", ""} or len(aciklama) < 20:
        first_p = BeautifulSoup(icerik_html, "html.parser").find("p")
        if first_p:
            aciklama = clean_text(first_p.get_text())[:300]

    return {
        "slug": slug,
        "baslik": baslik,
        "aciklama": aciklama,
        "icerikHtml": icerik_html,
        "imageSrc": image_src,
        "_sourcePath": path,
    }


def strip_internal(obj: dict) -> dict:
    return {k: v for k, v in obj.items() if not k.startswith("_")}


def scrape_locale(lang: str) -> dict:
    pages_paths = TR_PAGES if lang == "tr" else EN_PAGES
    categories = TR_CATEGORIES if lang == "tr" else EN_CATEGORIES
    news_path = "/haberler.aspx" if lang == "tr" else "/en/news.aspx"

    pages: list[dict] = []
    products: list[dict] = []
    news: list[dict] = []
    html_cache: dict[str, str] = {}

    print(f"[{lang}] Fetching {len(pages_paths)} pages...")
    for path in pages_paths:
        print(f"  page {path}")
        try:
            html = fetch(path)
            html_cache[path] = html
            if "404 - File or directory" in html or "Server Error" in html[:500]:
                print(f"    WARN: 404/error for {path}")
                pages.append(
                    {
                        "slug": slug_from_path(path),
                        "baslik": "",
                        "aciklama": "",
                        "icerikHtml": "",
                        "_sourcePath": path,
                        "_error": "404",
                    }
                )
                continue
            pages.append(parse_page(path, html))
        except Exception as e:  # noqa: BLE001
            print(f"    ERROR: {e}")
            pages.append(
                {
                    "slug": slug_from_path(path),
                    "baslik": "",
                    "aciklama": "",
                    "icerikHtml": "",
                    "_sourcePath": path,
                    "_error": str(e),
                }
            )
        time.sleep(0.25)

    # Products from categories
    print(f"[{lang}] Scraping products...")
    seen_products = set()
    for cat_path, kat_id in categories.items():
        html = html_cache.get(cat_path) or fetch(cat_path)
        html_cache[cat_path] = html
        links = product_links_from_category(html, lang)
        print(f"  category {kat_id}: {len(links)} products")
        for link in links:
            if link in seen_products:
                continue
            seen_products.add(link)
            print(f"    product {link}")
            try:
                ph = fetch(link)
                products.append(parse_product(link, ph, kat_id))
            except Exception as e:  # noqa: BLE001
                print(f"      ERROR: {e}")
            time.sleep(0.2)

    # News details
    print(f"[{lang}] Scraping news...")
    news_html = html_cache.get(news_path) or fetch(news_path)
    for link, img_hint in news_links_from_listing(news_html, lang):
        print(f"  news {link}")
        try:
            nh = fetch(link)
            news.append(parse_news(link, nh, img_hint))
        except Exception as e:  # noqa: BLE001
            print(f"    ERROR: {e}")
        time.sleep(0.2)

    return {
        "pages": [strip_internal(p) for p in pages],
        "products": [strip_internal(p) for p in products],
        "news": [strip_internal(n) for n in news],
        "_meta": {
            "pageCount": len(pages),
            "productCount": len(products),
            "newsCount": len(news),
            "errors": [p.get("_sourcePath") for p in pages if p.get("_error")],
        },
    }


def main() -> None:
    result = {
        "tr": scrape_locale("tr"),
        "en": scrape_locale("en"),
    }
    # Drop _meta from output locales but print counts
    meta = {
        "tr": result["tr"].pop("_meta", {}),
        "en": result["en"].pop("_meta", {}),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print("\n=== DONE ===")
    print(f"Wrote {OUT}")
    print("TR:", meta["tr"])
    print("EN:", meta["en"])


if __name__ == "__main__":
    main()
