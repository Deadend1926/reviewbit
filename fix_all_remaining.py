#!/usr/bin/env python3
"""
Fix remaining remote image references in:
1. CSS background-image: url(https://webassets...)
2. JSON-LD "image": "https://webassets..."
"""

import re
import urllib.request
import urllib.error
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(r"C:\Users\rites\Downloads\code\WithSantosh\ReviewBit\jumptest_io\jumptask.io")
IMAGE_DIR = BASE_DIR / "_next" / "image"
REMOTE_BASE = "https://webassets-wordpress-prod.jumptask.io"

# Pattern for ANY remaining remote URL
ANY_REMOTE_PAT = re.compile(
    r'https://webassets-wordpress-prod\.jumptask\.io(/uploads/[^\s"\')\>]+)',
    re.IGNORECASE
)

def get_relative_prefix(html_file: Path) -> str:
    rel = html_file.relative_to(BASE_DIR)
    depth = len(rel.parts) - 1
    return "../" * depth

def get_local_filename(url_path: str) -> str:
    return url_path.rstrip("/").split("/")[-1]

def download_image(url: str, dest_path: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        dest_path.write_bytes(data)
        return True
    except urllib.error.HTTPError as e:
        print(f"    HTTP {e.code}: {url}")
        return False
    except Exception as e:
        print(f"    ERROR: {url}: {e}")
        return False

# Step 1: Collect all remaining unique remote URLs
print("Step 1: Collecting remaining remote URLs...")
all_remaining_urls = set()

for html_file in BASE_DIR.rglob("*.html"):
    try:
        content = html_file.read_text(encoding="utf-8", errors="replace")
    except:
        continue
    if "webassets-wordpress-prod.jumptask.io" not in content:
        continue
    for m in ANY_REMOTE_PAT.finditer(content):
        all_remaining_urls.add(REMOTE_BASE + m.group(1))

print(f"  Found {len(all_remaining_urls)} unique remaining remote URLs")

# Step 2: Build existing images map
existing = {f.name.lower(): f.name for f in IMAGE_DIR.iterdir() if f.is_file()}

# Step 3: Download missing images
print("\nStep 2: Downloading missing images...")
url_to_filename = {}  # full_url -> local filename
downloaded = skipped = failed = 0

for url in sorted(all_remaining_urls):
    url_path = url.replace(REMOTE_BASE, "")
    filename = get_local_filename(url_path)
    local_path = IMAGE_DIR / filename

    if filename.lower() in existing:
        url_to_filename[url] = existing[filename.lower()]
        skipped += 1
    else:
        print(f"  Downloading: {filename}")
        if download_image(url, local_path):
            url_to_filename[url] = filename
            existing[filename.lower()] = filename
            downloaded += 1
            print(f"    -> Saved")
        else:
            url_to_filename[url] = None
            failed += 1

print(f"  Downloaded: {downloaded}, Already existed: {skipped}, Failed: {failed}")

# Step 4: Replace all remaining remote URLs in HTML files
print("\nStep 3: Updating HTML files...")

files_updated = 0
total_replacements = 0

for html_file in sorted(BASE_DIR.rglob("*.html")):
    try:
        content = html_file.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        print(f"  ERROR: {html_file}: {e}")
        continue

    if "webassets-wordpress-prod.jumptask.io" not in content:
        continue

    prefix = get_relative_prefix(html_file)
    count = [0]

    def replacer(m, _prefix=prefix, _count=count):
        url_path = m.group(1)
        full_url = REMOTE_BASE + url_path
        local_filename = url_to_filename.get(full_url)
        if local_filename:
            _count[0] += 1
            return f'{_prefix}_next/image/{local_filename}'
        return m.group(0)

    new_content = ANY_REMOTE_PAT.sub(replacer, content)

    if new_content != content:
        html_file.write_text(new_content, encoding="utf-8")
        files_updated += 1
        total_replacements += count[0]
        rel_path = html_file.relative_to(BASE_DIR)
        print(f"  Updated ({count[0]:3d}): {rel_path}")

print(f"\nDone! Updated {files_updated} files, {total_replacements} replacements.")

# Final verification
remaining_count = sum(
    1 for f in BASE_DIR.rglob("*.html")
    if "webassets-wordpress-prod.jumptask.io" in f.read_text(encoding="utf-8", errors="replace")
)
print(f"Files still containing remote URLs: {remaining_count}")
