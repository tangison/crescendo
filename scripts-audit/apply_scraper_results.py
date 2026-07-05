#!/usr/bin/env python3
"""
Apply script: merge scraper results (JSONL) into products.ts, build, commit, push.
Also merges into the main results.json so the pipeline stays consistent.

Reads from:
  - scripts-audit/scraper-results.jsonl (new scraper results)
  - scripts-audit/results.json (existing results from prior runs)

Writes to:
  - src/data/products.ts (updates image paths for high-confidence matches)
  - scripts-audit/results.json (merges new results)
  - scripts-audit/needs-spot-check.csv (60-84 confidence)
  - scripts-audit/unmatched-products.csv (<60 confidence)
"""
import csv
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path('/home/z/my-project/crescendo')
PRODUCTS_FILE = ROOT / 'src/data/products.ts'
SCRAPER_RESULTS = ROOT / 'scripts-audit' / 'scraper-results.jsonl'
RESULTS_JSON = ROOT / 'scripts-audit' / 'results.json'
SPOTCHECK_CSV = ROOT / 'scripts-audit' / 'needs-spot-check.csv'
UNMATCHED_CSV = ROOT / 'scripts-audit' / 'unmatched-products.csv'

AUTO_APPLY_THRESHOLD = 85
SPOTCHECK_THRESHOLD = 60

def run(cmd, timeout=120, cwd=None):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout, cwd=cwd)
        return r.returncode, r.stdout, r.stderr
    except: return 1, '', 'timeout/error'

def load_scraper_results():
    """Load all results from JSONL file."""
    results = []
    if SCRAPER_RESULTS.exists():
        with open(SCRAPER_RESULTS) as f:
            for line in f:
                line = line.strip()
                if line:
                    try: results.append(json.loads(line))
                    except: pass
    return results

def load_existing_results():
    """Load existing results.json."""
    if RESULTS_JSON.exists():
        with open(RESULTS_JSON) as f:
            return json.load(f)
    return []

def merge_results(existing, new):
    """Merge new results into existing. Dedup by product ID."""
    by_id = {r['id']: r for r in existing}
    for r in new:
        by_id[r['id']] = r  # new overwrites old
    return list(by_id.values())

def apply_to_products_ts(updates):
    """Apply image updates to products.ts. Returns count of applied updates."""
    if not updates: return 0
    src = open(PRODUCTS_FILE).read()
    pattern = re.compile(
        r'(\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*'
        r'brand:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*'
        r'price:\s*[\d.]+,\s*qty:\s*\d+,\s*skillLevel:\s*"[^"]+",\s*'
        r'image:\s*)"(/products/[^"]+)"'
    )
    applied = 0
    matches = list(pattern.finditer(src))
    matches.sort(key=lambda m: -m.start())
    new_src = src
    for m in matches:
        pid = m.group(2)
        if pid not in updates: continue
        old_img = m.group(7); new_img = updates[pid]
        if old_img == new_img: continue
        old_full = m.group(0)
        new_full = old_full.replace(f'image: "{old_img}"', f'image: "{new_img}"', 1)
        if new_src[m.start():m.end()] != old_full: continue
        new_src = new_src[:m.start()] + new_full + new_src[m.end():]
        applied += 1
    with open(PRODUCTS_FILE, 'w') as f: f.write(new_src)
    return applied

def append_csv(path, header, rows):
    write_header = not path.exists() or path.stat().st_size == 0
    with open(path, 'a', newline='') as f:
        w = csv.writer(f)
        if write_header: w.writerow(header)
        for row in rows: w.writerow(row)

def main():
    print("=== APPLY STEP ===")
    # Load results
    scraper_results = load_scraper_results()
    existing_results = load_existing_results()
    print(f"Scraper results: {len(scraper_results)}")
    print(f"Existing results.json: {len(existing_results)}")

    if not scraper_results:
        print("No new scraper results to apply. Exiting.")
        return

    # Merge
    merged = merge_results(existing_results, scraper_results)
    print(f"Merged: {len(merged)}")

    # Categorize
    auto_apply = {}
    spot_check_rows = []
    unmatched_rows = []
    for r in merged:
        if r.get('matched') and r.get('score', 0) >= AUTO_APPLY_THRESHOLD and r.get('new_image'):
            auto_apply[r['id']] = r['new_image']
        elif r.get('matched') and SPOTCHECK_THRESHOLD <= r.get('score', 0) < AUTO_APPLY_THRESHOLD:
            spot_check_rows.append([
                r.get('id',''), r.get('slug',''), r.get('category',''), r.get('brand',''),
                r.get('name',''), r.get('old_image',''), r.get('new_image',''),
                r.get('score',0), r.get('source_url',''), (r.get('reason','') or '')[:200],
                r.get('provider','')
            ])
        elif not r.get('matched'):
            unmatched_rows.append([
                r.get('id',''), r.get('slug',''), r.get('category',''), r.get('brand',''),
                r.get('name',''), r.get('old_image',''), r.get('score',0),
                (r.get('reason','') or '')[:200], r.get('error','') or '', r.get('provider','')
            ])

    print(f"\nCategorization:")
    print(f"  auto-apply (>=85): {len(auto_apply)}")
    print(f"  needs-spot-check (60-84): {len(spot_check_rows)}")
    print(f"  unmatched (<60): {len(unmatched_rows)}")

    # Save merged results.json
    with open(RESULTS_JSON, 'w') as f:
        json.dump(merged, f, indent=2)
    print(f"\nSaved merged results.json: {len(merged)} entries")

    # Apply to products.ts
    applied = apply_to_products_ts(auto_apply)
    print(f"Applied {applied} image updates to products.ts")

    # Write CSVs
    if spot_check_rows:
        append_csv(SPOTCHECK_CSV,
            ['id','slug','category','brand','name','old_image','new_image','score','source_url','reason','provider'],
            spot_check_rows)
    if unmatched_rows:
        append_csv(UNMATCHED_CSV,
            ['id','slug','category','brand','name','old_image','best_score','reason','error','provider'],
            unmatched_rows)

    # Clear the scraper JSONL (results are now merged into results.json)
    SCRAPER_RESULTS.unlink()
    print(f"Cleared {SCRAPER_RESULTS} (merged into results.json)")

    # Build
    print(f"\n=== BUILD ===")
    rc, _, err = run('bun run build', timeout=300, cwd=ROOT)
    if rc != 0:
        print(f"BUILD FAIL: {err[-300:]}")
        return
    print("build OK")

    # Commit + push
    run('git add -A', cwd=ROOT)
    total_done = len(merged)
    matched_count = sum(1 for r in merged if r.get('matched') and r.get('score', 0) >= AUTO_APPLY_THRESHOLD)
    msg = f"feat(products): scraper batch — {total_done}/1640 processed, {matched_count} auto-applied"
    rc, _, _ = run(f'git commit -m "{msg}"', cwd=ROOT)
    if rc == 0: print("committed")
    else: print("nothing to commit")
    rc, _, err = run('git push origin main', timeout=60, cwd=ROOT)
    if rc == 0: print("pushed")
    else: print(f"push fail: {err[:200]}")

    print(f"\n=== APPLY COMPLETE ===")
    print(f"  total processed: {total_done} / 1640")
    print(f"  auto-applied (>=85): {matched_count}")
    print(f"  needs-spot-check: {len(spot_check_rows)}")
    print(f"  unmatched: {len(unmatched_rows)}")

if __name__ == '__main__':
    main()
