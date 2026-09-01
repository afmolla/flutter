#!/usr/bin/env python3
"""Download all ayfleks.com assets referenced in data JSON and rewrite URLs to local paths."""

from __future__ import annotations

import json
import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path("/workspace")
DATA = ROOT / "data" / "ayfleks"
PUBLIC = ROOT / "public"
BASE = "https://ayfleks.com"
UA = "Mozilla/5.0 (compatible; AyfleksSeedBot/1.0)"

ASSET_RE = re.compile(
    r"https?://(?:www\.)?ayfleks\.com(/(?:images|css|js|fonts)/[^\"'\s<>\\?#]+)",
    re.I,
)
ABS_ANY_RE = re.compile(r"https?://(?:www\.)?ayfleks\.com(/[^\"'\s<>\\]*)", re.I)

# Map old ayfleks.com paths -> our Next routes
PAGE_MAP = {
    "/hakkimizda.aspx": "/p/hakkimizda",
    "/vizyon-misyon.aspx": "/p/vizyon-misyon",
    "/degerlerimiz.aspx": "/p/degerlerimiz",
    "/politikalarimiz.aspx": "/p/politikalarimiz",
    "/haberler.aspx": "/haberler",
    "/urunler.aspx": "/urunler",
    "/urun-gruplarimiz/gida": "/urun-gruplarimiz/gida",
    "/urun-gruplarimiz/kisisel-bakim-hijyen": "/urun-gruplarimiz/kisisel-bakim-hijyen",
    "/urun-gruplarimiz/evcil-hayvan-bakimi": "/urun-gruplarimiz/evcil-hayvan-bakimi",
    "/urun-gruplarimiz/endustriyel": "/urun-gruplarimiz/endustriyel",
    "/surdurulebilirlik-yaklasimi.aspx": "/p/surdurulebilirlik-yaklasimi",
    "/surdurulebilirlik-hedefleri.aspx": "/p/surdurulebilirlik-hedefleri",
    "/faaliyetler.aspx": "/p/faaliyetler",
    "/teknoloji.aspx": "/p/teknoloji",
    "/uretim-surecleri.aspx": "/p/uretim-surecleri",
    "/paketleme.aspx": "/p/paketleme",
    "/kalite-kontrol.aspx": "/p/kalite-kontrol",
    "/test-laboratuvari.aspx": "/p/test-laboratuvari",
    "/sertifikalar.aspx": "/p/sertifikalar",
    "/insan-kaynaklari-politikasi.aspx": "/p/insan-kaynaklari-politikasi",
    "/acik-pozisyonlar.aspx": "/p/acik-pozisyonlar",
    "/is-basvuru-formu.aspx": "/p/is-basvuru-formu",
    "/is-etigi-formu.aspx": "/p/is-etigi-formu",
    "/iletisim.aspx": "/iletisim",
    "/kvkk.aspx": "/p/kvkk",
    "/en/about-us.aspx": "/en/p/en-about-us",
    "/en/vision-mission.aspx": "/en/p/en-vision-mission",
    "/en/our-values.aspx": "/en/p/en-our-values",
    "/en/our-policies.aspx": "/en/p/en-our-policies",
    "/en/news.aspx": "/en/news",
    "/en/product-groups/food": "/en/product-groups/food",
    "/en/product-groups/personal-care-hygiene": "/en/product-groups/personal-care-hygiene",
    "/en/product-groups/pet-care": "/en/product-groups/pet-care",
    "/en/product-groups/industrial": "/en/product-groups/industrial",
    "/en/our-approach-to-sustainability.aspx": "/en/p/en-our-approach-to-sustainability",
    "/en/sustainability-goals.aspx": "/en/p/en-sustainability-goals",
    "/en/activities.aspx": "/en/p/en-activities",
    "/en/technology.aspx": "/en/p/en-technology",
    "/en/production-processes.aspx": "/en/p/en-production-processes",
    "/en/packaging.aspx": "/en/p/en-packaging",
    "/en/quality-control.aspx": "/en/p/en-quality-control",
    "/en/test-laboratory.aspx": "/en/p/en-test-laboratory",
    "/en/certificates.aspx": "/en/p/en-certificates",
    "/en/human-resources-policy.aspx": "/en/p/en-human-resources-policy",
    "/en/open-positions.aspx": "/en/p/en-open-positions",
    "/en/job-application-form.aspx": "/en/p/en-job-application-form",
    "/en/contact-us.aspx": "/en/contact",
    "/en/gdpr.aspx": "/en/p/en-gdpr",
}


def product_path_to_local(path: str) -> str | None:
    # /urunler/1001/sekerleme-urunleri-ambalajlari/1003/gida.aspx
    m = re.match(r"^/urunler/\d+/([^/]+)/\d+/[^/]+\.aspx$", path)
    if m:
        return f"/urun/{m.group(1)}"
    m = re.match(r"^/en/products/\d+/([^/]+)/\d+/[^/]+\.aspx$", path)
    if m:
        return f"/en/product/{m.group(1)}"
    # news
    m = re.match(r"^/haberler/\d+/haberler/\d+/([^/]+)\.aspx$", path)
    if m:
        return f"/haberler/{m.group(1)}"
    m = re.match(r"^/en/news/\d+/news/\d+/([^/]+)\.aspx$", path)
    if m:
        return f"/en/news/{m.group(1)}"
    return None


def download(path: str) -> bool:
    dest = PUBLIC / path.lstrip("/")
    if dest.exists() and dest.stat().st_size > 30:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    url = BASE + path
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as resp:
                dest.write_bytes(resp.read())
            print(f"  OK {path} ({dest.stat().st_size} bytes)")
            return True
        except Exception as e:  # noqa: BLE001
            print(f"  FAIL {path}: {e}")
            time.sleep(1.2 * (attempt + 1))
    return False


def collect_asset_paths(obj) -> set[str]:
    found: set[str] = set()

    def walk(o):
        if isinstance(o, str):
            for m in ASSET_RE.finditer(o):
                found.add(unquote(m.group(1).split("?")[0]))
            for m in re.finditer(r"(?:src|href)=[\"'](/images/[^\"']+)[\"']", o, re.I):
                found.add(unquote(m.group(1).split("?")[0]))
            for m in re.finditer(r"url\((['\"]?)(/images/[^)'\"]+)\1\)", o, re.I):
                found.add(unquote(m.group(2).split("?")[0]))
        elif isinstance(o, list):
            for x in o:
                walk(x)
        elif isinstance(o, dict):
            for v in o.values():
                walk(v)

    walk(obj)
    return found


def rewrite_string(s: str) -> str:
    def repl_abs(m: re.Match[str]) -> str:
        path = unquote(m.group(1).split("?")[0])
        # assets -> local
        if path.startswith("/images/") or path.startswith("/css/") or path.startswith("/js/"):
            return path
        # mapped pages
        if path in PAGE_MAP:
            return PAGE_MAP[path]
        mapped = product_path_to_local(path)
        if mapped:
            return mapped
        # kvkk docs and similar .aspx kept as absolute if we don't host them —
        # strip host so relative /xxx.aspx still works if we add pages later,
        # but prefer known local cms routes by slug if present
        slug = path.rsplit("/", 1)[-1].replace(".aspx", "")
        if path.startswith("/en/"):
            candidate = f"/en/p/en-{slug}"
        else:
            candidate = f"/p/{slug}"
        # leave absolute for unknown legal docs that may not exist locally
        if path.endswith(".aspx") and "kvkk" in path or "politika" in path or "policy" in path:
            return m.group(0)  # keep absolute for now if unmapped
        if path.endswith(".aspx"):
            return candidate
        return path

    # Fix operator precedence bug above carefully with explicit rewrite
    out = []
    last = 0
    for m in ABS_ANY_RE.finditer(s):
        out.append(s[last : m.start()])
        path = unquote(m.group(1).split("?")[0])
        if path.startswith(("/images/", "/css/", "/js/", "/fonts/")):
            out.append(path)
        elif path in PAGE_MAP:
            out.append(PAGE_MAP[path])
        else:
            mapped = product_path_to_local(path)
            if mapped:
                out.append(mapped)
            else:
                # keep external for unmapped legal docs
                out.append(m.group(0))
        last = m.end()
    out.append(s[last:])
    return "".join(out)


def rewrite_obj(o):
    if isinstance(o, str):
        return rewrite_string(o)
    if isinstance(o, list):
        return [rewrite_obj(x) for x in o]
    if isinstance(o, dict):
        return {k: rewrite_obj(v) for k, v in o.items()}
    return o


def main() -> None:
    files = [
        "sayfalar.json",
        "urunler.json",
        "haberler.json",
        "ayfleks-home.json",
        "ayfleks-home-en.json",
        "menus.json",
        "menus-en.json",
        "media.json",
        "content.json",
        "_seed-scraped.json",
    ]

    all_assets: set[str] = set()
    payloads: dict[str, object] = {}
    for name in files:
        path = DATA / name
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        payloads[name] = data
        all_assets |= collect_asset_paths(data)

    print(f"Found {len(all_assets)} asset paths")
    missing = []
    for asset in sorted(all_assets):
        local = PUBLIC / asset.lstrip("/")
        if not local.exists() or local.stat().st_size < 30:
            missing.append(asset)
    print(f"Downloading {len(missing)} missing assets...")
    ok = fail = 0
    for asset in missing:
        if download(asset):
            ok += 1
        else:
            fail += 1
        time.sleep(0.05)
    print(f"Downloaded ok={ok} fail={fail}")

    print("Rewriting absolute ayfleks.com URLs to local paths...")
    for name, data in payloads.items():
        rewritten = rewrite_obj(data)
        (DATA / name).write_text(json.dumps(rewritten, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  wrote {name}")

    # verify remaining abs refs
    for name in ["sayfalar.json", "urunler.json", "haberler.json", "_seed-scraped.json"]:
        text = (DATA / name).read_text(encoding="utf-8")
        n = len(re.findall(r"https?://(?:www\.)?ayfleks\.com", text, re.I))
        print(f"remaining abs refs in {name}: {n}")


if __name__ == "__main__":
    main()
