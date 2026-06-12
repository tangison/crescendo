#!/usr/bin/env python3
"""Fast image conversion — webp only, skip bg removal for now, generate report for later bg processing."""
import csv, os, json, re, shutil
from pathlib import Path
from PIL import Image

UPLOAD_DIR = Path("/home/z/my-project/upload")
EXTRACTED_DIR = UPLOAD_DIR / "extracted"
REPO_PUBLIC = Path("/home/z/my-project/cresenndona-repos/crescendo/public")
PRODUCTS_DIR = REPO_PUBLIC / "products"
REPORT_PATH = Path("/home/z/my-project/cresenndona-repos/crescendo/image-processing-report.json")

CATEGORIES = ["guitars", "keyboards", "drums", "strings", "accordions",
              "pro-audio", "wind", "accessories", "books", "branding",
              "book-an-artist", "homepage"]
for cat in CATEGORIES:
    (PRODUCTS_DIR / cat).mkdir(parents=True, exist_ok=True)

ZIP_MAP = {
    "boya-": "boya-by-wm4-pro-k1-digital-wir",
    "kawai-": "311-3117940_acoustic-piano-kaw",
    "ninja-": "NINJA-ULTRA-HERO",
    "Crescendo signature": "Crescendo signature",
}

def find_src(zip_prefix, filepath):
    for pfx, dirname in ZIP_MAP.items():
        if zip_prefix.startswith(pfx):
            full = EXTRACTED_DIR / dirname / filepath
            if full.exists(): return full
    for dirname in os.listdir(EXTRACTED_DIR):
        full = EXTRACTED_DIR / dirname / filepath
        if full.exists(): return full
    return None

def slugify(t):
    t = t.lower().strip()
    t = re.sub(r'[^\w\s-]', '', t)
    t = re.sub(r'[\s_]+', '-', t)
    return re.sub(r'-+', '-', t).strip('-')

def cat_from(sug):
    if not sug: return "accessories"
    s = sug.lower()
    if s.startswith("guitars"): return "guitars"
    if s.startswith("keyboards") or s.startswith("pianos"): return "keyboards"
    if s.startswith("drums"): return "drums"
    if s.startswith("violin") or s.startswith("strings"): return "strings"
    if s.startswith("accordion"): return "accordions"
    if s.startswith("pro-audio") or s.startswith("pro_audio"): return "pro-audio"
    if s.startswith("wind"): return "wind"
    if s.startswith("accessories"): return "accessories"
    if s.startswith("book"): return "book-an-artist"
    if s.startswith("branding") or s.startswith("logo"): return "branding"
    if s.startswith("homepage") or s.startswith("promo") or s.startswith("hero"): return "homepage"
    if s.startswith("unclear") or s.startswith("unrelated"): return None
    return "accessories"

def to_webp(src, dst, quality=85, max_w=2048):
    try:
        img = Image.open(src)
        if img.width > max_w:
            r = max_w / img.width
            img = img.resize((max_w, int(img.height * r)), Image.Resampling.LANCZOS)
        if img.mode == 'RGBA':
            white = Image.new('RGB', img.size, (255,255,255))
            white.paste(img, mask=img.split()[3])
            img = white
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        dst.parent.mkdir(parents=True, exist_ok=True)
        img.save(dst, 'WEBP', quality=quality)
        return True
    except Exception as e:
        print(f"ERROR: {src} -> {e}")
        return False

report = {"processed": [], "skipped": [], "review": [], "errors": [], "new_products": [], "bg_remove_needed": []}

# Process 01_product_image_mapping.csv
with open(UPLOAD_DIR / "01_product_image_mapping.csv", 'r') as f:
    for row in csv.DictReader(f):
        sz = row.get("source_zip","").strip()
        fp = row.get("file_path_in_zip","").strip()
        sug = row.get("suggested_product_slug_or_category","").strip()
        conf = row.get("confidence","").strip()
        act = row.get("action","").strip()
        notes = row.get("notes","").strip()

        if act in ("skip",) or conf in ("skip","no","duplicate"):
            report["skipped"].append({"file": fp, "reason": notes or act or conf})
            continue
        if conf == "review":
            report["review"].append({"file": fp, "suggestion": sug, "notes": notes})
            continue

        src = find_src(sz, fp)
        if not src:
            report["errors"].append({"file": fp, "error": "not found"})
            continue

        cat = cat_from(sug)
        if cat is None:
            report["skipped"].append({"file": fp, "reason": f"unrelated: {sug}"})
            continue

        pslug = slugify(sug) if sug and sug != "unclear" else slugify(notes[:50] if notes else Path(fp).stem)
        dst_name = f"{pslug}.webp"
        dst = PRODUCTS_DIR / cat / dst_name
        c = 2
        while dst.exists():
            dst_name = f"{pslug}-{c}.webp"
            dst = PRODUCTS_DIR / cat / dst_name
            c += 1

        needs_bg = "bg_remove" in act
        ok = to_webp(src, dst)
        if ok:
            wp = f"/products/{cat}/{dst_name}"
            report["processed"].append({"original": fp, "webp_path": wp, "category": cat,
                                        "product_slug": pslug, "suggestion": sug, "confidence": conf, "notes": notes})
            if needs_bg:
                report["bg_remove_needed"].append({"webp_path": wp, "original": fp, "notes": notes})
        else:
            report["errors"].append({"file": fp, "error": "conversion failed"})

# Process footer/artist CSV
with open(UPLOAD_DIR / "03_footer_and_book_an_artist.csv", 'r') as f:
    for row in csv.DictReader(f):
        sz = row.get("source_zip","").strip()
        fp = row.get("file_path_in_zip","").strip()
        dest = row.get("destination","").strip()
        act = row.get("action","").strip()
        notes = row.get("notes","").strip()

        src = find_src(sz, fp)
        if not src:
            report["errors"].append({"file": fp, "error": "not found"})
            continue

        if dest == "footer":
            ddir = PRODUCTS_DIR / "branding"
            dname = f"signature-{slugify(Path(fp).stem)}.webp"
        elif "book-an-artist" in dest:
            ddir = PRODUCTS_DIR / "book-an-artist"
            dname = f"hero-{slugify(Path(fp).stem)}.webp"
        else:
            ddir = PRODUCTS_DIR / "branding"
            dname = f"{slugify(Path(fp).stem)}.webp"

        dst = ddir / dname
        ok = to_webp(src, dst)
        if ok:
            wp = f"/products/{ddir.name}/{dname}"
            report["processed"].append({"original": fp, "webp_path": wp, "category": ddir.name, "destination": dest, "notes": notes})

# Trinity Theory books
books = EXTRACTED_DIR / "nikon" / "Books"
if books.exists():
    grade = 1
    for f in sorted(books.iterdir()):
        if f.is_file() and f.suffix.lower() in ('.jpeg','.jpg','.png','.webp'):
            dst = PRODUCTS_DIR / "books" / f"trinity-theory-workbook-grade-{grade}.webp"
            ok = to_webp(f, dst)
            if ok:
                wp = f"/products/books/trinity-theory-workbook-grade-{grade}.webp"
                report["processed"].append({"original": f.name, "webp_path": wp, "category": "books",
                                            "product_slug": f"trinity-theory-grade-{grade}",
                                            "notes": f"Trinity Theory of Music Workbook Grade {grade}"})
                report["new_products"].append({"name": f"Trinity Theory of Music Workbook Grade {grade}",
                                               "slug": f"trinity-theory-workbook-grade-{grade}",
                                               "category": "books", "image": wp, "grade": grade})
            grade += 1

# Crescendo logo
logo = find_src("boya-", "crescendo logo.png")
if logo:
    dst = PRODUCTS_DIR / "branding" / "crescendo-logo.webp"
    if to_webp(logo, dst):
        report["processed"].append({"original": "crescendo logo.png", "webp_path": "/products/branding/crescendo-logo.webp", "category": "branding"})

# Notation SVG — copy directly
svg = find_src("boya-", "Notation_musicale_crescendo.svg")
if svg:
    dst_dir = PRODUCTS_DIR / "branding"
    dst_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(svg, dst_dir / "notation-crescendo.svg")
    report["processed"].append({"original": "Notation_musicale_crescendo.svg", "webp_path": "/products/branding/notation-crescendo.svg", "category": "branding"})

with open(REPORT_PATH, 'w') as f:
    json.dump(report, f, indent=2)

print(f"Processed: {len(report['processed'])} | Skipped: {len(report['skipped'])} | Review: {len(report['review'])} | Errors: {len(report['errors'])} | BG Remove Needed: {len(report['bg_remove_needed'])} | New Products: {len(report['new_products'])}")
