#!/usr/bin/env python3
"""
Playwright-based product image scraper for the Crescendo catalog.

Strategy (per product):
  1. Manufacturer-direct: Try brand-specific URL patterns (Roland, Boss, etc.)
     Extract og:image from the product page. Trusted source — no VLM needed.
  2. z-ai image search: Fallback for brands without known URL patterns.
     VLM-verified.

Concurrency: 5 parallel browser contexts, with per-domain staggering.
Resumability: Reads results.json to skip already-processed products.
              Writes to results.json after every single product.
Decoupled from commit: Scraping writes to results queue only.
                       Apply step (separate script) merges to products.ts.
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
import urllib.parse
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path('/home/z/my-project/crescendo')
PRODUCTS_FILE = ROOT / 'src/data/products.ts'
RESULTS_FILE = ROOT / 'scripts-audit' / 'scraper-results.jsonl'  # JSONL for incremental writes
CANDIDATES_DIR = Path('/home/z/my-project/scripts/test-batch/candidates')
TARGET_SIZE = (1024, 1024)

# ---- Locks ----
results_lock = threading.Lock()
domain_locks = {}  # per-domain rate limiting
domain_locks_lock = threading.Lock()

def get_domain_lock(domain):
    with domain_locks_lock:
        if domain not in domain_locks:
            domain_locks[domain] = threading.Lock()
        return domain_locks[domain]

# ---- Browser pool ----
_browser = None
_contexts = []
_context_pool = []
_context_pool_lock = threading.Lock()
_playwright = None

def init_browser(pool_size=5):
    """Initialize Playwright browser with a pool of contexts."""
    global _browser, _playwright
    from playwright.sync_api import sync_playwright
    _playwright = sync_playwright().start()
    _browser = _playwright.chromium.launch(
        headless=True,
        args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    )
    for _ in range(pool_size):
        ctx = _browser.new_context(
            user_agent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1280, 'height': 800},
            locale='en-US',
        )
        # Block heavy resources on search pages
        ctx.route('**/*.{woff,woff2,ttf}', lambda route: route.abort())
        _contexts.append(ctx)
        _context_pool.append(ctx)

def get_context():
    """Get a browser context from the pool."""
    with _context_pool_lock:
        while not _context_pool:
            _context_pool_lock.wait(0.1)
        return _context_pool.pop(0)

def release_context(ctx):
    """Return a browser context to the pool."""
    with _context_pool_lock:
        _context_pool.append(ctx)
        _context_pool_lock.notify_all()

def shutdown_browser():
    global _browser, _playwright
    if _browser:
        for ctx in _contexts:
            try: ctx.close()
            except: pass
        _browser.close()
    if _playwright:
        _playwright.stop()

# ---- Manufacturer URL patterns ----
def _slug(s):
    """Convert product name to URL slug."""
    return s.lower().replace(' ', '-').replace('/', '-').replace('+', '-')

MANUFACTURER_PATTERNS = {
    'roland': lambda brand, model: f'https://www.roland.com/global/products/{_slug(model)}/',
    'boss': lambda brand, model: f'https://www.boss.info/global/products/{_slug(model)}/',
}

# Brands where we know the URL pattern works
KNOWN_BRANDS = set(MANUFACTURER_PATTERNS.keys())

def extract_og_image(html):
    """Extract og:image from HTML."""
    m = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
    if m: return m.group(1)
    m = re.search(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
    if m: return m.group(1)
    return None

def fetch_page(url, timeout=15000):
    """Fetch a page using Playwright from the pool."""
    ctx = get_context()
    page = ctx.new_page()
    try:
        page.goto(url, timeout=timeout, wait_until='domcontentloaded')
        page.wait_for_timeout(1500)
        html = page.content()
        return html
    except Exception:
        return None
    finally:
        page.close()
        release_context(ctx)

def try_manufacturer(brand, model):
    """Try manufacturer-direct URL pattern. Returns (image_url, product_url) or (None, None)."""
    brand_key = brand.lower().split()[0]
    if brand_key not in MANUFACTURER_PATTERNS:
        return None, None
    url_fn = MANUFACTURER_PATTERNS[brand_key]
    product_url = url_fn(brand, model)
    # Stagger requests to same domain
    domain = urllib.parse.urlparse(product_url).netloc
    with get_domain_lock(domain):
        time.sleep(1)  # 1s between requests to same domain
        html = fetch_page(product_url)
    if not html:
        return None, None
    og_image = extract_og_image(html)
    if og_image and 'sorry' not in og_image.lower() and 'nopic' not in og_image.lower() and 'ogp.jpg' not in og_image.lower():
        return og_image, product_url
    return None, None

# ---- z-ai fallback ----
def zai_image_search(query, count=3):
    """Call z-ai image-search with rate limiting."""
    cmd = ['z-ai', 'image-search', '--query', query, '--count', str(count), '--gl', 'us', '--no-rank']
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            return [], f'z-ai error: {result.stderr[:100]}'
        out = result.stdout
        idx = out.find('{')
        if idx < 0: return [], 'no JSON'
        data = json.loads(out[idx:])
        if not data.get('success'):
            return [], f"api error: {data.get('error')}"
        return data.get('results', []), None
    except Exception as e:
        return [], str(e)

def vlm_verify(image_path, brand, product_name):
    """VLM verification. Returns (score, reason)."""
    prompt = (
        f"You are auditing an e-commerce product image. Brand: {brand}, Product: {product_name}\n"
        f"Respond as STRICT JSON only:\n"
        f'{{"shown_product": "...", "brand_match": "yes|no|unclear", "product_match": "yes|no|unclear", "score": 0-100, "reason": "one sentence"}}'
    )
    cmd = ['z-ai', 'vision', '-p', prompt, '-i', os.path.abspath(image_path)]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        out = result.stdout
        idx = out.find('{'); end = out.rfind('}')
        if idx < 0 or end < 0: return 0, 'no JSON'
        outer = json.loads(out[idx:end+1])
        content = outer.get('choices', [{}])[0].get('message', {}).get('content', '')
        content = content.strip()
        if content.startswith('```'):
            content = '\n'.join(l for l in content.split('\n') if not l.startswith('```'))
        cidx = content.find('{'); cend = content.rfind('}')
        if cidx < 0 or cend < 0: return 0, 'prose'
        obj = json.loads(content[cidx:cend+1])
        return int(obj.get('score', 0)), obj.get('reason', '')
    except Exception as e:
        return 0, f'error: {e}'

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

# ---- Main scraper ----

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
    """Load IDs from both the scraper results JSONL and the existing results.json."""
    done = set()
    # Existing results.json (from prior z-ai runs)
    old_results = ROOT / 'scripts-audit' / 'results.json'
    if old_results.exists():
        try:
            with open(old_results) as f:
                done = {r['id'] for r in json.load(f)}
        except: pass
    # Scraper results JSONL
    if RESULTS_FILE.exists():
        with open(RESULTS_FILE) as f:
            for line in f:
                line = line.strip()
                if line:
                    try: done.add(json.loads(line)['id'])
                    except: pass
    return done

def append_result(result):
    """Append a result to the JSONL file (per-product checkpoint)."""
    with results_lock:
        with open(RESULTS_FILE, 'a') as f:
            f.write(json.dumps(result) + '\n')
            f.flush()

def extract_model(brand, name):
    """Extract model from product name (drop brand prefix and generic words)."""
    generic = {'classic', 'guitar', 'acoustic', 'electric', 'professional', 'standard', 'edition', 'series'}
    name_clean = name.replace('/', ' ')
    parts = [w for w in name_clean.split() if w.lower() not in generic]
    if parts and parts[0].lower() == brand.lower().split()[0]:
        parts = parts[1:]
    while parts and parts[0].isdigit():
        parts = parts[1:]
    return ' '.join(parts[:4])

def scrape_product(prod):
    """Scrape an image for one product. Returns result dict."""
    pid = prod['id']; slug = prod['slug']; cat = prod['category']
    brand = prod['brand']; name = prod['name']
    dest_path = ROOT / 'public' / 'products' / cat / f'{slug}.webp'
    result = {
        'id': pid, 'slug': slug, 'category': cat, 'brand': brand, 'name': name,
        'old_image': prod['image'], 'new_image': None, 'matched': False,
        'source_url': None, 'score': 0, 'reason': '', 'provider': None,
    }
    # Skip if already sourced
    if dest_path.exists():
        result['matched'] = True
        result['new_image'] = f'/products/{cat}/{slug}.webp'
        result['score'] = 99
        result['reason'] = 'already sourced'
        result['provider'] = 'prior-run'
        return result

    model = extract_model(brand, name)
    cand_dir = CANDIDATES_DIR / pid
    cand_dir.mkdir(parents=True, exist_ok=True)

    # ---- PATH 1: Manufacturer-direct (trusted, ~3-5s, no VLM) ----
    brand_key = brand.lower().split()[0]
    if brand_key in MANUFACTURER_PATTERNS:
        try:
            img_url, product_url = try_manufacturer(brand, model)
            if img_url:
                ext = '.jpg'
                if '.png' in img_url.lower(): ext = '.png'
                elif '.webp' in img_url.lower(): ext = '.webp'
                cand_path = cand_dir / f'mfg{ext}'
                if download_image(img_url, str(cand_path)):
                    try:
                        process_image_to_square(cand_path, dest_path)
                        result['matched'] = True
                        result['new_image'] = f'/products/{cat}/{slug}.webp'
                        result['score'] = 95
                        result['reason'] = f'manufacturer-direct: {brand_key}'
                        result['source_url'] = img_url
                        result['provider'] = 'manufacturer'
                        return result
                    except: pass
        except: pass

    # ---- PATH 2: z-ai image search + VLM (fallback) ----
    query = f'{brand} {model} product photo'
    query = ' '.join(query.split())[:100]
    candidates, err = zai_image_search(query, count=3)
    result['provider'] = 'z-ai'
    if err or not candidates:
        result['error'] = f'z-ai: {err or "no results"}'
        return result
    best = None
    for i, cand in enumerate(candidates):
        url = cand.get('original_url')
        if not url: continue
        ext = '.jpg'
        if '.png' in url.lower(): ext = '.png'
        elif '.webp' in url.lower(): ext = '.webp'
        cand_path = cand_dir / f'c-{i:02d}{ext}'
        if not download_image(url, str(cand_path)): continue
        score, reason = vlm_verify(str(cand_path), brand, name)
        if best is None or score > best[0]:
            best = (score, cand, cand_path, reason)
        if score >= 85: break
        time.sleep(0.5)
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
    """Thread worker — wraps scrape_product with error handling."""
    try:
        return scrape_product(prod)
    except Exception as e:
        return {'id':prod['id'],'slug':prod['slug'],'category':prod['category'],
                'brand':prod['brand'],'name':prod['name'],'old_image':prod['image'],
                'new_image':None,'matched':False,'source_url':None,'score':0,
                'reason':'','provider':None,'error':f'exception: {e}'}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('chunk_size', type=int, nargs='?', default=20, help='Number of products to process')
    parser.add_argument('--workers', type=int, default=5, help='Parallel browser contexts')
    args = parser.parse_args()

    all_products = load_all_products()
    done_ids = load_done_ids()
    remaining = [p for p in all_products if p['id'] not in done_ids]
    chunk = remaining[:args.chunk_size]
    print(f"=== Scraper: {len(chunk)} of {len(remaining)} remaining (workers={args.workers}) ===")
    print(f"Total done: {len(done_ids)} / {len(all_products)}")
    print()

    init_browser(pool_size=args.workers)
    start = time.time()
    processed = 0
    matched = 0
    mfg_matched = 0
    zai_matched = 0

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
            futures = {executor.submit(worker, prod): prod for prod in chunk}
            for f in concurrent.futures.as_completed(futures):
                prod = futures[f]
                try:
                    r = f.result()
                except Exception as e:
                    r = {'id':prod['id'],'slug':prod['slug'],'brand':prod['brand'],'name':prod['name'],
                         'matched':False,'error':f'future: {e}','provider':None}
                processed += 1
                # Write result immediately (per-product checkpoint)
                append_result(r)
                if r['matched']:
                    matched += 1
                    if r.get('provider') == 'manufacturer':
                        mfg_matched += 1
                    elif r.get('provider') == 'z-ai':
                        zai_matched += 1
                status = 'M' if r['matched'] else 'U'
                prov = r.get('provider') or '?'
                elapsed = time.time() - start
                print(f"[{processed}/{len(chunk)}] {r['id']:<18} {r['brand']:<18} {r['name'][:38]:<38} -> {status} s={r.get('score',0):>3} via={prov:<8} (t={elapsed:.0f}s)")
    finally:
        shutdown_browser()

    print(f"\n=== CHUNK SUMMARY ===")
    print(f"  processed: {processed}")
    print(f"  matched: {matched} (manufacturer: {mfg_matched}, z-ai: {zai_matched})")
    print(f"  unmatched: {processed - matched}")
    print(f"  elapsed: {time.time()-start:.0f}s")
    print(f"\nResults written to: {RESULTS_FILE}")

if __name__ == '__main__':
    main()
