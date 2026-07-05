#!/usr/bin/env python3
"""
Shopify store scraper (sequential, thread-safe).
One product at a time, but tries the most relevant store first based on brand.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path
from PIL import Image, ImageOps
from difflib import SequenceMatcher

ROOT = Path('/home/z/my-project/crescendo')
PRODUCTS_FILE = ROOT / 'src/data/products.ts'
RESULTS_FILE = ROOT / 'scripts-audit' / 'scraper-results.jsonl'
CANDIDATES_DIR = Path('/home/z/my-project/scripts/test-batch/candidates')
TARGET_SIZE = (1024, 1024)

# Brand → store priority (try most relevant store first)
BRAND_STORES = {
    'Vandoren': [
        {'name': 'tarpleymusic', 'search_url': 'https://tarpleymusic.com/search?q={query}&type=product'},
        {'name': 'drumcenternh', 'search_url': 'https://drumcenternh.com/search?q={query}&type=product'},
    ],
    'Warwick': [
        {'name': 'shopwmusic', 'search_url': 'https://shopwmusicdistributionusa.com/search?q={query}&type=product'},
        {'name': 'drumcenternh', 'search_url': 'https://drumcenternh.com/search?q={query}&type=product'},
    ],
    'Vater': [
        {'name': 'drumcenternh', 'search_url': 'https://drumcenternh.com/search?q={query}&type=product'},
    ],
    'XVive': [
        {'name': 'drumcenternh', 'search_url': 'https://drumcenternh.com/search?q={query}&type=product'},
        {'name': 'shopwmusic', 'search_url': 'https://shopwmusicdistributionusa.com/search?q={query}&type=product'},
    ],
    'Wolf': [
        {'name': 'drumcenternh', 'search_url': 'https://drumcenternh.com/search?q={query}&type=product'},
        {'name': 'tarpleymusic', 'search_url': 'https://tarpleymusic.com/search?q={query}&type=product'},
    ],
}

def load_all_products():
    src = open(PRODUCTS_FILE).read()
    pattern = re.compile(
        r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*'
        r'brand:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*'
        r'price:\s*[\d.]+,\s*qty:\s*\d+,\s*skillLevel:\s*"[^"]+",\s*'
        r'image:\s*"([^"]+)"'
    )
    return [{'id':m.group(1),'name':m.group(2),'slug':m.group(3),'brand':m.group(4),
             'category':m.group(5),'image':m.group(6)} for m in pattern.finditer(src)]

def load_done_ids():
    done = set()
    old_results = ROOT / 'scripts-audit' / 'results.json'
    if old_results.exists():
        try:
            with open(old_results) as f:
                done = {r['id'] for r in json.load(f)}
        except: pass
    if RESULTS_FILE.exists():
        with open(RESULTS_FILE) as f:
            for line in f:
                line = line.strip()
                if line:
                    try: done.add(json.loads(line)['id'])
                    except: pass
    return done

def append_result(result):
    with open(RESULTS_FILE, 'a') as f:
        f.write(json.dumps(result) + '\n')
        f.flush()

def extract_model(brand, name):
    generic = {'classic', 'guitar', 'acoustic', 'electric', 'professional', 'standard', 'edition', 'series'}
    name_clean = name.replace('/', ' ')
    parts = [w for w in name_clean.split() if w.lower() not in generic]
    if parts and parts[0].lower() == brand.lower().split()[0]:
        parts = parts[1:]
    while parts and parts[0].isdigit():
        parts = parts[1:]
    return ' '.join(parts[:6])

def title_similarity(product_name, page_title):
    p1 = re.sub(r'[^a-z0-9 ]', '', product_name.lower())
    p2 = re.sub(r'[^a-z0-9 ]', '', page_title.lower())
    brand = product_name.lower().split()[0]
    brand_match = brand in p2
    words = [w for w in p1.split() if len(w) > 2]
    matched = sum(1 for w in words if w in p2)
    word_ratio = matched / max(1, len(words))
    seq_ratio = SequenceMatcher(None, p1, p2).ratio()
    score = (word_ratio * 0.5 + seq_ratio * 0.5)
    if brand_match:
        score = min(1.0, score + 0.2)
    return score

def fetch_page(page, url, timeout=12000):
    """Fetch a page using a Playwright page object."""
    try:
        page.goto(url, timeout=timeout, wait_until='domcontentloaded')
        page.wait_for_timeout(2500)
        return page.content()
    except:
        return None

def search_store(page, store, query, product_name):
    """Search a Shopify store. Returns (image_url, prod_url, title, sim) or None."""
    url = store['search_url'].format(query=urllib.parse.quote(query))
    try:
        page.goto(url, timeout=12000, wait_until='domcontentloaded')
        page.wait_for_timeout(3000)
    except:
        return None
    # Use Playwright DOM queries (works on JS-rendered content)
    try:
        links = page.eval_on_selector_all('a[href*="/products/"]', '''els => els.slice(0, 10).map(e => ({
            href: e.href.split('?')[0], text: e.textContent.trim().substring(0, 120)
        }))''')
    except:
        return None
    # Dedupe
    seen = set()
    unique = []
    for l in links:
        if l['href'] not in seen and l['text'] and len(l['text']) > 3:
            seen.add(l['href'])
            unique.append(l)
    if not unique: return None
    # Find best match
    best = None
    for l in unique:
        sim = title_similarity(product_name, l['text'])
        if best is None or sim > best[2]:
            best = (l['href'], l['text'], sim)
    if not best or best[2] < 0.2:
        return None
    prod_url = best[0]
    # Fetch product page for og:image
    try:
        page.goto(prod_url, timeout=12000, wait_until='domcontentloaded')
        page.wait_for_timeout(2000)
        html = page.content()
    except:
        return None
    og = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html)
    if not og: return None
    img_url = og.group(1).replace('&amp;', '&')
    title_m = re.search(r'<title>([^<]+)</title>', html)
    page_title = title_m.group(1).strip() if title_m else best[1]
    final_sim = title_similarity(product_name, page_title)
    return (img_url, prod_url, page_title, final_sim)

def download_image(url, dest_path, timeout=30):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 CrescendoBot/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status != 200: return False
            data = resp.read()
            if len(data) < 1024: return False
            with open(dest_path, 'wb') as f: f.write(data)
            try:
                with Image.open(dest_path) as im: im.verify()
                return True
            except: return False
    except: return False

def process_image_to_square(src_path, dest_path, size=TARGET_SIZE):
    with Image.open(src_path) as im:
        im = im.convert('RGBA')
        fitted = ImageOps.contain(im, size, method=Image.LANCZOS)
        canvas = Image.new('RGBA', size, (255, 255, 255, 255))
        offset = ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2)
        canvas.paste(fitted, offset, fitted)
        canvas.convert('RGB').save(dest_path, 'WEBP', quality=88, method=6)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('chunk_size', type=int, nargs='?', default=20)
    args = parser.parse_args()

    all_products = load_all_products()
    done_ids = load_done_ids()
    remaining = [p for p in all_products if p['id'] not in done_ids]
    # Prioritize brands that have matching Shopify stores (Vater, Warwick first)
    brand_priority = {'Vater': 0, 'Warwick': 1, 'Wolf': 2, 'XVive': 3, 'Vandoren': 4}
    remaining.sort(key=lambda p: brand_priority.get(p['brand'], 99))
    chunk = remaining[:args.chunk_size]
    print(f"=== Shopify scraper (sequential): {len(chunk)} of {len(remaining)} remaining ===")
    print(f"Total done: {len(done_ids)} / {len(all_products)}")
    print()

    from playwright.sync_api import sync_playwright
    pw = sync_playwright().start()
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = browser.new_context(
        user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport={'width': 1280, 'height': 800},
    )
    page = ctx.new_page()

    start = time.time()
    processed = 0; matched = 0; unmatched = 0

    for prod in chunk:
        pid = prod['id']; slug = prod['slug']; cat = prod['category']
        brand = prod['brand']; name = prod['name']
        dest_path = ROOT / 'public' / 'products' / cat / f'{slug}.webp'
        result = {
            'id': pid, 'slug': slug, 'category': cat, 'brand': brand, 'name': name,
            'old_image': prod['image'], 'new_image': None, 'matched': False,
            'source_url': None, 'score': 0, 'reason': '', 'provider': 'shopify',
        }
        if dest_path.exists():
            result['matched'] = True
            result['new_image'] = f'/products/{cat}/{slug}.webp'
            result['score'] = 99
            result['reason'] = 'already sourced'
            result['provider'] = 'prior-run'
            append_result(result)
            processed += 1
            print(f"[{processed}/{len(chunk)}] {pid:<18} SKIP (already sourced)")
            continue

        model = extract_model(brand, name)
        query = f'{brand} {model}'
        query = ' '.join(query.split())[:80]
        
        stores = BRAND_STORES.get(brand, [])
        found = False
        for store in stores:
            search_result = search_store(page, store, query, name)
            if search_result:
                img_url, prod_url, title, sim = search_result
                if sim >= 0.7: score = 95
                elif sim >= 0.5: score = 85
                elif sim >= 0.3: score = 70
                else: score = 60
                cand_dir = CANDIDATES_DIR / pid
                cand_dir.mkdir(parents=True, exist_ok=True)
                ext = '.jpg'
                if '.png' in img_url.lower(): ext = '.png'
                elif '.webp' in img_url.lower(): ext = '.webp'
                cand_path = cand_dir / f'shopify-{store["name"]}{ext}'
                if download_image(img_url, str(cand_path)):
                    try:
                        process_image_to_square(cand_path, dest_path)
                        result['matched'] = True
                        result['new_image'] = f'/products/{cat}/{slug}.webp'
                        result['score'] = score
                        result['reason'] = f'shopify:{store["name"]} sim={sim:.2f}'
                        result['source_url'] = img_url
                        found = True
                        break
                    except: pass
            time.sleep(0.3)
        
        append_result(result)
        processed += 1
        if result['matched']: matched += 1
        else: unmatched += 1
        status = 'M' if result['matched'] else 'U'
        elapsed = time.time() - start
        print(f"[{processed}/{len(chunk)}] {pid:<18} {brand:<14} {name[:38]:<38} -> {status} s={result.get('score',0):>3} ({elapsed:.0f}s)")

    page.close()
    ctx.close()
    browser.close()
    pw.stop()

    print(f"\n=== CHUNK SUMMARY ===")
    print(f"  processed: {processed}, matched: {matched}, unmatched: {unmatched}")
    print(f"  elapsed: {time.time()-start:.0f}s")

if __name__ == '__main__':
    main()
