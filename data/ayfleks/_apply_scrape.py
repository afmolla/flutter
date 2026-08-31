#!/usr/bin/env python3
"""Merge _seed-scraped.json into sayfalar.json / urunler.json and download gallery images."""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from html import unescape
from pathlib import Path

BASE = "https://ayfleks.com"
ROOT = Path("/workspace")
DATA = ROOT / "data" / "ayfleks"
SEED = DATA / "_seed-scraped.json"
SAYFALAR = DATA / "sayfalar.json"
URUNLER = DATA / "urunler.json"
PUBLIC = ROOT / "public"


def clean_text(s: str | None) -> str:
    if not s:
        return ""
    s = unescape(s)
    s = s.replace("\xa0", " ")
    return re.sub(r"\s+", " ", s).strip()


def intro_from_html(html: str) -> str:
    m = re.search(r'<section class="products-alt">[\s\S]*?<p[^>]*>([\s\S]*?)</p>', html, re.I)
    if not m:
        m = re.search(r"<p[^>]*>([\s\S]*?)</p>", html, re.I)
    if not m:
        return ""
    text = re.sub(r"<[^>]+>", "", m.group(1))
    return clean_text(text)


def to_local_path(url: str) -> str:
    if url.startswith("http"):
        from urllib.parse import urlparse

        path = urlparse(url).path
    else:
        path = url
    if not path.startswith("/"):
        path = "/" + path
    return path


def download_image(url: str) -> str:
    """Download ayfleks.com image to public/ and return local web path."""
    local_path = to_local_path(url)
    dest = PUBLIC / local_path.lstrip("/")
    if dest.exists() and dest.stat().st_size > 100:
        return local_path
    dest.parent.mkdir(parents=True, exist_ok=True)
    full_url = url if url.startswith("http") else BASE + local_path
    for attempt in range(3):
        try:
            req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0 AyfleksSeedBot/1.0"})
            with urllib.request.urlopen(req, timeout=45) as resp:
                dest.write_bytes(resp.read())
            return local_path
        except Exception:
            time.sleep(1.0 * (attempt + 1))
    return local_path


def localize_images_in_list(urls: list[str]) -> list[str]:
    out: list[str] = []
    for url in urls:
        if not url:
            continue
        out.append(download_image(url))
    return out


def merge_products(existing: list[dict], scraped: list[dict], locale: str) -> list[dict]:
    by_key = {(x.get("slug"), x.get("locale") or "tr"): x for x in existing}
    order = [x.get("id") for x in existing]

    for i, sp in enumerate(scraped):
        slug = sp.get("slug")
        if not slug:
            continue
        key = (slug, locale)
        row = by_key.get(key)
        image_src = sp.get("imageSrc") or (row or {}).get("imageSrc", "")
        if image_src:
            image_src = download_image(image_src)

        galeri = localize_images_in_list(sp.get("galeri") or [])

        patch = {
            "slug": slug,
            "kategoriId": sp.get("kategoriId") or (row or {}).get("kategoriId"),
            "baslik": sp.get("baslik") or (row or {}).get("baslik", ""),
            "ozet": sp.get("ozet") or (row or {}).get("ozet", ""),
            "aciklama": sp.get("aciklama") or (row or {}).get("aciklama"),
            "ozellikler": sp.get("ozellikler") or (row or {}).get("ozellikler") or [],
            "sekmeler": sp.get("sekmeler") or (row or {}).get("sekmeler") or [],
            "galeri": galeri or (row or {}).get("galeri") or [],
            "imageSrc": image_src,
            "imageAlt": sp.get("baslik") or (row or {}).get("imageAlt"),
            "locale": locale,
            "guncellenme": "2026-08-31T15:00:00.000Z",
        }

        if row:
            row.update({k: v for k, v in patch.items() if v not in (None, "", []) or k in {"ozellikler", "sekmeler", "galeri"}})
            by_key[key] = row
        else:
            new_id = f"u{'e' if locale == 'en' else ''}{len(by_key)+1:04d}"
            by_key[key] = {
                "id": new_id,
                "varyantlar": [],
                "yayinda": True,
                "stokta": True,
                "sira": i + 1,
                **patch,
            }
            order.append(new_id)

    merged = list(by_key.values())
    merged.sort(key=lambda x: (x.get("locale") or "tr", x.get("sira", 999)))
    return merged


def merge_pages(existing: list[dict], scraped: list[dict], locale: str) -> list[dict]:
    by_slug = {x["slug"]: x for x in existing}
    product_group_slugs = {
        "gida",
        "kisisel-bakim-hijyen",
        "evcil-hayvan-bakimi",
        "endustriyel",
        "en-food",
        "en-personal-care-hygiene",
        "en-pet-care",
        "en-industrial",
    }

    for sp in scraped:
        slug = sp.get("slug")
        if not slug or slug not in product_group_slugs:
            continue
        intro = intro_from_html(sp.get("icerikHtml") or "")
        row = by_slug.get(slug)
        if not row:
            continue
        if intro:
            row["aciklama"] = intro
        if sp.get("icerikHtml"):
            row["icerikHtml"] = sp["icerikHtml"]
        row["locale"] = locale
        row["guncellenme"] = "2026-08-31T15:00:00.000Z"
        by_slug[slug] = row

    return list(by_slug.values())


def main() -> None:
    if not SEED.exists():
        raise SystemExit(f"Missing seed file: {SEED}. Run _scrape_ayfleks.py first.")

    seed = json.loads(SEED.read_text(encoding="utf-8"))
    sayfalar_db = json.loads(SAYFALAR.read_text(encoding="utf-8"))
    urunler_db = json.loads(URUNLER.read_text(encoding="utf-8"))

    sayfalar_db["sayfalar"] = merge_pages(sayfalar_db["sayfalar"], seed["tr"]["pages"], "tr")
    sayfalar_db["sayfalar"] = merge_pages(sayfalar_db["sayfalar"], seed["en"]["pages"], "en")

    all_products = urunler_db["urunler"]
    all_products = merge_products(all_products, seed["tr"]["products"], "tr")
    all_products = merge_products(all_products, seed["en"]["products"], "en")
    urunler_db["urunler"] = all_products

    SAYFALAR.write_text(json.dumps(sayfalar_db, ensure_ascii=False, indent=2), encoding="utf-8")
    URUNLER.write_text(json.dumps(urunler_db, ensure_ascii=False, indent=2), encoding="utf-8")

    tr_with_gallery = sum(1 for p in seed["tr"]["products"] if p.get("galeri"))
    en_with_gallery = sum(1 for p in seed["en"]["products"] if p.get("galeri"))
    print("Applied scrape merge.")
    print(f"Products total: {len(all_products)}")
    print(f"TR products with gallery in seed: {tr_with_gallery}")
    print(f"EN products with gallery in seed: {en_with_gallery}")


if __name__ == "__main__":
    main()
