#!/usr/bin/env python3
"""
Crescendo Namibia — Image Processing Pipeline
- Reads CSV manifests
- Converts to webp (quality 85, max 2048px width)
- Removes backgrounds where needed
- Saves to /home/z/my-project/cresenndona-repos/crescendo/public/products/{category-slug}/
- Generates a processing report
"""

import csv
import os
import re
import json
from pathlib import Path
from PIL import Image

# Paths
UPLOAD_DIR = Path("/home/z/my-project/upload")
EXTRACTED_DIR = UPLOAD_DIR / "extracted"
REPO_PUBLIC = Path("/home/z/my-project/cresenndona-repos/crescendo/public")
PRODUCTS_DIR = REPO_PUBLIC / "products"
REPORT_PATH = Path("/home/z/my-project/cresenndona-repos/crescendo/image-processing-report.json")

# Create category directories
CATEGORIES = [
    "guitars", "keyboards", "drums", "strings", "accordions",
    "pro-audio", "wind", "accessories", "books", "branding",
    "book-an-artist", "homepage"
]
for cat in CATEGORIES:
    (PRODUCTS_DIR / cat).mkdir(parents=True, exist_ok=True)

# Map source_zip prefixes to extracted directory names
ZIP_MAP = {
    "boya-": "boya-by-wm4-pro-k1-digital-wir",
    "kawai-": "311-3117940_acoustic-piano-kaw",
    "ninja-": "NINJA-ULTRA-HERO",
    "rode-sm6": "rode-sm6",
    "Crescendo signature": "Crescendo signature",
}

def find_source_file(source_zip_prefix, file_path):
    """Find the actual file in the extracted directories."""
    for prefix, dirname in ZIP_MAP.items():
        if source_zip_prefix.startswith(prefix):
            full_path = EXTRACTED_DIR / dirname / file_path
            if full_path.exists():
                return full_path
    # Try all directories
    for dirname in os.listdir(EXTRACTED_DIR):
        full_path = EXTRACTED_DIR / dirname / file_path
        if full_path.exists():
            return full_path
    return None

def slugify(text):
    """Convert text to kebab-case slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def category_from_suggestion(suggestion):
    """Map the suggested_product_slug_or_category to a directory category."""
    if not suggestion:
        return "accessories"
    
    sug = suggestion.lower()
    
    # Direct category matches
    if sug.startswith("guitars"):
        return "guitars"
    if sug.startswith("keyboards") or sug.startswith("pianos"):
        return "keyboards"
    if sug.startswith("drums"):
        return "drums"
    if sug.startswith("violin") or sug.startswith("strings"):
        return "strings"
    if sug.startswith("accordion"):
        return "accordions"
    if sug.startswith("pro-audio") or sug.startswith("pro_audio"):
        return "pro-audio"
    if sug.startswith("wind"):
        return "wind"
    if sug.startswith("accessories"):
        return "accessories"
    if sug.startswith("book"):
        return "book-an-artist"
    if sug.startswith("branding") or sug.startswith("logo"):
        return "branding"
    if sug.startswith("homepage") or sug.startswith("promo") or sug.startswith("hero"):
        return "homepage"
    if sug.startswith("world"):
        return "accessories"
    if sug.startswith("unclear") or sug.startswith("unrelated"):
        return None
    return "accessories"

def product_slug_from_suggestion(suggestion, notes, filename):
    """Generate a descriptive slug for the product."""
    if suggestion and suggestion not in ("unclear", "duplicate"):
        return slugify(suggestion)
    # Fall back to notes or filename
    if notes:
        return slugify(notes.split("-")[0][:50])
    return slugify(Path(filename).stem)

def convert_to_webp(src_path, dst_path, quality=85, max_width=2048, bg_remove=False):
    """Convert image to webp with optional bg removal and resizing."""
    try:
        img = Image.open(src_path)
        
        # Remove background if requested
        if bg_remove:
            try:
                from rembg import remove
                img = remove(img)
                # If image now has transparency, composite onto white bg per DESIGN.md
                if img.mode == 'RGBA':
                    white_bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
                    white_bg.paste(img, mask=img.split()[3])
                    img = white_bg.convert('RGB')
            except Exception as e:
                print(f"  [WARN] BG removal failed for {src_path}: {e}")
                # Continue without bg removal
        
        # Resize if wider than max_width
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert to RGB if needed (for webp)
        if img.mode == 'RGBA':
            # Keep alpha for product images that need transparent bg
            # But DESIGN.md says white bg, so composite
            white_bg = Image.new('RGB', img.size, (255, 255, 255))
            white_bg.paste(img, mask=img.split()[3])
            img = white_bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save as webp
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(dst_path, 'WEBP', quality=quality)
        return True
    except Exception as e:
        print(f"  [ERROR] Failed to process {src_path}: {e}")
        return False

# Read CSV
csv_path = UPLOAD_DIR / "01_product_image_mapping.csv"
report = {
    "processed": [],
    "skipped": [],
    "review": [],
    "errors": [],
    "new_products": [],
}

with open(csv_path, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        source_zip = row.get("source_zip", "").strip()
        file_path = row.get("file_path_in_zip", "").strip()
        suggestion = row.get("suggested_product_slug_or_category", "").strip()
        confidence = row.get("confidence", "").strip()
        action = row.get("action", "").strip()
        notes = row.get("notes", "").strip()
        
        # Skip rows
        if action == "skip" or confidence in ("skip", "no", "duplicate"):
            report["skipped"].append({
                "file": file_path,
                "reason": notes or action or confidence,
                "suggestion": suggestion
            })
            continue
        
        # Review rows
        if confidence == "review":
            report["review"].append({
                "file": file_path,
                "suggestion": suggestion,
                "notes": notes
            })
            continue
        
        # Find source file
        src_path = find_source_file(source_zip, file_path)
        if not src_path:
            report["errors"].append({
                "file": file_path,
                "error": "Source file not found in extracted directories"
            })
            continue
        
        # Determine category directory
        cat_dir = category_from_suggestion(suggestion)
        if cat_dir is None:
            report["skipped"].append({
                "file": file_path,
                "reason": f"Unrelated/unclear category: {suggestion}",
                "suggestion": suggestion
            })
            continue
        
        # Generate destination filename
        prod_slug = product_slug_from_suggestion(suggestion, notes, file_path)
        dst_filename = f"{prod_slug}.webp"
        
        # Handle duplicates by adding suffix
        dst_path = PRODUCTS_DIR / cat_dir / dst_filename
        counter = 2
        while dst_path.exists():
            dst_filename = f"{prod_slug}-{counter}.webp"
            dst_path = PRODUCTS_DIR / cat_dir / dst_filename
            counter += 1
        
        # Determine if bg removal is needed
        needs_bg_remove = "bg_remove" in action
        
        # Determine if conversion is needed
        needs_convert = "convert_webp" in action or not file_path.endswith(".webp")
        
        print(f"Processing: {file_path} -> {cat_dir}/{dst_filename} (bg_remove={needs_bg_remove}, convert={needs_convert})")
        
        if needs_convert or needs_bg_remove:
            success = convert_to_webp(src_path, dst_path, bg_remove=needs_bg_remove)
        else:
            # Already webp, just copy
            import shutil
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dst_path)
            success = True
        
        if success:
            webp_path = f"/products/{cat_dir}/{dst_filename}"
            report["processed"].append({
                "original_file": file_path,
                "webp_path": webp_path,
                "category": cat_dir,
                "product_slug": prod_slug,
                "suggestion": suggestion,
                "confidence": confidence,
                "notes": notes,
                "bg_removed": needs_bg_remove,
            })
        else:
            report["errors"].append({
                "file": file_path,
                "error": "Conversion failed"
            })

# Process footer/artist CSV
footer_csv = UPLOAD_DIR / "03_footer_and_book_an_artist.csv"
if footer_csv.exists():
    with open(footer_csv, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            source_zip = row.get("source_zip", "").strip()
            file_path = row.get("file_path_in_zip", "").strip()
            destination = row.get("destination", "").strip()
            action = row.get("action", "").strip()
            notes = row.get("notes", "").strip()
            
            src_path = find_source_file(source_zip, file_path)
            if not src_path:
                report["errors"].append({"file": file_path, "error": "Source file not found"})
                continue
            
            if destination == "footer":
                dst_dir = PRODUCTS_DIR / "branding"
                dst_filename = f"signature-{slugify(Path(file_path).stem)}.webp"
            elif "book-an-artist" in destination:
                dst_dir = PRODUCTS_DIR / "book-an-artist"
                dst_filename = f"hero-{slugify(Path(file_path).stem)}.webp"
            else:
                dst_dir = PRODUCTS_DIR / "branding"
                dst_filename = f"{slugify(Path(file_path).stem)}.webp"
            
            dst_path = dst_dir / dst_filename
            needs_bg_remove = "bg_remove" in action
            print(f"Processing: {file_path} -> {dst_dir.name}/{dst_filename}")
            
            success = convert_to_webp(src_path, dst_path, bg_remove=needs_bg_remove)
            if success:
                webp_path = f"/products/{dst_dir.name}/{dst_filename}"
                report["processed"].append({
                    "original_file": file_path,
                    "webp_path": webp_path,
                    "category": dst_dir.name,
                    "destination": destination,
                    "notes": notes,
                })

# Process Trinity Theory books from nikon/Books/
books_dir = EXTRACTED_DIR / "nikon" / "Books"
if books_dir.exists():
    grade = 1
    for f in sorted(books_dir.iterdir()):
        if f.is_file() and f.suffix.lower() in ('.jpeg', '.jpg', '.png', '.webp'):
            dst_dir = PRODUCTS_DIR / "books"
            dst_filename = f"trinity-theory-workbook-grade-{grade}.webp"
            dst_path = dst_dir / dst_filename
            print(f"Processing book: {f.name} -> books/{dst_filename}")
            success = convert_to_webp(f, dst_path, bg_remove=False)
            if success:
                webp_path = f"/products/books/{dst_filename}"
                report["processed"].append({
                    "original_file": f.name,
                    "webp_path": webp_path,
                    "category": "books",
                    "product_slug": f"trinity-theory-grade-{grade}",
                    "notes": f"Trinity Theory of Music Workbook Grade {grade}",
                })
                report["new_products"].append({
                    "name": f"Trinity Theory of Music Workbook Grade {grade}",
                    "slug": f"trinity-theory-workbook-grade-{grade}",
                    "category": "books",
                    "image": webp_path,
                    "price": 0,
                    "grade": grade,
                })
            grade += 1

# Process Crescendo logo
logo_src = find_source_file("boya-", "crescendo logo.png")
if logo_src:
    dst_path = PRODUCTS_DIR / "branding" / "crescendo-logo.webp"
    print(f"Processing: crescendo logo.png -> branding/crescendo-logo.webp")
    success = convert_to_webp(logo_src, dst_path, bg_remove=False)
    if success:
        report["processed"].append({
            "original_file": "crescendo logo.png",
            "webp_path": "/products/branding/crescendo-logo.webp",
            "category": "branding",
            "notes": "Crescendo logo for footer/header",
        })

# Save report
with open(REPORT_PATH, 'w') as f:
    json.dump(report, f, indent=2)

print(f"\n=== PROCESSING COMPLETE ===")
print(f"Processed: {len(report['processed'])} images")
print(f"Skipped: {len(report['skipped'])} images")
print(f"Review: {len(report['review'])} items")
print(f"Errors: {len(report['errors'])} items")
print(f"New products (draft): {len(report['new_products'])} items")
print(f"Report saved to: {REPORT_PATH}")
