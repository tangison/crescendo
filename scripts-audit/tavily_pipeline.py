#!/usr/bin/env python3
"""
Tavily-based product image pipeline.
Searches Tavily for product images, uses description-based confidence scoring.
Writes to scripts-audit/scraper-results.jsonl (per-product, incremental).
Does NOT touch products.ts — run apply_scraper_results.py separately.
"""
import argparse
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import threading
import time
import urllib.request
import urllib.error
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path('/home/z/my-project/crescendo')
PRODUCTS_FILE = ROOT / 'src/data/products.ts'
RESULTS_FILE = ROOT / 'scripts-audit' / 'scraper-results.jsonl'
CANDIDATES_DIR = Path('/home/z/my-project/scripts/test-batch/candidates')
TARGET_SIZE = (1024, 1024)

TAVILY_API_KEY = os.environ.get('TAVILY_API_KEY', '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')

results_lock = threading.Lock()
_tavily_client = threading.local()

def get_tavily():
    if not hasattr(_tavily_client, 'client'):
        from tavily import TavilyClient
        _tavily_client.client = TavilyClient(api_key=TAVILY_API_KEY)
    return _tavily_client.client

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
    with results_lock:
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

def tavily_search(query, count=5):
    try:
        client = get_tavily()
        response = client.search(
            query=query,
            include_images=True,
            include_image_descriptions=True,
            max_results=3,
        )
        images = response.get('images', [])
        candidates = []
        for img in images[:count]:
            if isinstance(img, dict):
                url = img.get('url', '')
                desc = img.get('description', '')
                if url:
                    candidates.append({'original_url': url, 'description': desc})
            elif isinstance(img, str):
                candidates.append({'original_url': img, 'description': ''})
        return candidates, None
    except Exception as e:
        return [], str(e)

def source_product(prod):
    pid = prod['id']; slug = prod['slug']; cat = prod['category']
    brand = prod['brand']; name = prod['name']
    dest_path = ROOT / 'public' / 'products' / cat / f'{slug}.webp'
    result = {
        'id': pid, 'slug': slug, 'category': cat, 'brand': brand, 'name': name,
        'old_image': prod['image'], 'new_image': None, 'matched': False,
        'source_url': None, 'score': 0, 'reason': '', 'provider': 'tavily',
    }
    if dest_path.exists():
        result['matched'] = True
        result['new_image'] = f'/products/{cat}/{slug}.webp'
        result['score'] = 99
        result['reason'] = 'already sourced'
        result['provider'] = 'prior-run'
        return result

    model = extract_model(brand, name)
    query = f'{brand} {model} product photo'
    query = ' '.join(query.split())[:100]

    cand_dir = CANDIDATES_DIR / pid
    cand_dir.mkdir(parents=True, exist_ok=True)

    candidates, err = tavily_search(query, count=5)
    if err or not candidates:
        result['error'] = f'tavily: {err or "no results"}'
        return result

    # Extract key words for description matching
    brand_lower = brand.lower().split()[0]
    generic = {'classic', 'guitar', 'acoustic', 'electric', 'professional', 'standard', 'edition', 'series', 'product', 'photo'}
    name_words = set(w.lower() for w in name.replace('/', ' ').split() if len(w) > 2 and w.lower() not in generic and not w.isdigit())

    best = None
    for i, cand in enumerate(candidates):
        url = cand.get('original_url')
        if not url: continue
        ext = '.jpg'
        if '.png' in url.lower(): ext = '.png'
        elif '.webp' in url.lower(): ext = '.webp'
        cand_path = cand_dir / f'c-{i:02d}{ext}'
        if not download_image(url, str(cand_path)): continue

        desc = (cand.get('description') or '').lower()
        if not desc:
            score = 60
            reason = 'no description, generic match'
        elif brand_lower in desc:
            matched_words = [w for w in name_words if w in desc]
            if len(matched_words) >= 2:
                score = 95
                reason = f'brand + {len(matched_words)} keywords in description'
            elif len(matched_words) >= 1:
                score = 90
                reason = f'brand + 1 keyword in description'
            else:
                score = 85
                reason = 'brand in description'
        elif any(w in desc for w in name_words):
            matched_words = [w for w in name_words if w in desc]
            score = 75
            reason = f'{len(matched_words)} keywords in description (no brand)'
        else:
            score = 60
            reason = 'description exists but no keyword match'

        if best is None or score > best[0]:
            best = (score, cand, cand_path, reason)
        if score >= 90: break
        time.sleep(0.2)

    if best is None:
        result['error'] = 'no candidates downloaded'
        return result
    score, cand, cand_path, reason = best
    result['source_url'] = cand.get('original_url')
    result['score'] = score
    result['reason'] = reason
    if score < 60:
        result['error'] = f'best score {score} < 60'
        return result
    try:
        process_image_to_square(cand_path, dest_path)
    except Exception as e:
        result['error'] = f'processing: {e}'
        return result
    result['matched'] = True
    result['new_image'] = f'/products/{cat}/{slug}.webp'
    return result

def worker(prod):
    try:
        return source_product(prod)
    except Exception as e:
        return {'id':prod['id'],'slug':prod['slug'],'category':prod['category'],
                'brand':prod['brand'],'name':prod['name'],'old_image':prod['image'],
                'new_image':None,'matched':False,'source_url':None,'score':0,
                'reason':'','provider':'tavily','error':f'exception: {e}'}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('chunk_size', type=int, nargs='?', default=50)
    parser.add_argument('--workers', type=int, default=5)
    args = parser.parse_args()

    all_products = load_all_products()
    done_ids = load_done_ids()
    remaining = [p for p in all_products if p['id'] not in done_ids]
    chunk = remaining[:args.chunk_size]
    print(f"=== Tavily pipeline: {len(chunk)} of {len(remaining)} remaining (workers={args.workers}) ===")
    print(f"Total done: {len(done_ids)} / {len(all_products)}")
    print()

    start = time.time()
    processed = 0; matched = 0; unmatched = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(worker, prod): prod for prod in chunk}
        for f in concurrent.futures.as_completed(futures):
            prod = futures[f]
            try:
                r = f.result()
            except Exception as e:
                r = {'id':prod['id'],'matched':False,'error':f'future: {e}','provider':'tavily'}
            processed += 1
            append_result(r)
            if r['matched']: matched += 1
            else: unmatched += 1
            status = 'M' if r['matched'] else 'U'
            elapsed = time.time() - start
            print(f"[{processed}/{len(chunk)}] {r['id']:<18} {r['brand']:<14} {r['name'][:38]:<38} -> {status} s={r.get('score',0):>3} ({elapsed:.0f}s)")

    print(f"\n=== CHUNK SUMMARY ===")
    print(f"  processed: {processed}, matched: {matched}, unmatched: {unmatched}")
    print(f"  elapsed: {time.time()-start:.0f}s")

if __name__ == '__main__':
    main()
